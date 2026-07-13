const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

//index route
router.get("/", wrapAsync(listingController.index));

//------------CREATE(new & create route)---------
//new route
router.get("/new", isLoggedIn,listingController.renderNewForm);

//error handling using try and catch
// //create route
//router.post("/listings",async (req,res,next) => {
//     // we can do this way or the second one 
//     // let {title,description,image,price,country,location}=req.body;
    
//     try{
//         const newlisting = new Listing(req.body.listing);
//         await newlisting.save();
//         res.redirect("/listings");
//     }catch(err){
//         next(err);
//     }
// });

//error handling using wrapAsync function
//create route
router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.addNewListing));

//------------READ-------------
//show route
router.get("/:id", wrapAsync(listingController.showListing));

//---------------UPDATE(edit & update)--------
 //-------------edit----------
 router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.editListing));

 //---------update-----------
 router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.renderUpdateForm));

 //------------Delete route-------
 router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;

