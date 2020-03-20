/* This is a handler for our books api link */
const handleAllBooks=(app,Book)=>{
    app.route('/api/books')
        .get(function(req,resp){
        //use mongoose to retrive 
        Book.find({}, function(err,data){
            if (err){
                resp.json({message: 'unable to connect to books'});
            }else{
                resp.json(data);
            } 
        });
    });
};
// handle requests for single book using isbn10:
// e.g. /api/books/0321886518
const handleSingleBook= (app,Book)=>{
    app.route('/api/books/:isbn')
        .get(function(req,resp){
            Book.find({isbn10: req.params.isbn},function(err,data){
                if(err){
                    resp.json({message: "book not found"})
                }else{
                    resp.json(data);
                }
            });
        });
}
// handle requests for books with specific page ranges:
// e.g., [domain]/api/books/pages/500/600
const handleBooksByPageRange=(app, Book)=>{
    app.route('/api/books/pages/:min/:max')
        .get(function(req,resp){
            Book.find().where('production.pages')
                .gt(req.params.min)
                .lt(req.params.max)
                .sort({title: 1})
                .select('title isbn10')
                .exec(function(err,data){
                    if(err){
                        resp.json({message: "books not found"})
                    }
                    else{
                        resp.json(data);
                    }
                });
        });
};
const handleAllCategories=(app, Book)=>{
    app.route('/api/categories')
        .get(function(req,resp){
            //use an aggregate function
            Book.aggregate([
                {$group: {_id: "$category.main", count: {$sum:1} } },
                {$sort: {_id:1} }
            ],function(err,data){
                if(err){
                    resp.json({message: "unable to retrieve books"});
                }else{
                    resp.json(data);
                }
            })
        })
};
const handlePageIndex = (app,book)=>{
    // for root requests, render the index.pug view
    app.route('/')
        .get(function (req,resp) {
            resp.render('index', { title: 'Node 2 Lab',
            heading: 'Sample Pug File' })
        });
    // set up route handlers
};
const handlePageBooks = (app, Book) => {
    app.route('/site/list')
        .get(function (req,resp) {
            Book.find({}, function(err, data) {
                if (err) {
                resp.render('error', { page: 'site/list'});
                } else {
                resp.render('list', { bookData: data });
                }
            });
        });
};
const handlePageSingleBook = (app, Book) => {
    app.route('/site/book/:isbn')
            .get(function (req,resp) {
                Book.find({isbn10: req.params.isbn}, (err, data) => {
                    if (err) {
                    resp.render('error', { page: 'site/book'});
                    } else {
                    resp.render('book', { bookData: data[0] });
                    }
                });
            });
};
const handleCreateBook = (app,Book) =>{
    app.route('/api/create/book')
        .post(function(req,resp){
            //retrieve form data from the http request
            const aBook={
                isbn10: req.body.isbn10,
                isbn13: req.body.isbn13,
                title: req.body.title,
                year: req.body.year,
                publisher: req.body.publisher,
                production: {
                pages: req.body.pages
                } 
            };
            //now have mongoose add the book data
            Book.create(aBook, function(err,data){
                //for now simply return a JSON message
                if(err){
                    resp.json({message: 'unable to connect to books'});
                }else{
                    const msg = `New Book was saved isbn=${aBook.isbn10}`;
                    resp.json({message: msg});
                }
            });
        });
};
module.exports ={
    handleAllBooks,
    handleSingleBook,
    handleBooksByPageRange,
    handleAllCategories,
    handlePageIndex,
    handlePageBooks,
    handlePageSingleBook,
    handleCreateBook
};