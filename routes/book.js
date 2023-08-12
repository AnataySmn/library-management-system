// Import express and create a router
const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const passport = require('passport');

function IsLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


// Add GET for index
router.get('/', async (req, res, next) => {
    try {
        const books = await Book.find().exec();
        res.render('books/index', { title: 'Library management system', dataset: books, user: req.user });
    } catch (err) {
        console.log(err);
        // Handle the error and send an appropriate response
        res.status(500).send('An error occurred');
    }
});

router.get('/add',  (req, res, next) => {
    res.render('books/add', { title: 'Add a New Book' });
});


// Add POST handler
router.post('/add', IsLoggedIn, (req, res, next) => {
    Book.create({
        name: req.body.name,
        author_name: req.body.author_name,
        genres: req.body.genres,
        price: req.body.price
    }, (err, newBook) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/books');
        }
    });
});


// GET handler for Delete operations
router.get('/delete/:_id', IsLoggedIn, (req, res, next) => {
    Book.remove({ _id: req.params._id }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/books')
        }
    })
});

// GET handler for Edit operations
router.get('/edit/:_id', IsLoggedIn, (req, res, next) => {
    Book.findById(req.params._id, (err, book) => {
        if (err) {
            console.log(err);
        }
        else {
            Book.find((err, books) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render('books/edit', {
                        title: 'Edit a Book',
                        book: book
                    });
                }
            }).sort({ name: 1 });
        }
    });
});

// POST handler for Edit operations
router.post('/edit/:_id', IsLoggedIn, (req,res,next) => {
    // find project based on ID
    // try updating with form values
    // redirect to /Projects
    Book.findOneAndUpdate({_id: req.params._id}, {
        name: req.body.name,
        author_name: req.body.author_name,
        genres: req.body.genres,
        price: req.body.price
    }, (err, updatedBook) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/books');
        }
    });
});



// Export this router module
module.exports = router;