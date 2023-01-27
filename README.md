# An Eleventy Blog and Portfolio Site

My personal blog and portfolio site. I largely followed [this tutorial](https://sia.codes/posts/itsiest-bitsiest-eleventy-tutorial/) for the initial setup, and [this one](https://11ty.rocks/posts/create-your-first-basic-11ty-website/) to get the basic routes set up. I've also referred to the [eleventy-duo] blog template, to help me understand how all the pieces fit together.

## Features

- Templating with Nunjucks
- YAML front matter (because TOML breaks hot reloading)
- Vanilla CSS dark theme (using CSS custom properties)
- Blog posts written in Markdown with YAML front matter for tags and other metadata
- Portfolio page at the root of the site, with cards for all your lovely projects
  - New projects are written in the same way that blog posts are, but with a bit more metadata
- Working footnotes in blog posts, (parsed with Vanilla JS)
- Tags — for both projects and posts
- Responsive mobile menu for navbar (Vanilla JS)

## To do

- Search for posts
