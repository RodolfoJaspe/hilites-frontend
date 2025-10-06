import React, { useEffect, useRef } from 'react';
import '../styles/DateNavigation.css';

const DateNavigation = ({ selectedDate, onDateChange }) => {
  const scrollContainerRef = useRef(null);

  // Generate date options for the past 30 days
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    // Generate dates for the past 30 days
    for (let i = 8; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Format date as "Sep 27", "Sep 26", etc.
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      let label;
      if (i === 0) {
        label = 'Today';
      } else if (i === 1) {
        label = 'Yesterday';
      } else {
        // Show actual date for all other days
        label = formattedDate;
      }
      
      dates.push({
        value: i === 0 ? 'today' : `day-${i}`,
        label: label,
        date: date,
        formattedDate: formattedDate,
        dayIndex: i
      });
    }
    
    return dates;
  };

  const dateOptions = getDateOptions();

  // Scroll to selected date when it changes
  useEffect(() => {
    if (scrollContainerRef.current && selectedDate) {
      const selectedIndex = dateOptions.findIndex(option => option.value === selectedDate);
      if (selectedIndex !== -1) {
        const selectedElement = scrollContainerRef.current.children[selectedIndex];
        if (selectedElement) {
          // Scroll horizontally within the date navigation container only
          const container = scrollContainerRef.current;
          
          // Calculate the scroll position to center the element horizontally
          const scrollLeft = selectedElement.offsetLeft - (container.offsetWidth / 2) + (selectedElement.offsetWidth / 2);
          
          container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [selectedDate, dateOptions]);

  // Scroll navigation functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="date-navigation-container">
      {/* Left scroll button */}
      <button 
        className="scroll-button scroll-left" 
        onClick={scrollLeft}
        aria-label="Scroll left"
      >
        ‹
      </button>
      
      {/* Date navigation with scroll */}
      <div className="date-navigation" ref={scrollContainerRef}>
        {dateOptions.map((option) => (
          <button
            key={option.value}
            className={`date-option ${selectedDate === option.value ? 'active' : ''}`}
            onClick={() => onDateChange(option.value)}
            title={option.formattedDate}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      {/* Right scroll button */}
      <button 
        className="scroll-button scroll-right" 
        onClick={scrollRight}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
};

export default DateNavigation;
