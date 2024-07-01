const express = require('express');
let books = require("./booksdb.js");
const jwt = require('jsonwebtoken');
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const BASE_URL = "https://tominasfatj-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/";

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


// Route to fetch all books


public_users.get('/',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

  });

  
  // Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
//Write your code here
    let bookISBN = req.params.isbn
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(books[bookISBN]))
    })});



// Get book details based on author
public_users.get('/author/:author', function (req, res) {
const author = req.params.author.toLowerCase();
const matchingBooks = [];
const get_books = new Promise((resolve, reject) => {
for (const key in books) {
    if (books[key].author.toLowerCase() === author) {
    matchingBooks.push(books[key]);
    }
}
})

if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 2));
} else {
    res.status(404).json({ message: "No books found for the given author" });
}
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
const title = req.params.title.toLowerCase();
const matchingBooks = [];
const get_books = new Promise((resolve, reject) => {
for (const key in books) {
    if (books[key].title.toLowerCase() === title) {
    matchingBooks.push(books[key]);
    }
}})

if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 2));
} else {
    res.status(404).json({ message: "No books found with the given title" });
}
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(JSON.stringify(book.reviews, null, 2));
  } else {
    res.status(404).json({ message: "No book found with the given ISBN" });
  }
});




module.exports.general = public_users;
