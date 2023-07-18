---
category: posts
author: Kevin Loughead
date: '2023-07-17T21:18:18.437Z'
---

Lately I've been working on my CLI note-taking application called [min](https://github.com/kvnloughead/min). It's written with Deno and Cliffy. It's taken me a bit of time to get autocompletion working reasonably well, so I thought I'd write up some of the things I've learned.

First, to enable the completions you can add a line like this to your `~/.bashrc`:

```
source <(COMMAND completions bash)
```

replacing `COMMAND` with the name of your program's executable. Then don't forget to `source ~/.bashrc`. Implementing the completions looks something like this:

```ts
import {
  Command,
  CompletionsCommand,
} from 'https://deno.land/x/cliffy@v0.25.7/command/mod.ts';

const program = new Command();
program
  .name('command-name')
  .globalComplete('completion-name', async () => {
    // return an array of possible completions
    return [];
  })
  // an example subcommand that accepts an argument.
  // specify the completion's name in the string that specifies the arguments
  .command('example, e <arg>', 'Does something to <arg>.')
  .arguments('<arg:string:completion-name>');

// register the completions before parsing the args
await program.command('completions', new CompletionsCommand()).parse(Deno.args);
```

One part that has tripped me up quite a bit is dealing with subcommand aliases. Note that order in which I'm specifying them: `example, e`. If I specify them the other way, it won't work as expected. Running `command-name e ...` will provide appropriate completions. But running `command-name edit ...` will not provide any completions. Reversing the order seems to resolve the issue.
