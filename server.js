if(process.env.NODE_ENV !== 'production') 
    require('dotenv').config();

const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const authorsRoutes = require('./routes/authors');
const booksRoutes = require('./routes/books');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views' );
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: false, limit:'10mb' }))

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('connected to mongoose sucessfully!'));

app.use('/', indexRouter);
app.use('/authors', authorsRoutes);
app.use('/books', booksRoutes);

app.listen(process.env.PORT || 3000);