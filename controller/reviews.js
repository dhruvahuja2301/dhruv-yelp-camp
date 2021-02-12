const Campground = require('../models/campgrounds');
const Review = require('../models/reviews');

module.exports.createReview = async(req, res)=>{
    const id = req.params.id;
    const campground = await Campground.findById(id);    
    const newReview = new Review({body:req.body.body, rating:req.body.rating});
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Review Successfully Added');
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.deleteReview = async(req, res)=>{
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});    
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Successfully Deleted');
    res.redirect(`/campgrounds/${id}`);
}