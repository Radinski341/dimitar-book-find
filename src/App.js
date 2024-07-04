import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import Sort from './components/Sort';
import NoResults from './components/NoResults';
import booksJson from './books.json';
import booksCsv from './books.csv';
import './App.css';

const parseCSV = (str) => {
  const rows = str.trim().split('\n');
  const headers = rows[0].split(',');
  return rows.slice(1).map(row => {
    const values = row.split(',');
    return headers.reduce((object, header, index) => {
      object[header.trim()] = values[index].trim();
      return object;
    }, {});
  });
};

const mergeData = async () => {
  const csvData = await fetch(booksCsv).then(res => res.text());
  const parsedCsv = parseCSV(csvData);
  
  const mergedData = booksJson.map(book => ({
    ...book,
    ...parsedCsv.find(item => item.id === String(book.id))
  }));

  return mergedData;
};

const highlightMatches = (text, query) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() 
      ? <span key={index} className="book-list__item--highlighted">{part}</span> 
      : part
  );
};

const App = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState('author');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const mergedBooks = await mergeData();
      setBooks(mergedBooks);
      setFilteredBooks(mergedBooks);
    };
    fetchData();
  }, []);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleSortChange = (sortOption) => {
    setSortOption(sortOption);
    const sorted = [...filteredBooks].sort((a, b) =>
      a[sortOption].localeCompare(b[sortOption])
    );
    setFilteredBooks(sorted);
  };

  return (
    <div className="app">
      <Search onSearch={handleSearch} />
      <Sort onSortChange={handleSortChange} />
      <div className="book-list">
        {filteredBooks.length ? (
          filteredBooks.map(book => (
            <div key={book.id} className="book-list__item">
              <p>Title: {highlightMatches(book.title, query)}</p>
              <p>Author: {highlightMatches(book.author, query)}</p>
              <p>Genre: {highlightMatches(book.genre, query)}</p>
            </div>
          ))
        ) : (
          <NoResults />
        )}
      </div>
    </div>
  );
};

export default App;
