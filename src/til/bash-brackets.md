---
category: til
author: Kevin Loughead
date: '2023-07-01T18:29:11.480Z'
---

A common construct an bash scripts is an `if` block like so:

```bash
if [ -z "$STRING" ]; then
  echo "Length of string is zero"
fi
```

The syntax seems similar to what you find in many other languages. For example

```javascript
if (string.length) {
  console.log('Length of string is zero');
}
```

But if you've tried using a bash `if` block, you may have noticed that you'll get an error if you omit the space between the brackets and their content:

```bash
if [-z "$STRING" ]; then
  echo "Length of string is zero"
fi
[-z: command not found
```

This seemed like Bash was just being a bit picky about the formatting here. But today I learned this isn't so.

In fact, `[` is essentially just an alias for the `test` command: it's not just for grouping things. So, when you run

```bash
[-z "$STRING" ]
```

you are actually running

```bash
test-z "$STRING"
```

And of course, `test-z` is not a command, so it produces an error.
