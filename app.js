const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js"); 

const listings = require("./routes/listing.js");


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






//---------review validating function----------
const validateReview = (req, res, next ) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};


app.use("/listings", listings);

//------------------Reviews-------------
//-------------Post Route----------------
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
})
);



//------------Delete Route-----------
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=> {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})
);



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
