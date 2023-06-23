---
category: til
author: Kevin Loughead
date: '2023-06-19T16:27:58.503Z'
---

The `xargs` command can be used to feed the output of one program as variadic arguments to another program.

For example, here's how you can delete all Git branches that match the glob `feat/*`:

```plain
git branch --list 'feat/*' | xargs git branch -D
```
