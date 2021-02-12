const Campground = require('../models/campgrounds');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res)=>{
    const campgrounds = await Campground.find({});    
    res.render("campgrounds/index",{campgrounds});
}

module.exports.renderNewForm = (req, res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send()
    const camp = {
        title:req.body.title, 
        location:req.body.location, 
        author: req.user._id, 
        price:req.body.price, 
        description:req.body.description
    };
    const newCampground = new Campground(camp);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map((f)=>({url: f.path, filename:f.filename}));
    await newCampground.save();    
    req.flash('success', 'Campground Successfully Created');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');   
    // console.log(campground);
    if(!campground){
        req.flash('error', 'Campground not Found');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show",{campground});
}

module.exports.renderEditForm = async (req, res)=>{
    const campground = await Campground.findById(req.params.id);   
    if(!campground){
        req.flash('error', 'Campground not Found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async(req, res)=>{
    const id = req.params.id;
    const camp = {
        title:req.body.title, 
        location:req.body.location, 
        image:req.body.image, 
        price:req.body.price, 
        description:req.body.description
    };
    const newCampground = await Campground.findByIdAndUpdate(id, camp);
    const images = req.files.map((f)=>({url: f.path, filename:f.filename}))
    newCampground.images.push(...images);
    await newCampground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await newCampground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages} } } });
    }
    req.flash('success', 'Campground Successfully Updated');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async(req, res)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Successfully Deleted');
    res.redirect("/campgrounds");
}