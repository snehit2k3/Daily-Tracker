import React from 'react';

function ConsistencyGrid({ data = [] }) {
  // Convert array to a map for quick lookup by date
  const ratingMap = {};
  data.forEach(({ date, rating }) => {
    ratingMap[date] = rating;
  });

  // Generate last 30 days dates in yyyy-mm-dd format
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  // Color scale by rating
  const getColor = (rating) => {
    if (rating === null || rating === undefined) return '#fff'; // white for no login
    if (rating <= 2) return '#d6e685';
    if (rating <= 4) return '#8cc665';
    if (rating <= 6) return '#44a340';
    if (rating <= 8) return '#1e6823';
    return '#00441b';
  };

  // Format date nicely for tooltip (e.g. May 18)
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: 320 }}>
      {days.map((date) => {
        const rating = ratingMap[date];
        return (
          <div
            key={date}
            title={`${formatDate(date)}: rating ${rating !== null && rating !== undefined ? rating : 'No login'}`}
            style={{
              width: 24,
              height: 24,
              margin: 3,
              backgroundColor: getColor(rating),
              borderRadius: 4,
              cursor: 'default',
              border: '1px solid #ddd',
            }}
          />
        );
      })}
    </div>
  );
}

export default ConsistencyGrid;
