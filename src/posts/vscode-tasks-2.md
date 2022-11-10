---
title: 'Automating Node Tasks with VS Code'
date: '2022-11-09'
tags: ['Node', 'Npm', 'Automations', 'VSCode', 'MongoDB']
---

[Last time](https://kevinloughead.com/blog/vscode-tasks-1/) I wrote about my experiences automating startup tasks for a Rails app in VS Code. Lately I've been working on a fullstack MERN application and decided to automate some tasks on the backend.

The app is in a single repo, with this structure:

```plain
root/
  frontend/
  backend/
```

I tried adding `.vscode/tasks.json` to the backend subdirectory, but the tasks failed to run. Perhaps there's a workaround for that, I'm not sure. To get the tasks to run took a bit of effort. Here's my current version, which simply runs `mongod` and the Express server:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "mongod",
      "type": "process",
      "command": "mongod",
      "runOptions": {
        "runOn": "folderOpen"
      },
      "presentation": {
        "reveal": "never"
      },
      "isBackground": true
    },

    {
      "label": "start backend server",
      "type": "shell",
      "command": "npm run dev",
      "runOptions": {
        "runOn": "folderOpen"
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "options": {
        "cwd": "${workspaceFolder}/backend"
      },
      "isBackground": true
    }
  ]
}
```

And it works pretty well. The `mongod` process runs in a tab that is not immediately visible, and the server runs in a visible terminal tab.

<img src="/images/posts/vscode-tasks-2.png" 
     alt="VS Code integrated terminal with an Express server running." />

A few things to note:

- The `isBackground` property is another way to solve the the annoying ever-spinning indicator issue I mentioned in the [previous article](https://kevinloughead.com/blog/vscode-tasks-1/)
- `"cwd": "${workspaceFolder}/backend"` indicates the directory to run the task in
- I am not really sure how the `"presentation"` object works, but I'm satisfied with the current behavior so I won't mess with it.
