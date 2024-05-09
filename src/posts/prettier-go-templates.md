---
title: "Formatting Golang HTML Templates with Prettier"
category: posts
author: Kevin Loughead
date: "2024-05-09T14:19:05.954Z"
tags: ["golang", "prettier"]
---

In [the previous article](https://kevinloughead.com/blog/hot-air-reload) I discussed my setup for hot reloading a Go server using the Air package. Another quality of life improvement I made was to use Prettier to format my templates.

I was actually rather surprised to find that Go templates (I'm using the standard library `html/template` package) had no default formatting tool, because Golang itself takes standardized and automatic formatting very seriously. But setting up Prettier is not too difficult. The following worked for me. First, install Prettier via NPM, as well as the appropriate plugin.

```plain
npm install prettier prettier-plugin-go-template --save-dev
```

Then create a `.prettierrc` file with the following contents:

```plain
{
  "plugins": ["prettier-plugin-go-template"]
}
```

And since I was using the extension `.tmpl` for my HTML templates, I needed to set up an association in my VSCode settings:

```json
"files.associations": {
	"*.tmpl": "html"
},
```

Now, if you have Prettier set up to format your HTML files, it will no format your projects templates.
