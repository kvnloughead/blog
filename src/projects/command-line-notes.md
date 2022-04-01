---
layout: 'post.njk'
title: Command Line Notes
image: /images/projects/cli/command-line-notes.png
alt: VSCode open with a `git.md` file. The file was opened at the command line with the command `cln git`.
tags: [Bash, Git, Python, Unix]
links:
  - text: Repo
    url: https://github.com/kvnloughead/command-line-notes
    type: fa-brands fa-github
---

A simple command line note taking utility. After a few years of failing to find a note-taking app that satisfied me, I decided to make my own. Allows for creation and editing of markdown notes files from the comfort of the command line, or the editor of your choice.

Using the [suggested aliases](https://github.com/kvnloughead/command-line-notes), you can create new markdown note files, or edit existing ones, with `cln edit note-name`. Notes are stored locally in `~/.cln/notes` and are opened in the editor of your choice (defaults to nano. See [`config.md`](https://github.com/kvnloughead/command-line-notes/blob/main/docs/config.md) for details on how to change the defaults). Subcommands exist for

- renaming and deleting notes
- grepping through the content of your notes
- finding notes that match a pattern
- printing a list of all notes to the terminal, or to a pager
- opening the directory of notes in your editor of choice
- pushing your notes to a remote repo (see [git-integration.md](https://github.com/kvnloughead/command-line-notes/blob/main/docs/git-integration.md) for details)
