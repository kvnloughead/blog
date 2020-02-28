const express = require("express"),
      methodOverride = require("method-override"),
      expressSanitizer = require("express-sanitizer"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      request = require("request"),
      app = express()

// App config
mongoose.connect("mongodb://localhost:27017/blog", {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()) // must follow app.use(bodyParser...)
app.use(express.static("public"));
app.use(methodOverride("_method")); 
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

// GET route for RESTfulTable
// TODO work out how to serve pages from a directory, so I can write posts in VScode, not just in browser
app.get("/blogs/RESTfulTable", function(req, res){
    res.render("RESTfulTable")
})

// NEW route
app.get("/blogs/new", function(req, res){
    res.render("new")
});

// CREATE route
app.post("/blogs", function(req, res){
    // create blog post
    req.body.blog.body = req.sanitize(req.body.blog.body);
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

// EDIT route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id.trim(), function(err, foundBlog){
        if(err){
            // TODO better error handling
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog})
        }
    });
});

// UPDATE route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
        if(err){
            // TODO better error handling
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            // TODO better error handling
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs")
        }
    })
});


app.listen(3000, function(){
    console.log("Serving Blog at port 3000...");
});

