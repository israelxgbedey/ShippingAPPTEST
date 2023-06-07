import React, { useState } from 'react';
import './App.css';
import NavigationBar from './Components/NavigationBar';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import { UserAuth } from './context/AuthContext';
import ShipmentCalculator from './ShipmentCalculator';

function App() {
  const [isDimmed, setIsDimmed] = useState(true);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [landingTime, setLandingTime] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [createdPosts, setCreatedPosts] = useState([]);

  const NavbarStyles = {
    zIndex: 999,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
  };
  function formatTime(time) {
    const dateTime = new Date(time);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  const AnimatedText = () => {
    const [shouldAnimate, setShouldAnimate] = useState(true);

    const animationProps = useSpring({
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0px)' },
      config: { duration: 1000 },
      onRest: () => {
        if (shouldAnimate) {
          setShouldAnimate(false);
          setShouldAnimate(true);
        }
      },
    });

    return <animated.div style={animationProps}></animated.div>;
  };

  const toggleDimming = () => {
    setIsDimmed(!isDimmed);
  };

  const dimmedStyles = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transition: 'background-color 0.5s ease',
  };

  const notDimmedStyles = {
    backgroundColor: '#101010',
    transition: 'background-color 0.5s ease',
  };

  const styles = isDimmed ? dimmedStyles : notDimmedStyles;

  const toggleStyles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    margin: '20px',
  };

  const { user } = UserAuth(); // Moved outside handleFormSubmit

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert('You need to be logged in to create posts.');
      return;
    }

    console.log('Submitting form...');

    axios
      .post('http://localhost:4000/api/posts', {
        title: postTitle,
        content: postContent,
        country: selectedCountry,
        city: selectedCity,
        departureTime: departureTime,
        landingTime: landingTime,
        phoneNumber: phoneNumber,
        email: user.email, // Add the user's email to the post data
      })
      .then((response) => {
        console.log('Post created:', response.data);

        const newPost = {
          title: postTitle,
          content: postContent,
          country: selectedCountry,
          city: selectedCity,
          departureTime: departureTime,
          landingTime: landingTime,
          phoneNumber: phoneNumber,
          email: user.email, // Include the user's email in the created post
        };

        setCreatedPosts([...createdPosts, newPost]);

        setPostTitle('');
        setPostContent('');
        setSelectedCountry('');
        setSelectedCity('');
        setDepartureTime('');
        setLandingTime('');
        setPhoneNumber('');
      })
      .catch((error) => {
        console.error('Error creating post:', error);
      });
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedCity('');
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleDepartureTimeChange = (e) => {
    setDepartureTime(e.target.value);
  };

  const handleLandingTimeChange = (e) => {
    setLandingTime(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  return (
    <div className="App">
      <div></div>
      <body className="body-fade">
        <div style={styles}>
          <button style={toggleStyles} onClick={toggleDimming} className="M3-button">
            Too Bright?
          </button>
        </div>
        <NavigationBar style={NavbarStyles} />

        <header className="App-header">
          <AnimatedText />

          <form onSubmit={handleFormSubmit}>
            <label>
              Name:
              <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
            </label>
            <br />
            <label>
              traveler requirements  :
              <input value={postContent} onChange={(e) => setPostContent(e.target.value)}></input>
            </label>

            <br />
            <label className="select-label">
              <select className="select" value={selectedCountry} onChange={handleCountryChange}>
                <option value="">Select a country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="France">France</option> {/* Added France */}
                <option value="China">China</option> {/* Added China */}
                <option value="Ghana">Ghana</option> {/* Added Ghana */}
              </select>
            </label>
            <br />
            {selectedCountry && (
              <label className="select-label">
                <select className="select" value={selectedCity} onChange={handleCityChange}>
                  <option value="">Select a city</option>
                  {/* Add city options based on the selected country */}
                  {selectedCountry === 'USA' && (
                    <>
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                    </>
                  )}
                  {selectedCountry === 'Canada' && (
                    <>
                      <option value="Toronto">Toronto</option>
                      <option value="Vancouver">Vancouver</option>
                    </>
                  )}
                  {selectedCountry === 'UK' && (
                    <>
                      <option value="London">London</option>
                      <option value="Manchester">Manchester</option>
                    </>
                  )}
                  {selectedCountry === 'France' && ( 
                    <>
                      <option value="Paris">Paris</option>
                      <option value="Marseille">Marseille</option>
                      <option value="Lyon">Lyon</option>
                    </>
                  )}
                  {selectedCountry === 'China' && ( 
                    <>
                      <option value="Beijing">Beijing</option>
                      <option value="Shanghai">Shanghai</option>
                      <option value="Guangzhou">Guangzhou</option>
                    </>
                  )}
                  {selectedCountry === 'Ghana' && ( 
                    <>
                      <option value="Accra">Accra</option>
                      <option value="Kumasi">Kumasi</option>
                      <option value="Tema">Tema</option>
                    </>
                  )}
                </select>
              </label>
            )}
            <br />
            <label>
              Departure Time:
              <input type="datetime-local" value={departureTime} onChange={handleDepartureTimeChange} />
            </label>
            <br />
            <label>
              Landing Time:
              <input type="datetime-local" value={landingTime} onChange={handleLandingTimeChange} />
            </label>
            <br />
            <label>
              Phone Number:
              <input type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} />
            </label>
            <br />
            <button type="submit" className="ModernButton">Create Post</button>
          </form>
          {createdPosts.map((post, index) => (
  <div key={index} className="post-card">
    <h2 className="post-title">{post.title}</h2>
    <span className="post-content">{post.content}</span>
    <span className="post-info">Country: {post.country}</span>
    {post.city && <span className="post-info">City: {post.city}</span>}
    <span className="post-info">Departure Time: {formatTime(post.departureTime)}</span>
    <span className="post-info">Landing Time: {formatTime(post.landingTime)}</span>
    <span className="post-info">Phone Number: {post.phoneNumber}</span>
    <span className="post-info">Email: {post.email}</span> {/* Display the email in the created post */}
  </div>
))}

        </header>
        <div>
          <footer>
            <span className="inspiration">
            More info
            </span>
          </footer>
        </div>
      </body>
    </div>
  );
}

export default App;
