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
const Image = require('./models/Image.js');
//use the route handles
const imageRouter = require('./handlers/imageRouter.js');


imageRouter.handleSingleImage(app,Image);
imageRouter.handleImageByCity(app,Image);
imageRouter.handleImageByCountry(app,Image);
imageRouter.handleAllImages(app,Image);
imageRouter.handlePageIndex(app,Image);
imageRouter.handlePageCountries(app,Image);
imageRouter.handlePageImages(app,Image);
imageRouter.handlePageSingleImage(app,Image);
// customize the 404 error with our own middleware function
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
   });
app.listen(port, function(){
    console.log("server running on port="+port);
});