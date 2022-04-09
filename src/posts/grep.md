---
title: 'How to search through text with grep'
date: '2022-01-01'
tags: [grep, Bash, Unix, Command Line]
---

Here are a few ways to use `grep` — a command line program that allows you to search through text.

## 1. Search for a pattern in a file

The basic syntax is

```plain
grep <pattern> <filename>
```

where `<pattern>` is a string or regex. Running this will print each line in `<filename>` that contains a match for the supplied pattern `<pattern>`.

## 2. Search for a pattern throughout a directory

You aren't limited to searching in single file though, either. So, say you know you defined a function called `DoSomething` somewhere in a project repo, but forget where. Well,

```plain
grep -r DoSomething .
```

will search through all files in the tree. To search specifically for the function's declaration, try grepping for `const DoSomething` or `function DoSomething` instead. If you omit the `-r`ecursive flag, the search will be restricted to the current working directory.

Of course, you might not want to search through _every_ file in the tree (I'm looking at you, `node_modules`). If you are in a git repo and the files you want to skip are untracked,you can use the `git grep` command instead . It has the same interface (as far as I know), but only searches through tracked files in the working tree. For more general use cases, you can use the `--exclude-dir=<dirname>` flag, which tells `grep` to omit the indicate directory[^1].

## 3. Piping data into grep

Another way to use `grep` is to pipe data into it, rather than by passing it a filename as an argument. I'll explain it by way of an example. Suppose you run into a command in some tutorial, or set of installation instructions, and you would like to know a bit more about it.

```plain
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
```

Specifically, you'd like to know what all those flags do. You might break out the `man` page, with

```plain
man curl
```

and then search through it for the flag. Maybe you remember that in a `man` page you can search for patterns using the `/` key. And actually, that works quite nicely, with the keymapping for the (n)ext and (p)revious actions being refreshingly commonsensical. But this is an article about `grep`, so let's stay on topic. Here's how we can pipe the contents of the `man` page for `curl` into `grep`

```plain
man curl | grep -- -s,
```

The results are pretty effective in this case — we learn that `-s` stands for 'silent'. Not much more to say about that. You probably won't always get the answers you're seeking quite that easily, though. Try it out for the other flags in this command, `-L` and `-o`. The results are rather disjointed, which makes the already awfully hard to read `man` pages that much less scrutable[^2]. So, frankly this use case is maybe not the most useful, sorry about that. But it was good for illustrative purposes.

Now, there are a few things I'd like to point out about the command we just used. First, the pipe character, `|`. This character takes the output of the program on its left and "pipes" it into the program on its left. So, we're feeding the text of the `man` page to grep. And the characters `-s,` is what we are searching for. I added the comma to filter out the results a bit. You won't always be able to use the same tactic, since the formatting conventions are not commpletely uniform.

Last, there's that `--` in between `grep` and `-s,`. To see what that does, we'll actually have to look to the `man` page for `bash` itself.

```plain
$ man bash | grep -- ' -- '
# A -- signals the end of options and disables further option processing...
```

So basically, the `--` is signalling to `grep` that whatever follows it is not a flag. If you don't use it, then `grep` will think that `-s` is a flag. This usage is common to more than a few command line programs.

Now, you might be thinking, "but couldn't we just quote the darn thing?" Well, the answer is yes, but it's tricky. Because quoting in bash is tricky. Maybe I'll write about that in another post.

<hr />

[^1] Available on GNU grep since v2.5.2. ([Source](http://git.savannah.gnu.org/cgit/grep.git/commit/?id=29b030df))

[^2] Speaking about the unfriendliness of `man` pages, there is a nice alternate/supplement available called [`tldr`](https://github.com/tldr-pages/tldr). Simple descriptions coupled with clear, community-maintained practical examples. It's worth a look.
