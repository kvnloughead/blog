---
title: 'Backing Up WSL2 part 2 of 3'
date: '2022-03-16'
tags: ['WSL', 'Linux', 'Automation', 'Bash', 'Windows']
---

In my [previous entry](https://todo-name-blog.vercel.app/posts/wsl-backup-1), I detailed a simple Bash script I wrote to backup my WSL files. I noted that there was still one major problem with the setup — it wasn't automated. This post explains how I resolved that.

My first attempt involved writing a cronjob. I'll summarize that attempt here.

## How to set up a cronjob on Linux [^1]

First, run `crontab -e` to open the cronjob editor. You may have to choose a command line editor if you don't have your default set. Nano is probably the easiest choice. This will open a file that looks something like this:

```plain
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command
```

These comments are useful. But even more useful is this [diagram from ostechnix](https://ostechnix.com/a-beginners-guide-to-cron-jobs/):

```plain
# |-------------- min (0 - 59)
# | |--------------- hour (0 - 23)
# | | |---------------- day of month (1 - 31)
# | | | |----------------- month (1 - 12)
# | | | | |------------------ day of week (0 - 6)
# | | | | |              [Sunday to Saturday; names also work; 7 is also Sunday]
# | | | | |
# * * * * *  command to exeute (* is a wildcard)
```

I recommend adding it to the file that opens with `crontab -e` for easy reference. So, say you want to run your backup script every day at 20:30. You would write

```plain
30 20 * * * path/to/backup.sh
```

This means that the backup script will be run every day at 20:30. Nice, right?

But there was _still_ a problem, since on WSL2, the cron service [does not start automatically](https://www.howtogeek.com/746532/how-to-launch-cron-automatically-in-wsl-on-windows-10-and-11/). Instead, you have to start it with

```bash
sudo service cron start
```

After that, the cron jobs will be executed at the designated times... unless the computer is asleep, or we forgot to start the service again after rebooting. So, we're still not done yet. In the next post, I'll share a solution to this new problem.

[^1] [Source](https://www.howtogeek.com/101288/how-to-schedule-tasks-on-linux-an-introduction-to-crontab-files/)
