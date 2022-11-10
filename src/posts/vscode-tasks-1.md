---
title: 'Automating Tasks in Rails with VS Code'
date: '2022-06-04'
tags: ['Rails', 'Bash', 'Automations', 'VSCode']
---

I've begun working through the new edition of Michael Hartl's excellent [Ruby on Rails Tutorial](https://www.learnenough.com/ruby-on-rails-7th-edition-tutorial) and found that I had to run a number of commands each time I open my repository, so I decided to try to automate them with VSCode tasks. It's worked fairly well, so here are my results. Before starting, I should note that I'm working in WSL2, so adjustments may be necessary to make this work on your system.

VSCode tasks can be defined in `.vscode/tasks.json` in the root of your project directory. My first attempt looked something like this:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Rails server",
      "type": "shell",
      "command": "rails server",
      "group": "none",
      "presentation": {
        "panel": "new",
        "reveal": "always"
      },
      "runOptions": {
        "runOn": "folderOpen"
      }
    }
  ]
}
```

This command runs `rails server` when you open the workspace folder. I also made another task called `"Guard"` that started Guard with `bundle _2.3.14_ exec guard`.

Well, this worked alright, but there was one thing I didn't like. When the task was running it would have a loading icon constantly spinning, which is not pleasant for me. Switching off the animation resolved this.

```json
"terminal.integrated.tabs.enableAnimation": false
```

Next, I wanted to open `localhost:3000` when I open the workspace. And it would be nice to have a way to easily open the deployed site, but that doesn't need to run when the folder opens. I tried out a number of configurations, but eventually wound up with this one.

```json
{
  "version": "2.0.0",
  "presentation": {
    "panel": "new"
  },

  "tasks": [
    {
      "label": "Rails server",
      "type": "shell",
      // open localhost in browser and then runs rails server
      "command": "${workspaceFolder}/.vscode/scripts/start-dev.sh",
      "group": "none",
      "presentation": {
        "reveal": "always"
      },
      "runOptions": {
        "runOn": "folderOpen"
      }
    },
    {
      "label": "Guard",
      "type": "shell",
      "command": "rails test && bundle _2.3.14_ exec guard",
      "group": "none",
      "presentation": {
        "reveal": "always"
      },
      "runOptions": {
        "runOn": "folderOpen"
      }
    },
    {
      "label": "Open prod",
      "type": "shell",
      // open deployed site in browser and assert success
      "command": "${workspaceFolder}/.vscode/scripts/open-prod.sh",
      "group": "none"
    }
  ]
}
```

The scripts are very simple, and could be done inline in `tasks.json`, but I wanted to try both ways.

```bash
#!/bin/bash
# open-prod.sh

explorer.exe <deployed-url>
echo success
```

```bash
#!/bin/bash
# start-dev.sh

explorer.exe http:localhost:3000
rails server
```

There are several things to note about the tasks.

1. You can use the `presentation` object globally
2. To access the current working directory, use `"${workspaceFolder}`
3. The scripts needed the shebang and `chmod u+x script`
4. I use `explorer.exe` to open the URLs in a browser, but this doesn't always behave very well in WSL bash scripts. In this case, the browser opens, but an error is thrown in the task window, unless you do something after running `explorer.exe`. But I assert that there is no error with the line `echo success`, and that makes everyone feel better.
5. I haven't figured out how to make the tasks close automatically, which would be nice for the `open-prod` task. There is a `clear` property of the `presentation` object that is supposed to govern this, but it doesn't work for me.
6. For tasks that don't start automatically, you can run them with `Ctrl + p`, followed by `task task-name`.

And that's it for now. There are definitely improvements that could be made, which I'll look into later.
