const Listing = require("../models/listing");
const { getCoordinates } = require("../public/js/geocode.js");


module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.addNewListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;  
    newlisting.image = { filename, url}; 
    await newlisting.save();
        req.flash("success", "New Listing created!");
        res.redirect("/listings");
};

module.exports.showListing = async(req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
         populate:{
            path:"author",
        },
    }).
    populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    const coordinates = await getCoordinates(listing.location, listing.country);
    //  console.log(listing);
    res.render("listings/show.ejs", {listing, coordinates});
   
};

module.exports.editListing = async (req,res,next) => {
     let {id} = req.params;
     const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage= originalImage.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImage});
 };

 module.exports.updateListing = async (req,res,next) => {
    let {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename};
    await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
 };

 module.exports.deleteListing = async(req,res,next) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
 };