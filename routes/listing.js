const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

router
    .route("/")
        .get(wrapAsync(listingController.index))
        .post(isLoggedIn,validateListing,wrapAsync(listingController.addNewListing));

router.get("/new", isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
        .get(wrapAsync(listingController.showListing))
        .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.renderUpdateForm))
        .delete( isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));
            


 router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.editListing));

module.exports = router;

