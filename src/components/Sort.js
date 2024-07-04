import React from 'react';

const Sort = ({ onSortChange }) => {
  return (
    <div className="sort-options">
      <select onChange={(e) => onSortChange(e.target.value)}>
        <option value="author">Sort by Author Name</option>
        <option value="title">Sort by Title</option>
        <option value="genre">Sort by Genre</option>
      </select>
    </div>
  );
};

export default Sort;
