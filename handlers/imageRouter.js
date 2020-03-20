// retrieve all images
const handleAllImages = (app, Image)=>{
    app.route('/api/images')
        .get(function(req, resp){
            Image.find({}, function(err,data){
                if (err){
                    resp.json({message: 'could not retrieve images'});
                }else{
                    resp.json(data);
                }
            });
        });
};
const handleSingleImage = (app, Image) =>{
    app.route('/api/images/:id')
        .get(function(req,resp){
            Image.find({id: req.params.id}, function(err,data){
                if(err){
                    resp.json({message: 'could not get image id'});
                }else{
                    resp.json(data);
                }
            });
        });
};
const handleImageByCity = (app, Image)=>{
    app.route('/api/images/city/:city')
    .get(function(req,resp){
        Image.find({'location.city': new RegExp(req.params.city,'i')}, function(err,data){
            if(err){
                resp.json({message: 'could not get image by city'});
            }else{
                resp.json(data);
            }
        });
    });
};
const handleImageByCountry =(app, Image) =>{
    app.route('/api/images/country/:country')
        .get(function(req,resp){
            Image.find({'location.country': new RegExp(req.params.country, 'i')}, function(err,data){
                if(err){
                    resp.json({message: "could not get image by country"});
                }else{
                    resp.json(data);
                }
            });
        });
}
const handlePageIndex = (app,Image) => {
    app.route('/')
        .get(function(req,resp){
            resp.render('index',{title: 'Node 2 Lab',heading: 'Sample Pug File'})
        });
}
const handlePageCountries = (app, Image) => {
        app.route('/travel')
            .get(function (req,resp) {
                Image.aggregate([{$group:{_id:"$location.country",id:{$first:"$id"},count:{$sum:1}}}],
                function(err, data){
                    if(err){
                        resp.render('error', { page: 'travel'});
                    }else{
                        resp.render('list', { ImageData: data });
                    }
                });
            });
};
const handlePageImages = (app, Image) => {
        app.route('/travel/photos/:country')
            .get(function (req,resp) {
                Image.find().where('location.country').eq(req.params.country).exec(function(err, data){
                    if(err){
                        resp.render('error', { page: 'travel/photos/'});
                    } 
                    else{
                        resp.render('Images', { ImageData: data });
                    }
                });
            });
};
const handlePageSingleImage = (app, Image) => {
        app.route('/travel/photo/:id')
            .get(function (req,resp) {
                Image.find({id: req.params.id}, function(err, data){
                    if(err){
                        resp.render('error', { page: 'travel/photo'});
                    }else{
                        resp.render('image', { ImageData: data[0] });
                    }
                });
            });
};

module.exports ={
    handleAllImages,
    handleSingleImage,
    handleImageByCity,
    handleImageByCountry,
    handlePageIndex,
    handlePageCountries,
    handlePageImages,
    handlePageSingleImage
}