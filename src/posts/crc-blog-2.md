---
title: 'A Script to Create React Components. Part 2 of 2'
date: '2021-10-13'
tags: ['Automation', 'React', 'Bash']
---

This is the second part of this post on writing a bash script to automate some
parts of creating React components. In the first part, we left off with a
functioning, but pretty much useless, bash script. Now, let's make it useful.

Recall that our proposed script will take an argument representing the name of
the component. The basics of handling arguments in a bash script are simple
enough. When running a bash script like this

```bash
some-script foo bar etc
```

the three positional parameters — `foo`, `bar` and `etc` — are accessible inside
your script as the variables `$1`, `$2` and `$3`, respectively. We can test this
by changing our script to this:

```bash
#!/bin/bash

echo $1 $2 $3
```

So, we know how to access our parameter. Let's just rename it to `$NAME` to make our code a bit more readable:

So, we know how to access our parameters. Let's just rename it to `$NAME` at the
top of the script to make it a bit more readable.

```bash
#!/bin/bash

NAME=$1
```

Now let's recall what we need to do with this name parameter.

1. Make a directory called `name` inside the current working directory.
2. Create a file `name/styles.css` in the same directory.
3. Create a file called `name/name.js` in that same directory.
4. Add boilerplate for a functional component into that file.

The first two parts is are simple. To create the directory, we simply add one
line to our script:

```bash
#!/bin/bash

NAME=$1
mkdir $NAME
```

Here we are calling the `mkdir` on the value that we have stored in the `$NAME`
variable. Go ahead and try this out with

```bash
crc foo
```

You won't get feedback when running the command (providing you deleted the `echo`
statement from earlier), but you should find a directory called `foo` in your cwd.

Next, we need to create a file. We can do this with the `touch` command. This
creates an empty file with the given name. Of course, you should put this file
inside of the `foo` directory. So add this line to the script[^1]:

```bash
touch $NAME/styles.css
```

Now you should have a file called `styles.css` inside of `foo`. We can create the
JSX file in the same way:

```bash
touch $NAME/$NAME.js
```

The next step is to insert text into this JSX file. Let's create a directory
called `templates` inside the same directory as our script and create a file
called `func-component.js` inside it with the following content:

```js
import React from 'react';

const COMPONENT = () => {
  return <></>;
};

export default COMPONENT;
```

I'm sure there are plenty of other ways of handling this text content, but this
has the benefit of syntax highlighting, which will be great if we need to adjust
it or write additional templates. Note the use of `COMPONENT` here. This is
intended to be replaced by our `$NAME` variable. But first, let's just insert
the text as is. Change your script to match the following:

```bash
NAME=$1
mkdir $
touch $NAME/styles.css
touch $NAME/$NAME.js
cat ~/bin/crc/templates/func-component.js > $NAME/$NAME.js
```

This new line might seem intimidating, but it isn't so bad. To see what it does,
let's run just the first part of the command on the command line:

```plain
cat ~/bin/crc/templates/func-component.js
```

See how the text from the file is printed to the screen? That's what `cat` does,
it outputs the contents of a file[^2]. Next we have that `>` symbol. This is the
redirection operator. It basically says "take the output of the program on the
left and insert it into the file on the right"[^3]. We can try this out by
running the following code at the command line:

```bash
echo "redirect me" > a-file.txt
```

Here, the output of the `echo` program (ie, the text "redirect me") is
redirected into `a-file.txt`. But note that we did not even need to create the
file before redirecting into it! So we can simplify our script a bit already, by
removing the second `touch` command:

```bash
NAME=$1
mkdir $NAME
touch $NAME/styles.css
cat ~/bin/templates/func-component.js > $NAME/$NAME.js
```

Perfect. The last part is to replace the words `COMPONENT` with the value of the
`$NAME` variable. We can do this with the `sed` program. I'll show the line of
code and then explain it:

```bash
sed -i -e 's/COMPONENT/'$NAME'/g' $NAME/$NAME.js
```

Here we are using two flags, `-i` and `-e`. The first one is used for editing
files in place. The second one is used when you are specifying a script for `sed`
to run in the command itself, rather than from a separate file. The first
non-option argument is this script. It is a command of the form

```plain
's/pattern/replace/flags'
```

where `pattern` is a regex that will be replaced by `replace`, another regex,
and `flags` is zero or more regex flags. The final argument is the file in
which we want to run the script.

And that's about all there is to the script. Now we can create the stub of a
React component with a single command: `crc ComponentName`. In a future
installment, In the next installment I'll expand the program to support
styled-components.

<hr />

[^1] If you use the same directory name you will have to delete the `foo`
directory with `rm -rf foo` before running the script again.

[^2] `cat` is short for "concatenate". This program is turning 50 this year,
having [been around](<https://en.wikipedia.org/wiki/Cat_(Unix)>) since the dawn of
Unix. Make sure to wish it a happy birthday.

[^3] This is a simplification, of course. For more details, see
[here](https://tldp.org/LDP/abs/html/io-redirection.html).
