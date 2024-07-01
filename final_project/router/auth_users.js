const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js"); // Assuming this contains your book data structure
const regd_users = express.Router();

let users = []; // Array to store registered users (simplified for example)

// Helper function to check if a username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Helper function to authenticate a user
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};
// Login route to authenticate user and set session
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});
// Example route to add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const { username } = req.session.authorization;

    if (!isbn || !review || !username) {
        return res.status(400).json({ message: "ISBN, review, and username are required" });
    }

    // Check if the book ISBN exists
    if (books[isbn]) {
        // Add or modify the review
        books[isbn].reviews[username] = review;

        return res.status(200).json({ message: "Review added or modified successfully", reviews: books[isbn].reviews });
    } else {
        return res.status(404).json({ message: "No book found with the given ISBN" });
    }
});

// Route to delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.session.authorization;

    if (!isbn || !username) {
        return res.status(400).json({ message: "ISBN and username are required" });
    }

    // Check if the book ISBN exists
    if (books[isbn]) {
        // Delete the review if it exists
        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
        } else {
            return res.status(404).json({ message: "No review found for the given username" });
        }
    } else {
        return res.status(404).json({ message: "No book found with the given ISBN" });
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
