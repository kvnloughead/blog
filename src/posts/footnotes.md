---
title: 'Converting GitHub Style Footnotes to HTML with Eleventy'
date: '2022-04-07'
tags: ['Eleventy', 'JavaScript', 'Nunjucks', 'Markdown']
---

When making my first blog site with NextJS I used [Remark](https://github.com/gnab/remark) to parse the Markdown into HTML. This was nice, and worked fairly well, but I ran into issues with footnotes, which Remark doesn't handle by default. There is a plug-in that supports GitHub flavored Markdown footnotes, but I had trouble getting it to work. For fun, I decided to implement it myself, and it worked fine for my purposes.

Now with this shiny new Eleventy blog, I adapted my solution into a filter. I'll explain how I made it work in this post, and note a few difficulties I encountered along the way.

## Creating a Filter in `.eleventy.js`

The first step was to create a filter to run the content of each blog post. These are basically just JavaScript functions that can be applied to variables in your markup templates. I'm using Nunjucks for my templates, and you can read about filters [in the docs](https://mozilla.github.io/nunjucks/templating.html).

In Eleventy, you can create filters in `.eleventy.js`, like this:

```js
module.exports = function (eleventyConfig) {
  // ...

  eleventyConfig.addFilter('parseFootnotes', function (htmlString) {
    // ...
  });
};
```

This creates a filter called `parseFootnotes`. The intention is to run this function on your post content, which will have already been converted into a string of HTML. You can then use in one of your templates like this[^1]:

```html
<article>{% raw %} {{ content | parseFootnotes | safe }} {% endraw %}</article>
```

In this markup, `content` is the content of the article, and [`safe`](https://mozilla.github.io/nunjucks/templating.html#safe) is a built-in Nunjucks filter.

Here's the first iteration of the filter:

```javascript
eleventyConfig.addFilter('parseFootnotes', function (htmlString) {
  const footnoteRegex = /\[\^([1-9])\]/g;
  const footnotes = new Set();
  const { fileSlug } = this.ctx.page;
  htmlString = htmlString.replace(footnoteRegex, (match, $1) => {
    if (!footnotes.has($1)) {
      footnotes.add($1);
      return `<a 
                  id="${fileSlug}-backlink-${$1}" 
                  href="#${fileSlug}-footnote-${$1}"
                >
                  (${$1})
                </a>
        `;
    }
    return `<a 
                id="${fileSlug}-footnote-${$1}" 
                href="#${fileSlug}-backlink-${$1}"
              >
                (${$1})
              </a>
      `;
  });
  return htmlString;
});
```

This is actually pretty close to what I had originally written for my earlier blog. The call to the `string.replace` method does most of the work. It runs through the string, looking for footnotes of the form `[^d]` for some integer `d` between `1` and `9`. For each one, if there isn't already a corresponding footnote (meaning it's the "head" of the footnote) in the set of footnotes, it adds the footnote to the set, and replaces it with the first block of markup. If not, then it's the "foot" of the footnote, and it's replaced with the second block of markup.

Both blocks of markup are hyperlinks, set up to link to one another, with corresponding `id` and `href` attributes. It's necessary to differentiate the footnotes not only based on their number, but also on their slug, so they don't link to the wrong pages. The number is gathered by `replace`, and is represented by the `$1` argument. This is how `replace` works with regexes — you can specify capture groups as arguments by using the `$` syntax. The page slug required a bit of hunting.

## Accessing the page data

How to access the page url not obvious at all, and took some poking around. I found some GitHub issues complaining about this same thing, and in one it was suggested to use `this.context` to access the page data. This didn't work for me, but by logging `this` to the terminal I eventually found that `this.ctx.page` contains some useful page data, including the `fileSlug`. So there you are, that's how you do that I guess.

## A note on not using `<sub>` tags

Two problems arose with respect to the fixed navbar I have at the top of my page. The first problem occurred when I tried to use a `<sub>` tag to wrap the text inside the head of the footnotes, to make them appear as superscripts. These tags are styled with `position: relative` and an offset, which made them appear on top of my navbar. This was resolvable with `z-index`, but I figured I'd just remove the `<sub>` tag and use `vertical-align: super` on footnote instead. I added some classes to the markup strings so I could style them easily.

## Prevent fixed nav from obscuring footnote "heads" on return via backlink

When following a link to an element identified by `id`, this element will appear at the very top of the window. So if you have a fixed navbar at the top of the page, your footnote will be obscured by it.

I tried first to resolve this with a bit of box model magic, per a Stack Overflow thread:

```css
.footnote {
  padding-top: 60px;
  margin-top: -60px;
}
```

At first it seemed to work, but it creates a `60px` vertical column of invisible padding that prevents interactions underneath it. Often, the issue escaped unnoticed, but it became obvious when there were multiple footnotes at the bottom of a page, in which case all but the bottom-most were likely to be obscured by the footnotes beneath them.

Eventually I hit on a solution that seems to work well. First, I adjusted the HTML in the first template literal to look like this (shown as HTML, for the syntax highlighting):

```html
<span id="${fileSlug}-backlink-${$1}"> </span>
<a class="footnote" href="#${fileSlug}-footnote-${$1}"> (${$1}) </a>
```

So I moved the `id` to a new `<span>` tag that immediately proceeds the anchor, and I gave the anchor the `footnote` class. Now I could target these span tags with an adjacent sibling combinator to shift their position up enough to compensate for the navbar:

```css
.footnote + span {
  position: relative;
  top: -54px;
}
```

<hr />

[^1] It was non-trivial to figure out how to escape the Nunjucks inside the `<article>` tags. The trick was to wrap it in a `{{ "{% raw %}...{% endraw %}" | escape }}` block.[^2]

[^2] And to learn how to escape that `{{ "{% raw %}...{% endraw %}" | escape }}` block, see this [blog post](https://www.constantvallee.dev/posts/escape-nunjucks-in-markdown/).
