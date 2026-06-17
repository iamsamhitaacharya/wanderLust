const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);



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

//create route
app.post("/listings",async (req,res) => {
    // we can do this way or the second one 
    // let {title,description,image,price,country,location}=req.body;
    const newlisting = new Listing(req.body.listing);
   await newlisting.save();
    res.redirect("/listings");
});


//------------READ-------------
//show route
app.get("/listings/:id", async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//---------------UPDATE(edit & update)--------
 //-------------edit----------
 app.get("/listing/:id/edit", async (req,res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id);
      res.render("listings/edit.ejs", {listing});
 });

 //---------update-----------
 app.put("/listings/:id", async (req,res) => {
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
 });

 //------------Delete route-------
 app.delete("/listings/:id", async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
 });




app.listen(8080, () => {
    console.log("server is listening on port 8080 ");
});
