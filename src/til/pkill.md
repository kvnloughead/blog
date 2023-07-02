---
category: til
author: Kevin Loughead
date: '2023-06-09T23:41:50.892Z'
---

To kill a process by name, rather than job number or PID, you can use `pkill`. For example, this will kill all open VSCode instances.

```plain
pkill code
```

Today I accidentally turned on the Redshift program, and it was flickering annoyingly. I started to look for a solution online, but then remembered:

```plain
pkill redshift
```

Problem solved. Use this power wisely.
