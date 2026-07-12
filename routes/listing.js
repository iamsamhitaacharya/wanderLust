const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");




//index route
router.get("/", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});



//------------CREATE(new & create route)---------
//new route
router.get("/new", isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
});



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
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req,res,next) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;   
    await newlisting.save();
        req.flash("success", "New Listing created!");
        res.redirect("/listings");
})
);



//------------READ-------------
//show route
router.get("/:id", wrapAsync(async(req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    //  console.log(listing);
    res.render("listings/show.ejs", {listing});
   
})
);



//---------------UPDATE(edit & update)--------
 //-------------edit----------
 router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(async (req,res,next) => {
     let {id} = req.params;
     const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
      res.render("listings/edit.ejs", {listing});
 })
);



 //---------update-----------
 router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req,res,next) => {
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
 })
);



 //------------Delete route-------
 router.delete("/:id", isLoggedIn,isOwner, wrapAsync(async(req,res,next) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
 })
);

module.exports = router;

