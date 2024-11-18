---
category: posts
author: Kevin Loughead
date: '2023-07-01T18:56:03.511Z'
title: 'A Spellchecking CLI'
excerpt: |
  There is a rather nice command line spell checker called `aspell`. In this article I explain the basics.
---

There is a rather nice command line spell checker called `aspell`. Basic usage is fairly simple.

```plain
aspell check file
```

This opens the file in an interactive spell checker. Consider this amusingly misspelled HTML file as an example.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dorkument</title>
  </head>
  <bdy></bdy>
</html>
```

Now we run `aspell check mispelled.html`:

<img src="/images/posts/aspell-1.png" 
     alt="The aspell program. Apparently 'Dorkument' is mispelled." />

We have many options available to us. In this case, replacing the word with a more appropriate title is in order. If we do so, the replacement happens immediately and we're done. No more spelling errors? What about `bdy`? Well, that's inside an HTML tag, and `aspell` is smart enough to know it's place and to not go around flagging code all over the place. That's what linters are for!

Note that if the file were not given the `.html` extension, then `aspell` would spell check it like a normal document, which is problably not what we are going for:

```plain
mv mispelled.html mispelled
aspell check mispelled
```

<img src="/images/posts/aspell-1.png" 
     alt="The aspell program, checking the spelling of an HTML document as if it weren't one." />

However, there's a flag for that.

```plain
# the flag tells aspell that the file should be considered HTML
aspell check -H mispelled
```

One small gripe I have about the program is that it doesn't seem possible to replace a mispelled word with an empty string. You either have to ignore it, or replace it with something. Although perhaps I just haven't figured out how to do it yet.

Note: this document was spellchecked with `aspell`, and it appears to even recognize markdown code blocks, and HTML embedded inside markdown files. Nice!
