const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');
const Campground = require('../models/campgrounds');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connected");
});

const randArr = (arr) => arr[Math.floor(Math.random() * (arr.length))];

const dbseed = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i<250; i++ ){
        const rand = Math.floor(Math.random()*187);
        const price = Math.floor(Math.random() * 20) + 10;
        const campground = new Campground({
            author: "6026c59ddde46d1e5416aef4",
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${randArr(descriptors)} ${randArr(places)}`,
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam quasi delectus iure quos architecto rem aut, officiis dolor, repudiandae facilis velit, quaerat veritatis laboriosam atque laudantium id itaque accusamus molestiae?",         
            price,
            geometry: {
                type : "Point",
                coordinates : [ cities[rand].lng, cities[rand].lat ] 
            },
            images:[
                { 
                    "url" : "https://res.cloudinary.com/dr7icwkbu/image/upload/v1612889770/YelpCamp/Wallpaper_hepmvt.jpg",
                    "filename" : "YelpCamp/Wallpaper_hepmvt" 
                },  
                { 
                    "url" : "https://res.cloudinary.com/dr7icwkbu/image/upload/v1612888556/YelpCamp/Nature_flye7s.jpg",
                    "filename" : "YelpCamp/Nature_flye7s" 
                }
            ]
        })
        await campground.save();
    }
}

dbseed().then(() => db.close());