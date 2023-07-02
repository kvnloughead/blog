---
title: 'Automating the Creation of New Github Repos'
date: '2021-10-13'
tags: ['Automation', 'Git', 'GitHub', 'Bash']
---

Today I'm going to walk you through writing a Bash script to automate a common task: creating a new repo on GitHub, setting it as the remote of a local repo, and making your first push to the new repo. This will require you to use GitHub's [command line interface](https://github.com/cli/cli), so make sure you've got that set up before you try this out.

I'm working on Windows using Windows Subsystem for Linux (WSL2). With some modifications, the same script should be implementable on any \*nix OS.

Ok, the first thing we need to do is create a script and make it executable. Let's create it in our `~/bin` directory, where `~` refers to the user directory. Depending on what system you're running, this directory may or may not exist already, so create it if it doesn't already exist.[^1]

```plain
cd ~/bin
code gh-new.sh
```

Feel free to change the name of the file. The `sh` stands for "shell", a reference to the bash shell. On the first line of this file put the following:

```bash
#!/bin/bash
```

This little bit of magic is called a "shebang" line (because `#! === "hashbang" ~== "shebang"`). It tells your computer where to look for the
program that can execute this script. You might want to double check that this line is correct by entering `which bash` in the terminal. This should tell you where the executable is. And note that the file path starts with `/bin` , not `~/bin`. The former is for important system executables, the latter is for your own scripts.

After this, we can start writing our script. We'll be assuming that we are in a local git repo that has at least one commit. What we need to do is

1. create a remote repo on GitHub,
2. set this repo as the remote for our local repo, and
3. push the changes.

Let's start with creating the new repo on GitHub. We can do this with

```bash
gh repo create project-name --public
```

where `project-name` is the name of the repo, and `--public` is a required flag. If you'd rather the repo be private, change this to `--private`. The next two lines are probably familiar to you:

```bash
git remote add origin https://github.com/<your-username>/project-name
git push -u origin main
```

Just change `<your-username>` to your Github username. And what we have here is actually a working script,

```bash
#!/bin/bash

gh repo create project-name --public
git remote add origin https://github.com/kvnloughead/project-name.git
git push -u origin main
```

albeit not a very useful one, since we've hardcoded the name of the repo. But let's give it a spin to make sure it's functioning. Then we'll improve it by allowing an arbitrary repo name.

Before we can execute this script, we have to make it executable. You can do
this with the `chmod` command:

```plain
chmod u+x ~/bin/gh-new.sh
```

You'll only have to do this once. This gives the user (you) the right to execute the file. Now, let's set up a new local repo and prep it for pushing. You can do so quickly like this:

```plain
mkdir temp && cd temp
git init
echo "foo" > readme.md
git add -A
git commit -m "initial commit"
```

And now we can run our script. We do so simply by invoking it (using either an absolute or relative filepath):

```plain
~/bin/gh-new.sh
```

You should get a printout that looks something like this:

```plain
✓ Created repository <username>/project-name on GitHub

Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 221 bytes | 55.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/<your-username>/project-name
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

Now go to GitHub and you should find a new repo called `project-name`. You might
as well delete it now so you don't forget. If the repo wasn't created, you might
have authentication issues. I'm not sure how this script would work if git asks
for a password, because it hasn't come up for me yet.

Now let's make this script a bit more useful, by allowing it to accept an
arbitrary name for the project as an argument. In general, arguments are given to a command line program as a space separated list. We really only need a single argument, the name of the repo. We would like to invoke our program to function like this:

```plain
~/bin/gh-new.sh arbitrary-name
```

and have it insert `arbitrary-name` into the two places in our script that currently say `project-name`. Arguments that are passed to a bash script are mapped to the special character sequences `$1`, `$2`, `$3`, and so on.[^2] To see what I mean, change our script as follows:

```bash
#!/bin/bash

echo $1 $2

# gh repo create project-name --public
# git remote add origin https://github.com/kvnloughead/project-name
# git push -u origin main
```

The `gh` and `git` commands are commented, so we don't create another pointless
repo, and the `echo` command simply prints its arguments to the terminal. Now
invoke the script with two arguments of your choice. For example:

```plain
$ ~/bin/gh-new.sh foo bar
> foo bar
```

So we can access the first argument with `$1`, and all we really need to do to
make this work is to put this in place of our hard-coded project name.

```bash
#!/bin/bash

gh repo create $name --public
git remote add origin https://github.com/kvnloughead/$1.git
git push -u origin main
```

But if you'd rather be more explicit, you can give the variable a name:

```bash
#!/bin/bash

name=$1

gh repo create $name --public
git remote add origin https://github.com/kvnloughead/$name.git
git push -u origin main
```

This shows one of the trickier parts about handling variables in bash. An assignment
statement looks like this:

```bash
varname=$<something>
```

with the right-hand side starting with a `$`. But then if you want to _refer_ to the variable, `varname` alone is not sufficient. You have to use `$varname`.

Alright, the script is ready, so let's test it. Create a new local repo with
the steps I showed above and then run

```plain
~/bin/gh-new.sh name-of-your-choice
```

If you go to Github, you should find a new repo with the name you chose.

There's one more thing to cover before moving on. You might be wondering if you always have to use the file path when calling your script. Well, no you don't, there are ways around that. In fact, I'm sure there are better ways around it than the one I am going to show you. But this is the way I know, and it has broad applicability. You can just set an bash alias. First I'll show you how to do it right in the terminal. This is useful at times, but the alias won't persist to future shell sessions. Here is the syntax:

```plain
alias gh-new='~/bin/gh-new.sh'
```

Now whenever you enter what's on the left side of the equals sign, `gh-new`, it will be replaced with what's inside the quotes on the right-hand side, so we can run our script with `gh-new repo-name`.[^3]

Now we are at the last step — making this alias persist. We can do this in our `~/.bashrc` file, so open that in your editor of choice. This file has all sorts of settings pertaining to bash. Scroll all the way down to the bottom, add the alias

```bash
alias gh-new='~/bin/gh-new.sh'
```

and save the file. Now, every new bash session will run this bit of code on startup, so your alias will always be available. But changes made to that file won't effect any current bash sessions. You won't notice it in this case, since we already added the alias via the terminal. But if you make a change to `~/.bashrc` and want to make that change available in the current shell session, all you need to do is run the command

```plain
source ~/.bashrc
```

The `source` command simply executes a file in the current shell environment, so that any changes to that file will take effect.

<hr />

[^1] If you create this directory yourself, you will have to instruct your OS to look there when looking for commands to execute. Otherwise it won't find your program when try to run it. To do this, first open your `~/.bashrc` file in an editor. This is where many of your user settings for bash are stored. If you search it for the string `PATH` and you see a line that looks like this

```bash
export PATH="$HOME/bin:$PATH"
```

then your `~/bin` directory is already on the "PATH" that your OS will follow when looking for executables. If not, add that line somewhere. You might want to mark off a section for settings that you enter yourself, to help you distinguish between it and the initial settings. But the changes won't take effect until either

1. you start a new terminal session, or
2. you make bash register the changes by "sourcing" `~/.bashrc`.

The command for the second option is `source ~/.bashrc`, or `. ~/.bashrc` for
short.

[^2] Note that `$0` is mapped to the path of the script that is being run.

[^3] You can only use aliases on the _left_ side of a command. This means
that you can pass arguments to an alias, but can't pass an alias as an argument.
