---
title: 'Backing Up WSL2'
date: '2022-03-15'
tags: ['WSL', 'Linux', 'Automation', 'Bash', 'Windows']
---

This is the first in a three part series detailing my setup for backing up WSL2 files. I'm sure it's not optimal, but it's been working for me so far.

## The Basic Script

First, I started off by writing a simple bash script, based off of one found in this great article: [Automatic Backups for WSL2](https://stephenreescarter.net/automatic-backups-for-wsl2/#:~:text=Automating%20WSL2%20Backups&text=Using%20the%20Task%20Scheduler%2C%20we,the%20Windows%20Administrative%20Tools%20folder.&text=With%20the%20Task%20Scheduler%2C%20we,backup%20up%20to%20a%20schedule). The core of the script is actually very simple:

```sh
rsync --archive --verbose --delete /home/wsl-username/ /mnt/c/Users/windows-username/wsl2-backup/
```

This script copies the content of my WSL user directory to a folder called `wsl2-backup` inside my Windows user directory. A few notes about the flags:

1. `--archive` is a helpful alias for this set of flags: `-rlptgoD`. Lowers the cognitive load a bit. This does a number of things, like make the copying recursive and preserving symlinks. Refer to the `man` page for details.
2. `--verbose` is not necessary, but being able to see what files are being copied can help you see what's taking up a lot of bandwith and might be uneccassary to backup. More on that below.
3. `--delete` instructs `rsync` to remove all files from the destination if they are not present in
   the source. So it preserves file deletion. Useful if you're overwriting a pre-existing backup.

So I put this one liner in `backup.sh` file on my $PATH and set the destination to be inside my local OneDrive folder.

```sh
#!/bin/bash

rsync --archive --verbose --delete \
  /home/wsl-username/ /mnt/c/Users/windows-username/OneDrive/wsl2-backup/
```

And it was better than nothing.

## Refinements

But since then I've made a number of small refinements.

### Excluding Directories

First, as I mentioned above it became quickly apparent that I was backing things up that I had no desire to back up. For instance, at work[^1] I spend a lot of time assisting students with their web development projects. Often I wind up cloning their repos, and general have a number of them in `~/tutor`. And no need to back up all those `node_modules` either. You can exclude directories with the `--exclude` flag:

```sh
rsync --archive --verbose --delete \
  --exclude 'tutor' \
  --exclude 'node_modules' \
  # ... more excludes
  /home/wsl-username/ /mnt/c/Users/windows-username/OneDrive/wsl2-backup/
```

### Dynamic Backup Directory Names

The next problem was that I was always backing up to the same directory, which is not ideal. What if I want to revert to an earlier backup? Too bad, it's been overwritten. I handled in three steps, shown below and explained in comments:

```sh
# I wanted a directory to store all the backups in
# `-p` suppresses the error if it already exists
mkdir -p /mnt/c/Users/kvnlo/OneDrive/wsl-backups
# Create a variable containing a formatted date string
date=$(date '+%m-%d-%Y-h%Hm%M')
rsync --archive --verbose --delete \
  --exclude 'tutor' \
  --exclude 'node_modules' \
  # ... more excludes
  /home/wsl-username/ \
  # Create a unique dirname out of WSL distro name and time stamp
  # $WSL_DISTRO_NAME is an environmental variable representing current distro
  /mnt/c/Users/windows-username/OneDrive/wsl-backups/$WSL_DISTRO_NAME-$date/
```

And this is the the script that I'm using now. Here it is without the comments.

```sh
mkdir -p /mnt/c/Users/kvnlo/OneDrive/wsl-backups
date=$(date '+%m-%d-%Y-h%Hm%M')
rsync --archive --verbose --delete \
  --exclude 'tutor' \
  --exclude 'node_modules' \
  # ... more excludes
  /home/wsl-username/ \
  /mnt/c/Users/windows-username/OneDrive/wsl-backups/$WSL_DISTRO_NAME-$date/
```

But there was still a pretty major issue — I had to rememember to run it. In the next post I'll explain how I set it up to run automatically.

[^1] I work at the [Practicum](https://practicum.yandex.com/) Software Engineer bootcamp.
