---
title: 'Converting GitHub Style Footnotes to HTML with Eleventy'
date: '2022-04-07'
tags: ['Eleventy', 'JavaScript', 'Nunjucks', 'Markdown']
---

When making my first blog site with NextJS I used [Remark](https://github.com/gnab/remark) to parse the Markdown into HTML. And this was nice, and worked fairly well, but I ran into issues with footnotes, which Remark doesn't handle by default. There is a plug-in that supports GitHub flavoured Markdown footnotes, but I had trouble getting it to work. For fun, I decided to implement it myself, and it worked fine for my purposes.

Now with this new Eleventy blog, I adapted my solution into a filter. I'll explain how I made it work in this post, and note a few difficulties I encountered that are specific to Eleventy.

## Creating a Filter

The first step is to create a "filter" to run the content of each blog post. You can create filters in `.eleventy.js`, like this:

```JavaScript
module.exports = function (eleventyConfig) {
  // ...

  eleventyConfig.addFilter('parseFootnotes', function(htmlString) {
    
  });
}
```

This creates a filter called `parseFootnotes` that you can run on your post content, which will have already been converted into a string of HTML. You can then use in one of your templates like this:

```HTML
<article>
  {{ content | parseFootnotes | safe }}
</article>
```



## Limitations

I need a way to escape footnotes, so I write about Markdown footnotes without turning them into HTML footnotes! -->
