const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book')

router.get('/', async (req, res) => {
    let query = Book.find();
    if(req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publish_date', req.query.publishedBefore);
    }  
    if(req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publish_date', req.query.publishedAfter);
    }   

    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query,
        });
    } catch {
        res.render('books');
    }
})

router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
});

router.post('/', async (req, res) => {
    const {title, author, publish_date, page_count, description} = req.body;
    const book = new Book({
        title: title,
        author: author,
        publish_date: new Date(publish_date),
        page_count: page_count,
        description: description
    });
    try {
        const savedBook = await book.save();
        res.redirect('books');
    } catch(err) {
        renderNewPage(res, book, true);
    }
});

const renderNewPage = async (res, book, hasError = false) => {
    try { 
        const authors = await Author.find({});
        const params = { 
            authors: authors,
            book: book
        };
        if(hasError) 
            params.errorMessage = 'Error creating book'; 

        res.render('books/new', params) 
    } catch {
        renderNewPage(res, book, true);
    }
}
module.exports = router; 