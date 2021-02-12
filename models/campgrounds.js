const mongoose = require('mongoose');
const Review = require('./reviews')
const { cloudinary } = require("../cloudinary");
const Schema = mongoose.Schema

// https://res.cloudinary.com/dr7icwkbu/image/upload/w_200/v1612889770/YelpCamp/Wallpaper_hepmvt.jpg
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: {virtuals: true}};

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required:true
        },
        coordinates: {
            type: [Number],
            required:true
        }
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong> <a href="/campgrounds/${this._id}"> ${this.title} </a></strong> 
    <p>${this.description.substring(0,30)}...</p>`;
});

CampgroundSchema.post('findOneAndDelete',async(doc)=>{
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
        for(let image of doc.images){
            await cloudinary.uploader.destroy(image.filename);
        }
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);