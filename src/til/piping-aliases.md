---
category: til
author: Kevin Loughead
date: '2023-06-23T16:21:47.263Z'
---

Bash aliases only work at the beginning of the command. But this doesn't mean they only work at the beginning of the command _line_. For example, given the alias

```bash
alias clip="xclip -sel clipboard"
```

It works fine when piping.

<!-- no-copy -->

```plain
$ someCommand | clip
```

Now the output of `someCommand` is loaded to your clipboard.
