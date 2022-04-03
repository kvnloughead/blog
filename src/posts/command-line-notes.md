---
title: 'Command Line Notes'
date: '2021-12-03'
tags: ['Automation', 'Note Taking', 'Python', 'Command Line']
---

I've never been a very good note taker, but I've always appreciated the art. When I got my undergraduate degree in math I tried to be studious. I produced massive quantities of notes in Microsoft OneNote. I suppose they were helpful in a way, etching the concepts in my brain. But ultimately the practice was unsustainable, and I've haven't referred to the notes since.

After graduating I started learning to program. Part of this process was learning how to quickly find relevant information ~~on StackOverflow~~ in the documentation. Who needs notes! But some pieces of information are harder to find then others, and some are harder to internalize, so I still needed to take notes sometimes. But I could never find a note taking app that satisfied me completely — so I decided to make one myself. It still doesn't satisfy me completely, but it works and I like it and I keep making it better. Here is an intro to the app.

### Command Line Notes (cln)

[Command Line Notes](https://github.com/kvnloughead/command-line-notes) is minimal Markdown notetaking app, written in Python. It's primary function is allowing rapid fire opening of Markdown note files, that you can edit in the comfort of your preferred text editor. It collects the notes on your local file system, provides commands allowing you to organize and search through your notes, and to sync your notes with a repo on GitHub.

#### Creating and Editing Notes

You can open a note[^1] for editing with the command

```plain-text
cln edit name-of-note
```

This will open a file called `~/.notes/default/git-rebase.md` in your preferred editor.[^2] The directory `~/.cln/notes/` will be created the first time you create a note, and the subdirectory `default/` will be created the first time you make a note without explicitly setting a category. Categories can be specified with the `-c | --category` flag. For example, you could keep todo lists for all your different projects:

```plain-text
cln edit project-x -c todo 
```

The note file will have some YAML metadata at the top, most of which I'm not doing much with at the moment.

```yaml
---  
Title: project-x  
Category: todo  
Author: Kevin Loughead  
Date: 2021-12-03  
Tags:   
---  
```

And now you can write down your notes and close the file. You can reopen the file at any time using the same command:

```plain-text
cln edit project-x -c todo 
```

But maybe you don't always want to open VSCode to take a look at a note file. Often I like to pop open a note for quick review or revising right in my terminal. Well, there's a flag for that:

```plain-text
cln edit name-of-note -e nano  # opens note in nano
```

You can also open the entire notes directory in your editor with `cln opendir`. This is a feature I felt was lacking in other note taking apps I've tried, although to be honest I have rarely used it outside of development.

#### Git/GitHub Integration

Local git integration should work out of the box. When you create your first commit, the `~/.cln/notes` directory is initialized with `git init`. Then to make a commit, simply run `cln commit`. A default commit message with a timestamp will be provided, but you can override this if you'd like.

GitHub integration requires a few additional steps. Assuming that you've already created a note and made a commit, you then need to

1. Create a new repo on Github.
2. Run `git remote add origin path/to/remote/notes/repo` in your local notes directory to set the remote.
3. Run `cln push` to push the `main` branch.

Now anytime you want to push, you just run `cln push`.

[^1] This will require the alias `alias cln='python path/to/command-line-notes/main.py` to be set.
[^2] Preferred editor can be set in a config file.
