const express = require("express"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      request = require("request"),
      app = express()

// App config
mongoose.connect("mongodb://localhost:27017/blog", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Mongoose config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test",
//     image: "https://images.unsplash.com/photo-1484100356142-db6ab6244067?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "Sparkle sparkle..."
// });

// Routes

app.get("/", function(req, res){
    res.redirect("/blogs")
});

// INDEX route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            // TODO - better error handling
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW route
app.get("/blogs/new", function(req, res){
    res.render("new")
});

// CREATE route
app.post("/blogs", function(req, res){
    // create blog post
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs")
        }
    })
});

// SHOW route
app.get("/blogs/:id", function(req, res){
    // ? Why is whitespace being inserted in req.params.id ?
    Blog.findById(req.params.id.trim(), function(err, foundBlog){
        if(err){
            // TODO better error handling
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog})
        }
    });
});

app.listen(3000, function(){
    console.log("Serving Blog at port 3000...");
});

