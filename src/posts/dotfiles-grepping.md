---
category: posts
author: Kevin Loughead
title: Grepping Through Your Dotfiles
tags: ['Dotfiles', 'grep', 'Bash', 'Git']
date: '2023-06-03T14:35:05.198Z'
---

I manage my dotfiles with a bare git repository, as described in [this post](https://kevinloughead.com/blog/bare-dotfiles-repo). One issue I have run into is remembering where exactly I added this or that alias. Did I place it in `.bash_aliases`, or did I create a separate file, like the file for my [Git aliases](https://github.com/kvnloughead/dotfiles/blob/main/.aliases/git.sh). And what exactly does it do, anyway? Here are a few tricks I've learned to help with this.

### The `type` built-in

The `type command-name` command is useful in this regard. If `command-name` is an alias, it will tell you what it is aliased to. If it is a built-in, it will give you the path to its binary.

```plain
$ type gst
gst is aliased to `git stash`

$ type cp
cp is /usr/bin/cp
```

If it's a function, it'll spit out the whole function for you:

```plain
getremote is a function
getremote ()
{
    local remote=$(git config --get remote.origin.url);
    echo $remote;
    if [[ "$remote" =~ ^https:// || -n git@github.com: ]]; then
        remote=${remote/https:\/\/github.com\//git@github.com:};
        remote=${remote/https:\/\/gitlab.com\//git@gitlab.com:};
        remote=${remote/https:\/\/bitbucket.org\//git@bitbucket.org:};
        remote=${remote/git:\/\/github.com\//git@github.com:};
        remote=${remote/git:\/\/gitlab.com\//git@gitlab.com:};
        remote=${remote/git:\/\/bitbucket.org\//git@bitbucket.org:};
        echo "$remote" | xclip -selection clipboard;
        echo "Remote repo copied to clipboard in SSH format";
    else
        echo "Not a Git repo or remote URL not recognized";
    fi
}
```

### Grepping through dotfiles

But the `type` command doesn't tell you where the alias or function is located. One fantastic solution is `git grep`. The `git grep` command is pretty simple: it greps through a git repository. It's often a more user friendly alternative to `grep`, because you don't need to specify the file(s) that you want to search in. Just run `git grep foo` from inside a git repo, and you'll receive a lovely list of matches, by filename. Even better, it only searches through files that are being tracked by Git.

This is a perfect fit for grepping through your dotfiles, but a bit of setup is in order. First, recall the alias that allows us to interact with the dotfiles repo:

```bash
alias dotgit='git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'
```

Now, we could just run the command as `dotgit grep foo`. However, will only work if we're inside a directory that's being tracked by our dotfiles repo. This is often a bit inconvenient. So, we can wrap the command in a simple function:

```bash
function dgrep() {
  # cd's home, greps the dotgit repo, and cd's back to cwd
  cd && dotgit grep $1; cd -
}
```

Now we can run the command `dgrep foo` from anywhere to grep our dotfiles, without changing our current working directory.
