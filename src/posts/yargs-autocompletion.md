---
title: 'On Yargs Autocompletion'
# excerpt: |
#   Yargs provides some rather nice autocompletion for commands and flags with some minimal setup, but I wanted autocompletion of positional arguments for one of the commands in the CLI clipboard manager I'm making. This clipboard manager (cb) basically does one thing: let's me quickly save the contents of my clipboard, and retrieve the clips by name.
coverImage: ''
date: '2023-02-07'
author:
  name: Kevin Loughead
  picture: ''
ogImage:
  url: ''
tags: [Bash, CLI, NodeJS, JavaScript, Yargs]
---

[Yargs](https://yargs.js.org/) provides some rather nice autocompletion for commands and flags with some minimal setup, but I wanted autocompletion of positional arguments for one of the commands in the CLI [clipboard manager](https://github.com/kvnloughead/clipboard-manager) I'm making. This clipboard manager (`cb`) basically does one thing: let's me quickly save the contents of my clipboard, and retrieve them by name.

So, I want to be able to type my getter command `cb get`, and to have autocomplete pulling from the list of clips stored by the clipboard manager.

I found [the docs](https://yargs.js.org/docs/#api-reference-completioncmd-description-fn) on this a bit confusing, so decided to write up my experience.

## How to use Yarg's default completion

This is fairly easy. Add a call to `.completion()` in your `yargs...argv` chain:

```javascript
var argv = require('yargs/yargs')(process.argv.slice(2)).completion().argv;
```

Then run `./your-script.js completion >> ~/.bashrc` to output a completion script to `~/.bashrc`. Change to `.bash_profile` if you prefer. After this, don't forget to source `.bashrc`.

## How to add custom completion, but still leverage the defaults

This was a bit tricky. As it turns out, there are three different ways that you can interact with the `completion` method, and only one supports using the defaults along with custom completion [(source)](https://github.com/yargs/yargs/pull/1855):

- 2 args = synchronous function or Promise function, can't call default
- 3 args = callback function, can't call default
- 4 args = callback function, can call default

So, going with the 4 arg option, I wound up with something like this:

```javascript
.completion('completion', function (current, argv, completionFilter, done) {
    if (argv._.includes('g') || argv._.includes('get')) {
      completionFilter(() => {
        const clipKeys = Object.keys(JSON.parse(fs.readFileSync(clipsPath)));
        done(clipKeys);
      });
    } else {
      completionFilter();
    }
  })
```

I tried using `current == 'get` in the condition, instead of checking for strings in `argv`, but it didn't work. I'm not really sure what you're supposed to do with `current`. The completion filter is used in the docs to literally filter out the defaults, which it accepts as an argument, but that wasn't what I wanted. So, instead I parsed my JSON clips file and passed the keys to `done`.

It works quite nicely. The rest of the setup is the same as for the defaults. Simply run

```bash
./your-script.js completion >> ~/.bashrc
source ~/.bashrc
```

But don't forget to remove your previous completion script from `~/.bashrc` before running them.
