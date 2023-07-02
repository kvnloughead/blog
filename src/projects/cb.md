---
order: 1
title: CB (a clipboard manager)
tags: [Bash, Unix, CLI, NodeJS]
links:
  - text: Repo
    url: https://github.com/kvnloughead/clipboard-manager
    type: fa-brands fa-github
---

A simple but effective clipboard manager. The idea is based on Al Sweigart's clipboard manager from [Automate the Boring Stuff](https://automatetheboringstuff.com/), but it's written in NodeJS, uses flat files for storing clipboard info, and comes with some additional features.

The primary function is to store text from your clipboard in a JSON file, and to retrieve the clips from the file to your clipboard as needed.

```plain
# save clipboard contents as 'my-clip'
$ cb set my-clip

# retrieve the clip by name
$ cb get my-clip
```

Additional features include:

- output clips to stdout, instead of to clipboard
- easily manage your clips by opening the file in your editor with `cb open`
- list all clips keys that match a pattern with `cb list [pattern]`
- grep through keys and values with `cb grep [pattern]`
- images are supported via the `--img` flag
- autocompletion
