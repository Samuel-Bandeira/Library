const express = require('express');
const router = express.Router();
const Author = require('../models/author');

router.get('/', async (req, res) => {
    let searchOptions = {};

    if(req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }

    try {
        const authors = await Author.find(searchOptions);
        res.render('authors/index', {
            authors: authors, 
            searchOptions: req.query
        });
    } catch(err){
        res.redirect('/');
    }
});

router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() });
});

router.get('/:id', async (req, res) => {
    const author = await Author.findById(req.params.id);
    res.render('authors/show', {author: author});  
});

router.get('/:id/edit', (req, res) => {
    res.send()
})

router.put('/:id', async (req, res) => { 
    
})

router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name, 
    })
    try {
        const newAuthor = await author.save();
        res.redirect('authors');
        //res.redirect(`authors/${newAuthor.id}`);
    } catch(err) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author',
        });
    }
});
module.exports = router;