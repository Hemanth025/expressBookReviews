const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
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


// Get all books using async/await
public_users.get('/', async function (req, res) {
  try {
    return res.status(200).json(await Promise.resolve(books));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});


// Get book by ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await Promise.resolve(books[isbn]);

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book" });
  }
});


// Get books by author using async/await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;

    const filteredBooks = await Promise.resolve(
      Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
      )
    );

    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});


// Get books by title using async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    const filteredBooks = await Promise.resolve(
      Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
      )
    );

    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;