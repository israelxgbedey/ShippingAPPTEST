const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json'); // Replace with the path to your Firebase service account key

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create a Firestore instance
const db = admin.firestore();

// Create a new post
app.post('/api/posts', (req, res) => {
  const { title, content, country, city, departureTime, landingTime, phoneNumber, email, idPhotoUrl } = req.body;

  // Create a new post object
  const newPost = {
    title,
    content,
    country,
    city,
    departureTime,
    landingTime,
    phoneNumber,
    timestamp: new Date().toISOString(),
    email,
    idPhotoUrl, // Add the ID photo URL to the post object
  };

  // Add the post to the Firestore collection
  db.collection('posts')
    .add(newPost)
    .then((docRef) => {
      console.log('Post created:', docRef.id);
      res.status(201).json({ id: docRef.id });
    })
    .catch((error) => {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Error creating post' });
    });
});

// Get all posts
app.get('/api/posts', (req, res) => {
  const country = req.query.country?.toLowerCase(); // Convert to lowercase for case-insensitive search
  let query = db.collection('posts').orderBy('timestamp', 'desc');

  if (country) {
    // Filter posts by country if the country parameter is provided
    query = query.where('country', '==', country);
  }

  query
    .get()
    .then((snapshot) => {
      const posts = [];
      snapshot.forEach((doc) => {
        const post = doc.data();
        post.id = doc.id;
        posts.push(post);
      });
      res.json(posts);
    })
    .catch((error) => {
      console.error('Error getting posts:', error);
      res.status(500).json({ error: 'Error getting posts' });
    });
});

// Delete a post
app.delete('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  const userEmail = req.body.email;

  // Check if the authenticated user owns the post
  db.collection('posts')
    .doc(postId)
    .get()
    .then((doc) => {
      if (doc.exists && doc.data().email === userEmail) {
        // Delete the post if it exists and belongs to the user
        db.collection('posts')
          .doc(postId)
          .delete()
          .then(() => {
            console.log('Post deleted:', postId);
            res.sendStatus(204);
          })
          .catch((error) => {
            console.error('Error deleting post:', error);
            res.status(500).json({ error: 'Error deleting post' });
          });
      } else {
        // Return an error if the post doesn't exist or doesn't belong to the user
        console.error('Unauthorized access to delete post:', postId);
        res.status(403).json({ error: 'Unauthorized access' });
      }
    })
    .catch((error) => {
      console.error('Error checking post ownership:', error);
      res.status(500).json({ error: 'Error checking post ownership' });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
