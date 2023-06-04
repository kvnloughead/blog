---
title: Clean up before killing
category: til
author: Kevin Loughead
date: '2023-06-01T10:42:42.865Z'
---

When killing a process, it's usually better to _not_ use the `-9` flag. The command `kill -9` immediately kills a process, without giving it time to clean up after itself. Instead, try using `kill -15` first. This allows a process to terminate itself gracefully. `kill -9` is better reserved as a command of last resort.
