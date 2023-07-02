---
order: 2
title: Min - a minimal note-taking CLI
tags: [Bash, Git, Deno, JavaScript, Python, Unix]
links:
  - text: Current
    url: https://github.com/kvnloughead/min
    type: fa-brands fa-github
  - text: Original
    url: https://github.com/kvnloughead/command-line-notes
    type: fa-brands fa-github
---

A simplish command line note taking utility. After a few years of failing to find a note-taking app that satisfied me, I decided to make my own. Allows for creation and editing of markdown notes files from the comfort of the command line, or the editor of your choice.

This is actually my second version of the app. The first was written in Python, and served me well for a while, but has a few bugs. It has support for hosting your notes on GitHub, which works fairly well, but in practice I found to be a pain to keep things in sync.

The current version is written in Deno, has mostly the same feature set, but no option for GitHub integration, at least not currently. But it allows you to choose an arbitrary location (or locations) to store your notes in. I keep mine in dropbox, for easy synchronization on all my devices. Features include

- creating markdown notes and editing them in your editor of choice with `min edit note-name`
- print note content to stdout with `min cat note-name`
- support for categories of notes. Notes in different categories will be placed in subfolders.
- finding notes by name with `min list [pattern]`
- grepping through the content of your notes with `min grep [pattern]`
- opening the directory of notes in your editor of choice
- delete or rename your notes
- autocompletion of notes by name. Currently only supports notes in the default category.
- allow different config files and folder locations to be specified as an arguments, or inside config files. Useful if you want to direct certain types of notes to different files. Blog posts, for instance.
