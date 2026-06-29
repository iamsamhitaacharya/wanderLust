const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");  


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


main().then(()=> {
    console.log("connected to Db");
})
.catch((err) => {
    console.log(err)
});
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}



app.get("/", (req, res) => {
    res.send("this is your root");
});



const validateListing = (req, res, next ) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};



//index route
app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});



//------------CREATE(new & create route)---------
//new route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});



//error handling using try and catch
// //create route
// app.post("/listings",async (req,res,next) => {
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
app.post("/listings",validateListing, wrapAsync(async (req,res,next) => {
    let result =listingSchema.validate(req.body);
    console.log(result);    
    if(result.error){
        throw new ExpressError(400, result.error);
    }
    const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");
})
);



//------------READ-------------
//show route
app.get("/listings/:id", wrapAsync(async(req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})
);



//---------------UPDATE(edit & update)--------
 //-------------edit----------
 app.get("/listing/:id/edit", wrapAsync(async (req,res,next) => {
     let {id} = req.params;
     const listing = await Listing.findById(id);
      res.render("listings/edit.ejs", {listing});
 })
);



 //---------update-----------
 app.put("/listings/:id", validateListing, wrapAsync(async (req,res,next) => {
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
 })
);



 //------------Delete route-------
 app.delete("/listings/:id", wrapAsync(async(req,res,next) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
 })
);



//------------------Reviews-------------
//-------------Post Route----------------
app.post("/listings/:id/reviews", async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    res.redirect(`/listings/${lisintgs._id}`);
});



//--------handling error for random path in the same domain----------
app.all("*splat", (req, res, next)=> {
    next(new ExpressError(404,"Page Not Found!"));
});



 //--- Error handling middleware--------
 app.use((err,req,res,next) => {
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("./error.ejs", {err});
 });



app.listen(8080, () => {
    console.log("server is listening on port 8080 ");
});
