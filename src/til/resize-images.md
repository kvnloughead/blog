---
category: til
author: Kevin Loughead
date: '2023-06-26T18:43:14.782Z'
---

You can resize images at the command line with Image Magick. First, install it:

```plain
sudo apt install imagemagick
```

Then convert:

```plain
convert original.png -resize 100x100 new.png
```

Works great! For more basic use cases, see this [article](https://www.digitalocean.com/community/tutorials/workflow-resizing-images-with-imagemagick) at Digital Ocean.
