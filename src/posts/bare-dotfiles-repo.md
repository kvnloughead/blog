---
title: 'Dotfiles in Version Control'
date: '2022-03-09'
tags: ['Dotfiles', 'Unix', 'Bash', 'Git']
---

A few months back I set up my first [dotfiles repo](https://github.com/kvnloughead/dotfiles-homerepo).[^1] I chose the simplest option — turning my $HOME directory into a repo with a `.gitignore` of `*`. This went ok, and I was able to set up a new computer with relative ease.

But the setup was not without its problems, most of which stemmed from the fact that _everything_ inside my $HOME directory was now inside the dotfiles repo. So if I were to mistakenly run a `git` command in `~/dev` (which is not a git repo) thinking that I was running it in `~/dev/some-git-repo`, the command wouldn't fail with a helpful

```plain
fatal: not a git repository
```

because _everywhere_ was now a git repository. I wiped out a couple of commits and my unstaged working tree with a misplaced `git reset --hard HEAD~1` in this way. On top of this, I ran into issues when I tried pushing to an alternate GitHub account for work. No matter what I did, I couldn't convince Git to use the correct `user.name` and `user.email` when pushing — it would always fall back on the configuration from the parent repo.

So, I decided to try again, this time with a bare repo. I had avoided this initially because I didn't really understand how bare git repos work. But I found a [great article](https://stegosaurusdormant.com/bare-git-repo/#fnref:no-home-git-repo) by Greg Owen that not only explains what bare repos are and how you can use them, but also walks you through the initial setup and basic usage. Here's my understanding of the subject, in as simple terms as possible.

To understand bare repos, consider what a normal repo looks like. It contains two major parts, the working tree and the `.git` directory.

```plain
root/
  working_tree
  .git/
```

The working tree is where we do our work, and the `.git` directory is where the history is stored. In contrast, a bare repo contains only the history — it has no working tree. This might seem strange at first. Where do we do our work if there is no working tree? The answer is, well, wherever you'd like.

This is actually how a remote repository on GitHub works. GitHub repos are implemented as bare repositories, meaning that they contain a repo's Git history, but they _don't_ actually contain a working tree, or store your actual files. The file structure you can see on GitHub is created for you on demand from the repository's history. The working tree(s) for a GitHub repo exist locally, on the machines of all the developers that interact with it. The remote is just a place where the changes are tracked.

A bare dotfiles repo works in the same way. It allows you to track any files under your $HOME directory, or wherever else you choose to place your working tree. The changes will be tracked in a directory of your choosing. I went with `~/.dotfiles`.

For a detailed explanation of how to set this up for yourself, refer to the [README](https://github.com/kvnloughead/dotfiles) in my GitHub repo.

[^1] If you're not sure what dotfiles are, or why you'd want to put them under version control, this article is a good starting point.
