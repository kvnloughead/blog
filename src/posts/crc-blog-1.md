---
title: 'A Script to Create React Components. Part 1 of 2'
date: '2021-10-13'
tags: ['Automation', 'React', 'Bash']
---

After creating new React components manually for the umpteenth time I decided
that the process could be automated a bit. We have CRA for React _apps_. Why not
CRC, for React components? This is part one of a two part article that will walk
you through writing a Bash script to automatically create the necessary
boilerplate for a React component in the current working directory. I considered
writing this script using Python or NodeJS, but instead decided (for some reason)
to write a bash script instead. Writing bash scripts is a bit of an acquired
taste. The Bash shell itself is 30 year old tech, and many of its the bread and
butter commands date back to the dawn of Unix in the early 70's — if not
earlier. So you might miss out on some of smoothness and hand-holding of a modern
language like Python or JavaScript. But it is still a powerful tool with many
applications, and gaining some familiarity with it is well worth your time. And
for any retro computing or history of computation geeks out there, playing
around with Bash is a great hobby.

These articles assume a certain level of familiarity with bash scripting. If
you're looking for a more gentle introduction, checkout my [post](/gh-new-repo)
about writing a script to automate the creation of new repos on Github.

Let's get started by describing the goal of our program. Its desired usage is as
follows. If we type in a command like this

```plain
crc Header
```

into the terminal, it will create for us a file structure like this

```plain
Header/
  |______ Header.js
  |______ styles.css
```

in the current working directory. Inside `Header.js` will be the following
boilerplate:

```jsx
import React from 'react';

const Header = () => {
  return (
    <></>
  );
};

export default Header;
```

The `css` file will be empty. In the future we'll expand the script to allow styled-components.

Now that we've described what our script will do, it's time to get down to work. First, we need to create a script and make it executable. Let's create it in our `~/bin` directory, where `~` refers to the user directory. Depending on what system you're running, this directory may or may not exist already. If it doesn't, feel free to create it. We'll store our executable (aka "_bin_ary") files here. If you create this directory yourself, you'll' have to instruct your OS to look there when its searching for commands to execute. Otherwise it won't find your program when try to run it. To do this, first open your `~/.bashrc` file in an editor. This file is where many of your user settings for Bash are stored. If you search it for the string `PATH` and you see a line that looks like this

```bash
export PATH="$HOME/bin:$PATH"
```

then your `~/bin` directory is already on the "PATH" that your OS will follow when looking for executables. If not, add that line somewhere. You might want to mark off a section for settings that you enter yourself, to help you distinguish between them and the initial settings. But note that these changes won't take effect until either

1. you start a new terminal session, or
2. you make bash register the changes by "sourcing" `~/.bashrc`.

The command for the second option is `source ~/.bashrc`, or `. ~/.bashrc` for short. So run that command now.

Next, create a file called `crc.sh` inside `~/bin`. This is the file that will hold our script. But we won't actually be able to execute our script at the command line without changing the permissions of the file. So run this command inside your `~/bin` directory:

```plain
chmod u+x crc.sh
```

It will allow the file to be executed by the file's owner. If instead you wanted it to be executable by anyone, you could run

```plain
chmod x crc.sh
```

Now let's make sure our script runs, by writing the traditional first program. So add this text to `crc.sh`

```bash
#!/bin/bash

echo "Hello, World!"
```

and the run the command `crc.sh`. The string `Hello, World!` should be be printed to the terminal. And this command should work fine from any directory, not just from inside `~/bin`, because that `bin` directory is on our path. But you may be wondering if we can call it without the `sh`? One way to do this is with an alias. Remember `~/.bashrc`, where we exported the `bin` directory to your path? Open that up again and scroll to the bottom. We are going to set up a simple alias so that will allow us to call `crc.sh` by using simply `crc`. This is similar to creating a variable, but differs in some key respects, which we'll cover in more detail later on. The syntax is like this:

```bash
alias newCommmand="command args"
```

In this case, we don't need any arguments. We can just write:

```bash
alias crc="crc.sh"
```

Now if we source `~/.bashrc` again and run `crc` we should see that it works. Great! We have a 'Hello World' program. In the next installment, we will make the program do something a bit more useful.
