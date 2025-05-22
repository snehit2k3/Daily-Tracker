import React, { useState, useEffect } from 'react';

function RatingInput({ rating: initialRating = 0, onChange }) {
  const [rating, setRating] = useState(initialRating ?? 0);

  useEffect(() => {
    setRating(initialRating ?? 0);
  }, [initialRating]);

  const handleChange = (e) => {
    const value = Number(e.target.value);
    setRating(value);
    if (onChange) onChange(value);
  };

  return (
    <div>
      <label htmlFor="rating">Rate your day (1 to 10): </label>
      <select id="rating" value={rating ?? 0} onChange={handleChange}>
        <option value={0}>Select rating</option>
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      {rating > 0 && <p>Your rating: {rating}</p>}
    </div>
  );
}

export default RatingInput;
