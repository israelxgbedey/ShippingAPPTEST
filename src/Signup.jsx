import React, { useState, useRef, useEffect } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from './context/AuthContext';
import NavigationBar from './Components/NavigationBar';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [roleError, setRoleError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [idPhotoUrl, setIdPhotoUrl] = useState(null);
  const [idPhotoError, setIdPhotoError] = useState('');
  const [idPhotoCameraUrl, setIdPhotoCameraUrl] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const { createUser } = UserAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (isCameraOpen) {
      openCamera();
    }
  }, [isCameraOpen]);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value.toLowerCase();
    setRole(selectedRole);
    setRoleError('');

    localStorage.setItem('role', selectedRole);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
        setPhotoError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPhotoUrl(reader.result);
        setIdPhotoError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = () => {
    const videoConstraints = isFrontCamera ? { facingMode: 'user' } : { facingMode: { exact: 'environment' } };
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.log('Error accessing camera:', error);
      });
  };

const closeCamera = () => {
  const stream = videoRef.current.srcObject;
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
  }
  videoRef.current.srcObject = null;
  setIsCameraOpen(false);
};

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply a black-and-white filter
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = brightness;
      data[i + 1] = brightness;
      data[i + 2] = brightness;
    }
    context.putImageData(imageData, 0, 0);

    // Convert the canvas image to data URL
    const dataUrl = canvas.toDataURL();
    setIdPhotoCameraUrl(dataUrl);
    setIdPhotoError('');

    closeCamera();
  };

  const toggleCamera = () => {
    setIsFrontCamera((prevState) => !prevState);
    closeCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!role) {
      setRoleError('Role is required');
    }
    if (!photoUrl) {
      setPhotoError('Photo is required');
    }
    if (!idPhotoUrl && !idPhotoCameraUrl) {
      setIdPhotoError('ID photo is required');
    }
    if (role && photoUrl && (idPhotoUrl || idPhotoCameraUrl)) {
      const selectedIdPhotoUrl = idPhotoCameraUrl || idPhotoUrl;
      try {
        await createUser(email, password, role, phoneNumber, photoUrl, selectedIdPhotoUrl);
        navigate('/');
      } catch (e) {
        setError(e.message);
        console.log(e.message);
      }
    }
  };

  const handleCameraButtonClick = () => {
    setIsCameraOpen(true);
    formRef.current.style.height = '100%';
  };

  const handleCancelButtonClick = () => {
    setIsCameraOpen(false);
    formRef.current.style.height = 'auto';
  };

  return (
    <div>
      <NavigationBar />
      <span className="banner2">
        By signing up, you'll receive notifications whenever new updates are available.
      </span>
      <form onSubmit={handleSubmit} className="auth" ref={formRef}>
        <div className="auth-content2">
          <div>
            <h1>Sign up for a free account</h1>
            <h2>
              Already have an account? <Link to="/Login">Login</Link>{' '}
            </h2>
            <div>
              <input
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
            <div>
              <input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </div>
            <div>
              <input
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="tel"
              />
            </div>
            <div className="dropdown-container">
              <select id="role" className="dropdown-select" value={role} onChange={handleRoleChange}>
                <option value="">Choose a role</option>
                <option value="sender">Sender</option>
                <option value="traveler">Traveler</option>
              </select>
              {roleError && <div className="error">{roleError}</div>}
              <div className="dropdown-arrow"></div>
            </div>
            <div>
              <label htmlFor="photo">Upload photo:</label>
              <input
                type="file"
                id="photo"
                accept=".jpg, .jpeg, .png"
                onChange={handlePhotoUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <button className="btn2" type="button" onClick={() => fileInputRef.current.click()}>
                Choose Photo
              </button>
              {photoUrl && <img className="uploaded-photo" src={photoUrl} alt="Uploaded" />}
              {photoError && <div className="error">{photoError}</div>}
            </div>
            <div>
              <label htmlFor="idPhoto">Upload ID photo:</label>
              <input
                type="file"
                id="idPhoto"
                accept=".jpg, .jpeg, .png"
                onChange={handleIdPhoto}
                style={{ display: 'none' }}
              />
              <button className="btn2" type="button" onClick={() => fileInputRef.current.click()}>
                Choose ID Photo
              </button>
              {idPhotoUrl && <img className="uploaded-photo" src={idPhotoUrl} alt="Uploaded" />}
              {idPhotoCameraUrl && (
                <img className="uploaded-photo" src={idPhotoCameraUrl} alt="Uploaded from camera" />
              )}
              {idPhotoError && <div className="error">{idPhotoError}</div>}
            </div>
            <div className="camera-options">
              <button
                className="camera-button"
                type="button"
                onClick={handleCameraButtonClick}
                disabled={isCameraOpen}
              >
                Open Camera
              </button>
              {isCameraOpen && (
  <div className="camera-controls">
    <video ref={videoRef} autoPlay={true} className="camera-video" />
    <div className="camera-grid"></div>
    <div className="camera-buttons">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <button className="capture-button" type="button" onClick={capturePhoto}>
        Capture
      </button>
      <button className="toggle-button" type="button" onClick={toggleCamera}>
        Toggle Camera
      </button>
      <button className="cancel-button" type="button" onClick={handleCancelButtonClick}>
        Cancel
      </button>
    </div>
  </div>
)}

            </div>
            <button className="btn" type="submit">
              Sign Up
            </button>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
