---
category: posts
title: A Bash Function for Easy Zipping
author: Kevin Loughead
date: '2023-06-02T23:02:39.714Z'
tags: ['Bash', 'Zip', 'Command Line']
---

I work as a tutor in a software engineering bootcamp, and earlier on in the project students submit their projects, and pass them to us for help, as zip archives. Unzipping an archive at the command line is rather easy.

```plain
unzip foo.zip
```

But zipping is a bit trickier, and I'd always forget the syntax. Plus, what if we want to omit something, like `.git/` or `node_modules/`? I wrote a simple bash function that appears to the job I need it to.

```bash
function zp() {
  # Usage: zp <output_file> <input_directory>
  # Zip all files in <input_directory> except for .git and node_modules, and save the archive to <output_file>.
  local output_file="$1"
  local input_dir="$2"
  zip -r "$output_file" "$input_dir" -x \*.git/* -x \*node_modules/*
}
```

It works well enough, and it saves typing a vowel!
