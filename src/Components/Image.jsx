import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import './Image.css'

function ExpandableImage({ src, alt, children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const imageAnimation = useSpring({
    transform: isExpanded ? 'scale(1)' : 'scale(0.9)',
    opacity: isExpanded ? 1 : 0.8,
    config: {
      duration: 50
    }
  });
  
  const captionAnimation = useSpring({
    transform: isExpanded ? 'translateY(0)' : 'translateY(20px)',
    opacity: isExpanded ? 1 : 0,
  });

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleShare = () => {
    navigator.share({
      title: 'Check out this aesthetic',
      text: 'I found this cool aesthetic and thought you might like it!',
      url:  'vilecorp.com',
    });
  };

  return (
    <div className="expandable-image">
      <animated.img
        className="expandable-image__image animated-element"
        src={src}
        alt={alt}
        style={imageAnimation}
        onClick={handleClick}
      />
      <animated.p className="expandable-image__caption" style={captionAnimation}>
        {children}
      </animated.p>
      {isExpanded && navigator.share && (
        <button className="expandable-image__share-button" onClick={handleShare}>
          Share
        </button>
      )}
    </div>
  );
}

export default ExpandableImage;
