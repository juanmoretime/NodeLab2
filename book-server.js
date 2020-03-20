const express = require('express');
const parser = require('body-parser');
require("./handlers/data-provider.js").connect();

const app = express();
let port =8080;
//serve and add path to static files
app.use(express.static('public'));
app.use('/static',express.static('public'));
/* --- middle ware section --- */
// view engine setup
app.set('views', './views');
app.set('view engine', 'pug');
//tell node to use http and json headers
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

//get our data model
const Book = require('./models/Book');
//use the route handles
const bookRouter = require('./handlers/bookRouter.js');

bookRouter.handleAllBooks(app,Book);
bookRouter.handleSingleBook(app,Book);
bookRouter.handleBooksByPageRange(app,Book);
bookRouter.handleAllCategories(app,Book);
bookRouter.handlePageIndex(app, Book);
bookRouter.handlePageBooks(app, Book);
bookRouter.handlePageSingleBook(app, Book);
bookRouter.handleCreateBook(app,Book);
// customize the 404 error with our own middleware function
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
   });
app.listen(port, function(){
    console.log("server running on port="+port);
});