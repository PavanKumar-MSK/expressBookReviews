const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    //Write your code here
    if (req.body.username && req.body.password) {
        username = req.body.username;
        password = req.body.password;
        if (isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(400).json({message: "Username not available!! Please use other username"});
        }
    } else {
        return res.send("Please provide proper username and password");
    }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    const Books = await books;
    return res.send(Books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = await books[isbn];
  return res.send(book);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  function find_books_by_author() {
    const author = req.params.author;
    author_books = []
    for (const [key, value] of Object.entries(books)) {
        if (value.author === author) {
            author_books.push(value);
        }
    }
    return author_books;
  };
  let author_books = await find_books_by_author();
  return res.status(200).send(author_books);
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  function find_books_by_title() {
    const title = req.params.title;
    let title_books = [];
    for (const [key, value] of Object.entries(books)) {
        if (value.title === title) {
            title_books.push(value);
        }
    }
  };
  let title_books = await find_books_by_title();
  return res.status(200).send(title_books)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
