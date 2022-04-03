---
title: 'Backing Up WSL2'
date: '2022-03-17'
tags: ['WSL', 'Linux', 'Automation', 'Bash', 'Windows']
---

[Last time](https://todo-name-blog.vercel.app/posts/wsl-backup), I automated my backup script with a cron job, but realized it still wasn't automated enough. So I had to automate the automation. Well, that's what I started doing, at least. Then I did something easier.

## Starting the cron service with Windows Task Scheduler

Following this [how to](https://www.howtogeek.com/746532/how-to-launch-cron-automatically-in-wsl-on-windows-10-and-11/) I scheduled a task to automatically start my cron service whenever I rebooted the PC. The steps for this were as follows:

  1. Open `sudoers` file with `sudo visudo`
  2. Enter this at the bottom of that file to disable passwords for   starting cron service: `%sudo ALL=NOPASSWD: /usr/sbin/service cron  start`
  3. Go to Windows task scheduler
  4. Set up basic task to run when computer starts

Refer to the how to for the specifics of step 4. The main parts of interest here are setting the program/script for the task to run as `C:\Windows\System32\wsl.exe`, and then passing the command to start the service as an argument:

```plain-text
sudo /usr/sbin/service cron start
```

Note that an absolute file path to `service` is provided. I assume this is necessary because Windows isn't aware of your WSL path.

Well, this worked nicely. I could reboot my device, and my cron job would start automatically. But I still wasn't sure whether this would be sufficient. Would the job still run if the computer was asleep? I'm not sure, actually. But I was sure that it wouldn't run if the computer was off during the cron jobs scheduled time.

## Making sure tasks don't get missed

I knew that there was a tool for this called [anacron](https://opensource.com/article/21/2/linux-automation), and maybe at a later date I will use that. But I realized I could solve the problem with the tools I had at hand: i.e., Windows Task Scheduler, WSL2 and my backup script. All I needed to do was create a new task that would run `/path/to/backup.sh` once a day, at the time of my choosing. That's it, nothing too fancy. Windows will ensure that if the computer is inoperable at the specified time, the task will be run at the next opportunity.

So there we have it. A way to automatically back up your WSL files that is definitely better than nothing.
