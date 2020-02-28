0.  Started RESTful blog app 

1.  Added index.ejs and app.js

2.  
    a. Added partials
    b. Included Semantic UI
        1.  Added navbar
        2.  Added icon
    c. Added app.css in public directory

3.  NEW and CREATE routes implemented and basic styling

4.  Changes
    a. SHOW route implemented with basic styling
    b. Enable new posts to be created with evalauated html
    c. Limited body content on index page to 100 characters
    d. Applied `.toDateString()` to `blog.created`

5.  Changes
    a. Added EDIT route and form
    b. Added UPDATE route and form
    c. Added method-override
        1. `npm install method-override --save`
        2.  In `app.js`:
            a.  `var methodOverride = require("method-override")`
            b.  `app.use(methodOverride("_method"))`
            c.  write the route as `app.method_I_want_to_use("/foo", func...)`
        3.  Whenever you need to override a request method for _reasons_'
            a.  add `?_method=METHOD_I_WANT_TO_USE` to the url of the request to force said request to be a METHOD request

       This basically just allows us to use PUT or DELETE requests when for some reason we would otherwise be railroaded into using
       GET or POST, thus allowing us to remain RESTful.   Seems rather unnecessary to me, when one could achieve the same effect with
       less work ignoring or modifying REST.
      