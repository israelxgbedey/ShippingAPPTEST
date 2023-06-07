import React, { useState, useEffect } from 'react';
import './ShipmentCalculator.css';
import axios from 'axios';

function ShipmentCalculator({ postLocation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [weight, setWeight] = useState(0);
  const [distance, setDistance] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [unit, setUnit] = useState('m');
  const [price, setPrice] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (userLocation && postLocation) {
      const calculatedDistance = calculateDistance(userLocation, postLocation);
      setDistance(calculatedDistance);
    }
  }, [userLocation, postLocation]);

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleLengthChange = (e) => {
    setLength(e.target.value);
  };

  const handleWidthChange = (e) => {
    setWidth(e.target.value);
  };

  const handleHeightChange = (e) => {
    setHeight(e.target.value);
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const apiKey = "YOUR_API_KEY";
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              address: `${postLocation.city}, ${postLocation.country}`,
              key: apiKey,
            },
          }
        );

        const { results } = response.data;
        if (results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          const postLocationWithCoordinates = { latitude: lat, longitude: lng };
          setDistance(calculateDistance(userLocation, postLocationWithCoordinates));
        }

        console.log('Post Location:', postLocation);
        console.log('Results:', results);
        console.log('User Location:', userLocation);
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    fetchCoordinates();
  }, [postLocation, userLocation]);

  const calculateDistance = (location1, location2) => {
    const earthRadius = 6371;
    const lat1Rad = toRadians(location1.latitude);
    const lon1Rad = toRadians(location1.longitude);
    const lat2Rad = toRadians(location2.latitude);
    const lon2Rad = toRadians(location2.longitude);
    const deltaLat = lat2Rad - lat1Rad;
    const deltaLon = lon2Rad - lon1Rad;
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
  };

  const handlePay = () => {
    // Handle the payment logic here
    console.log('Payment logic goes here');
  };


  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const calculateVolume = () => {
    let volume;
    if (unit === 'm') {
      volume = length * width * height;
    } else if (unit === 'cm') {
      volume = (length / 100) * (width / 100) * (height / 100);
    }
    return volume;
  };

  const calculatePrice = () => {
    const volume = calculateVolume();
    const weightFactor = 100;
    const volumeFactor = 80.10;
    const distanceFactor = 0.7;
    const discountFactor = 1;

    const weightContribution = weight * weightFactor;
    const volumeContribution = volume * volumeFactor;
    const distanceContribution = distance * distanceFactor;

    const shipmentPrice = (weightContribution + volumeContribution + distanceContribution) * discountFactor;

    setPrice(shipmentPrice.toFixed(2));
    setShowResult(true);
  };

  return (
    <div className="shipment-calculator-card">
      <h2>Shipment Calculator</h2>
      {!showResult ? (
        <div>
          <label className="Weight">
            Weight (kg):
            <input type="number" value={weight} onChange={handleWeightChange} />
          </label>
          <br />
          <label className="Length">
            Length ({unit}):
            <input type="number" value={length} onChange={handleLengthChange} />
          </label>
          <br />
          <label className="Width">
            Width ({unit}):
            <input type="number" value={width} onChange={handleWidthChange} />
          </label>
          <br />
          <label className="Height">
            Height ({unit}):
            <input type="number" value={height} onChange={handleHeightChange} />
          </label>
          <br />
          <label className="Unit">
            Unit:
            <select value={unit} onChange={handleUnitChange}>
              <option value="m">m</option>
              <option value="cm">cm</option>
            </select>
          </label>
          <br />
          <button onClick={calculatePrice}>Calculate Price</button>
        </div>
      ) : (
        <div className="result">
        <button className="PayButton" onClick={handlePay}>
          {price} CFA
        </button>
      </div>
      
      )}
    </div>
  );
}

export default ShipmentCalculator;
