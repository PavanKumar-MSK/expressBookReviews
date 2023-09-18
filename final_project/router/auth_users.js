const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length == 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 * 24 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    req.session.username = username;
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.status(400).json({ message: "Please login to add a review" });
  }
  const isbn = req.params.isbn;
  if (isbn && isbn in books) {
    books[isbn].reviews[username] = req.body.review;
    if (username in books[isbn].reviews) {
      return res
        .status(200)
        .json({ message: "Successfully modified the user review" });
    } else {
      return res
        .status(200)
        .json({ message: "Succesfully added the user review" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Please provide a valid isbn to add a review" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.status(400).json({ message: "Please login to remove a review" });
  }
  const isbn = req.params.isbn;
  if (isbn && isbn in books) {
    if (username in books[isbn].reviews) {
      delete books[isbn].reviews[username];
      return res
        .status(200)
        .json({ message: "Successfully removed the user review" });
    } else {
      return res
        .status(200)
        .json({ message: "There is no review by the user" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Please provide a valid isbn to remove a review" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
