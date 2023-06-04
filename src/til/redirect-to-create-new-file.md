---
title: Create new files without touching them
category: til
author: Kevin Loughead
date: '2023-06-03T10:42:42.865Z'
---

Instead of creating new files with `touch`, you can use the redirection operator:

```plain
# this works
$ touch foo.txt

# but this is easier
$ > foo.txt
```

The redirection operator is also more generally capable, because you can add text to the file that you are creating.

```plain
$ echo node_modules > .gitignore
```
