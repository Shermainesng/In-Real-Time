import React, { useState } from 'react';

const Poll = () => {
  const options = ['Option 1', 'Option 2', 'Option 3']; // Replace with your poll options
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  return (
    <div>
      <h2>Poll Question</h2>
      <ul>
        {options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleOptionClick(index)}
            className={selectedOption === index ? 'selected' : ''}
          >
            {option}
          </li>
        ))}
      </ul>
      {selectedOption !== null && (
        <p>You selected: {options[selectedOption]}</p>
      )}
    </div>
  );
};

export default Poll;
