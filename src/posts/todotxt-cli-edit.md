---
title: 'A custom edit action for todo.txt-cli'
date: '2023-01-27'
tags: [grep, Bash, Unix, Command Line, todo.txt, CLI]
---

Frequently I find myself looking for a better way to keep track of my todo list, and I may have found the ideal solution for me: [todo.txt](http://todotxt.org/). It's a simple plain text syntax for writing todo lists. I've been using it with the [todo.txt CLI](https://github.com/todotxt/todo.txt-cli) lately, on Ubuntu and WSL2, syncing the documents with Dropbox[^1].

But one command seemed to me to be lacking from the CLI: there's no command to edit a todo, only to replace it.

```bash
$ todo.sh replace ITEM# "Updated ITEM"
```

This subcommand works by feeding it the todo's unique item number, which can be found by searching/filtering the todo list with the `todo.sh list` subcommand:

```bash
$ todo.sh list        # lists all todo items
$ todo.sh list foobar # lists all todo items containing the text `foobar`
$ todo.sh list +blog  # projects are prepended with a +
$ todo.sh list @phone # contexts are prepended with a @
```

But it would be nice to be able to actually _edit_ a todo item. Maybe add a context, or some notes to it. I found this [user created edit action](https://github.com/mbrubeck/todo.txt-cli/blob/master/todo.actions.d/edit) that allows you to open your file of todos in your `$EDITOR` like this:

```bash
$ todo.sh edit         # opens $TODO_DIR/todo.txt in $EDITOR
$ todo.sh edit report  # opens $TODO_DIR/report.txt in $EDITOR
```

And this is nice, but it wasn't what I was looking for, so I rewrote it. Here's [the gist](https://gist.github.com/kvnloughead/72c4ef0f937731e88e37783fdee9bf4f). The full code is below.

If you pass it a number that corresponds to one of your todo items, it prompts you to update the entry:

```bash
$ todo.sh edit
Current entry:  write blog post +blog
Updated entry:  write blog post +blog█
```

The block at the end of the second line is where your cursor will be. So you can easily append to the item, or do more complicated edits[^2]. In addition to this, if no argument is passed, `$TODO_DIR/todo.txt` will be opened in your `$EDITOR`.

There are a few issues that I may fix at some point:

1. Numbers less than 10 require a leading 0
2. I'd like to add support for opening other todo.txt related files for editing, like `$TODO_DIR/done.txt` or `$TODO_DIR/report.txt`. But perhaps that should be a different action.

```bash
#!/bin/bash
# Allows editing of a single todo item, selected by number. If no number is specified,
# opens todo.txt in $EDITOR. Place this file in .todo.actions.d.

case $2 in

"usage"|"help")
  echo
  echo "todo.sh $(basename $0) [ITEM_NUMBER]"
  echo
  echo "  Prompts user to edit the todo entry with corresponding #ITEM_NUMBER."
  echo "  The current entry will be loaded into the input field."
  echo "  To clear the input field, try using ^U."
  echo "  If ITEM_NUMBER isn't specified, opens \$TODO_DIR/todo.txt in \$EDITOR."
  echo
  ;;

*)
  if [[ -z $2 ]]; then
    FILE=$TODO_FILE
    if [ -n "$EDITOR" ]; then
      $EDITOR "$FILE"
    else
      echo "Error: The EDITOR environment variable is not set"
    fi
  else
    FILE=$TODO_DIR/$2.txt
    entry="$(todo.sh list | grep ^$2\\s | sed "s/$2//")"
    printf "Current entry: $entry\n"
    read -e -i "$entry" -p 'Updated entry: ' newval
    todo.sh replace $2 $newval
  fi
  ;;
esac
```

[^1] There's Android support too, I've been using [Markor](https://play.google.com/store/apps/details?id=net.gsantner.markor&hl=en_US&gl=US&pli=1).

[^2] Try using `Ctrl + u` if you want to clear the input field.
