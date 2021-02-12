const express = require('express');
const router =  express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require("../controller/campgrounds");
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('images'), validateCampground, catchAsync(campgrounds.createCampground))

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id([0-9a-f]{24})")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router