1. Followed [this tutorial](https://sia.codes/posts/itsiest-bitsiest-eleventy-tutorial/) for the initial setup.

2. Tried to use TOML as front matter, but it broke hot reloading for some reason

3. Tried to start styling, added font-family the body in a base stylesheet. Worked for the main page, but not for the post page. Why? It's using the same layout

4. Moved on to [this tutorial](https://11ty.rocks/posts/create-your-first-basic-11ty-website/)

a. Created layout specific to posts

b. Created posts.json file in posts/ directory to contain shared data

```json
{
  "layout": "post",
  "permalink": "/{{ page.fileSlug }}/",
  "tags": "post"
}
```

c. Set permalink structure in posts.json
`"permalink": "/{{ page.fileSlug }}/"`

- `fileSlug` is supplied by eleventy
- using this will omit intervening files, like /posts/...

d. Got css working

```js
// .eleventy.js
module.exports = function (eleventyConfig) {
  // Pass through src/css/* to output
  eleventyConfig.addPassthroughCopy('./src/css/');
  eleventyConfig.addWatchTarget('./src/css/');

  // Set custom directories for input, output, includes, and data
  return {...}
};
```

```html
<!-- In base.njk, make sure to use absolute filepath if you want it to 
effect the posts themselves -->
<link rel="stylesheet" href="/css/base.css" />
```
