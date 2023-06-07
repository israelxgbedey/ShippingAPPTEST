import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserAuth } from './context/AuthContext';
import NavigationBar from './Components/NavigationBar';
import ShipmentCalculator from './ShipmentCalculator';
import { useSpring, animated, useTransition } from 'react-spring';
import { FaCalculator } from 'react-icons/fa';
import './Post.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { user } = UserAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [searchQuery]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting user location:', error);
          setLoadingLocation(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoadingLocation(false);
    }
  }, []);

  const fetchPosts = () => {
    axios
      .get('http://localhost:4000/api/posts', {
        params: {
          countryName: searchQuery, // Send the searchQuery as a query parameter
        },
      })
      .then((response) => {
        const postsWithLocationPromises = response.data.map((post) => {
          const { city, country } = post;

          // Return a promise for each post
          return axios
            .get('https://maps.googleapis.com/maps/api/geocode/json', {
              params: {
                address: `${city}, ${country}`,
                key: 'AIzaSyBI6Vmsf6mY12_qUQXVfaTVEhQH7cP8CI0',
              },
            })
            .then((response) => {
              const { results } = response.data;
              if (results.length > 0) {
                const { lat, lng } = results[0].geometry.location;
                post.latitude = lat;
                post.longitude = lng;
              }
              return post; // Return the post with location
            })
            .catch((error) => {
              console.error('Error fetching coordinates:', error);
              return post; // Return the post even if there was an error
            });
        });

        // Wait for all promises to resolve
        Promise.all(postsWithLocationPromises)
          .then((postsWithLocation) => {
            setPosts(postsWithLocation);
          })
          .catch((error) => {
            console.error('Error fetching posts with location:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  };

  const loggedInEmail = user ? user.email : '';

  const deletePost = (postId) => {
    axios
      .delete(`http://localhost:4000/api/posts/${postId}`, {
        headers: {
          'X-User-Email': loggedInEmail,
        },
        data: {
          email: loggedInEmail,
        },
      })
      .then((response) => {
        console.log('Post deleted:', response.data);
        setPosts(posts.filter((post) => post.id !== postId));
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  };

  const handlePostClick = (postId) => {
    setSelectedPostId((prevSelectedPostId) => {
      if (prevSelectedPostId === postId) {
        return null;
      } else {
        return postId;
      }
    });
  };

  const handleSearch = () => {
    fetchPosts();
  };

  const filteredPosts = searchQuery
    ? posts.filter((post) =>
        post.country && post.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  const PostCard = ({ post, userLocation }) => {
    const showCalculator = selectedPostId === post.id;

    const [lineAnimation, setLineAnimation] = useState(false);

    const handleIconClick = () => {
      setSelectedPostId(post.id);
      setLineAnimation(true); // Start the line animation when the icon is clicked
    };

    const handleCalculatorClick = (e) => {
      e.stopPropagation();
    };

    const transition = useTransition(showCalculator, {
      from: { opacity: 0, height: 0 },
      enter: { opacity: 1, height: 'auto' },
      leave: { opacity: 0, height: 0 },
    });

    const lineStyle = useSpring({
      from: { strokeDashoffset: 800 },
      to: { strokeDashoffset: lineAnimation ? 0 : 800 },
      config: { duration: 1000 },
    });

    return (
      <div>
        <h2>{post.title}</h2>
        <span>{post.content}</span>
        <span>Country: {post.country}</span>
        {post.city && <span>City: {post.city}</span>}


        <span>Email: {post.email}</span>

        <div className="icon-wrapper" onClick={handleIconClick}>
          <FaCalculator className="calculator-icon" />
          {/* Glowing line */}
           <div className="time-wrapper">
          <div className="departure-time">Departure Time: {post.departureTime}</div>

          <svg width="200px" height="100%" className="glowing-line">
            <animated.line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              style={lineStyle}
              stroke="#4CAF50"
              strokeWidth="2"
              strokeDasharray="5"
            />
          </svg>
          <div className="landing-time">Landing Time:  {post.landingTime}</div>

          </div>                                    


        </div>

        {transition(
          (style, item) =>
            item && (
              <animated.div style={style} onClick={handleCalculatorClick}>
                <ShipmentCalculator
                  userLocation={userLocation}
                  postLocation={{ latitude: post.latitude, longitude: post.longitude }}
                />
              </animated.div>
            )
        )}

        <span>
          Phone Number:
          <a href={`https://wa.me/${post.phoneNumber}`} target="_blank" rel="noopener noreferrer">
            {post.phoneNumber}
          </a>
        </span>
        {loggedInEmail === post.email && (
          <button className="delete-button" onClick={() => deletePost(post.id)}>
            Delete
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <NavigationBar />

      <h1>Where to ship?</h1>

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by country"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {filteredPosts.length === 0 ? (
        <span className="No-posts-found">No posts found.</span>
      ) : (
        filteredPosts.map((post) => (
          <div
            className={`post-card ${selectedPostId === post.id ? 'selected' : ''}`}
            key={post.id}
            onClick={() => handlePostClick(post.id)}
          >
            {loadingLocation ? (
              <div>Loading location...</div>
            ) : (
              userLocation && (
                <PostCard
                  post={post}
                  userLocation={userLocation}
                />
              )
            )}
          </div>
        ))
      )}
    </div>
  );
};

export { Posts };






