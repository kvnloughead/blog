---
title: 'Converting GitHub Style Footnotes to HTML with Eleventy'
date: '2022-04-07'
tags: ['Eleventy', 'JavaScript', 'Nunjucks', 'Markdown']
---

When making my first blog site with NextJS I used [Remark](https://github.com/gnab/remark) to parse the Markdown into HTML. And this was nice, and worked fairly well, but I ran into issues with footnotes, which Remark doesn't handle by default. There is a plug-in that supports GitHub flavoured Markdown footnotes, but I had trouble getting it to work. For fun, I decided to implement it myself, and it worked fine for my purposes.

Now with this new Eleventy blog, I adapted my solution into a filter. I'll explain how I made it work in this post, and note a few difficulties I encountered that are specific to Eleventy.

## Creating a Filter in `.eleventy.js`

The first step is to create a "filter" to run the content of each blog post. You can create filters in `.eleventy.js`, like this:

```js
module.exports = function (eleventyConfig) {
  // ...

  eleventyConfig.addFilter('parseFootnotes', function(htmlString) {
    
  });
}
```

This creates a filter called `parseFootnotes` that you can run on your post content, which will have already been converted into a string of HTML. You can then use in one of your templates like this[^1]:

```html
<article>{% raw %}
  {{ content | parseFootnotes | safe }}
{% endraw %}</article>
```

And here's the filter:

```javascript
eleventyConfig.addFilter('parseFootnotes', function (htmlString) {
    const footnoteRegex = /\[\^([0-9])\]/g;
    const footnotes = new Set();
    const { fileSlug } = this.ctx.page;
    htmlString = htmlString.replace(footnoteRegex, (match, $1) => {
      if (!footnotes.has($1)) {
        footnotes.add($1);
        return `<a id="${fileSlug}-backlink-${$1}" href="#${fileSlug}-footnote-${$1}">
                  (${$1})
                </a>`;
      }
      return `<a id="${fileSlug}-footnote-${$1}" href="#${fileSlug}-backlink-${$1}">
                (${$1})
              </a>`;
    });
    return htmlString;
});
```

This is actually pretty close to what I original wrote for my earlier blog. The call to the `string.replace` method does most of the work. It runs through the string, looking for footnotes of the form `[^d]` for some integer `d`. For each one, if there isn't already a corresponding footnote (meaning it's the head of the footnote) in the set of footnotes, it adds the footnote to the set, and replaces it with the first block of markup. If not, then it's the foot of the footnote, and it replaces it with the second block of markup.

Both blocks of markup are hyperlinks, set up to link to one another, with corresponding `id` and `href` attributes. I need to differentiate footnotes not only based on their number, but also on their slug, so they don't link to the wrong pages. The number is gathered by `replace`, and is represented by the `$1` argument. This is how `replace` works with regexes — you can specify capture groups as arguments by using the `$` syntax. 

## Accessing the page data

After this, all I needed to do was access the page slug. How to do this was not obvious at all, and took some poking around. I found some GitHub issues complaining about the same thing, and in one it was suggested to use `this.context` to access this data. This didn't quite work for me, but by logging `this` to the terminal I eventually found that `this.ctx.page` contains some useful page data, including the `fileSlug`. So there you are, that's how you do that I guess.

## A note on not using `<sub>` tags

Two problems arose with respect to the fixed navbar I have at the top of my page. The first problem occurred when I tried to use a `<sub>` tag to wrap the text inside the head of the footnotes. These tags are styled with `position: relative` and an offset, which was making them appear above my navbar. It was resolvable with `z-index`, but I figured I'd just remove the `<sub>` tag and use `vertical-align: super` on footnote. I added some classes to my markup strings so I could style them easily.

## Conclusion and Limitations

With that, I had working footnotes — they just needed some styling. There are still some limitations which maybe someday I'll resolve.

1. Well, I guess it only allows 10 footnotes. That's plenty!
2. I'm sure it isn't very robust. I haven't broken it yet, but I will!
3. When clicking the backlink to return to the head, the link is at the top of the page, and hence obscured by my navbar. I tried to resolve it with pure CSS like this, per a Stack Overflow thread:

    ```css
    .footnotes {
      padding-top: 60px;
      margin-top: -60px;
    }
    ```

    This seems to work at first, but you wind up with a `60px` vertical column of invisible blocking padding that prevents interactions underneath it, which is especially problematic at the foot of the footnotes, but potentially a problem everywhere.

[^1] It was non-trivial to figure out how to escape the nunjucks inside the `<article>` tags. The trick was to wrap it in a `{{ "{% raw %}...{% endraw %}" | escape }}` block.[^2]

[^2] And to learn how to escape that `{{ "{% raw %}...{% endraw %}" | escape }}` block, see this [blog post](https://www.constantvallee.dev/posts/escape-nunjucks-in-markdown/).
