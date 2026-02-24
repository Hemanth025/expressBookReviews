const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});


// ✅ Get all books (Async + Safe)
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await Promise.resolve(books);
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});


// ✅ Get book by ISBN (Using Axios properly)
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get('http://localhost:5000/');
    const book = response.data[isbn];

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book" });
  }
});


// ✅ Get books by author (Using Axios properly)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;

    const response = await axios.get('http://localhost:5000/');
    const filtered = Object.values(response.data)
      .filter(book => book.author === author);

    if (filtered.length > 0) {
      return res.status(200).json(filtered);
    } else {
      return res.status(404).json({ message: "Author not found" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});


// ✅ Get books by title (Using Axios properly)
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    const response = await axios.get('http://localhost:5000/');
    const filtered = Object.values(response.data)
      .filter(book => book.title === title);

    if (filtered.length > 0) {
      return res.status(200).json(filtered);
    } else {
      return res.status(404).json({ message: "Title not found" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});


// Get book review (No change needed)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;