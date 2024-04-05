import React, { useState, useEffect } from 'react';

function ScrollButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false); // New state to track bottom position

  // Function to scroll to the top or bottom smoothly
  const scrollTo = (direction) => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    window.scrollTo({
      top: direction === 'top' ? 0 : scrollHeight,
      behavior: 'smooth'
    });
  };

  // Function to handle button click
  const handleClick = () => {
    scrollTo(isAtBottom ? 'top' : 'bottom');
    //setIsAtBottom(!isAtBottom); // Toggle functionality on click
  };
  // Function to handle toponly click
  const handleTopOnly = () => {
    scrollTo('top');
  };
  // Function to detect scroll position and show/hide button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const threshold = window.innerHeight; // Check if near bottom

      setIsVisible(scrollTop > 100); // Show button after initial scroll

      // Update isAtBottom based on scroll position relative to content height
      setIsAtBottom(scrollTop + threshold >= document.documentElement.scrollHeight);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array to run effect only once

  return (
    <>
    <button
    type='button'
      className={`btn btn-info floater scroll-button ${isVisible ? '' : 'hidden'}`}
      onClick={handleClick}
    >
      {isAtBottom ? 'Top ↑' : 'Bottom ↓'}
    </button>
    <button
    type='button'
    className={`${isAtBottom ? 'hidden' : ''} btn btn-info floater top scroll-to-top ${isVisible ? '' : 'hidden'}`}
    onClick={handleTopOnly}
     // Click scrolls to top
  >
    Top ↑
  </button>
  </>
  );
}

export default ScrollButton;
