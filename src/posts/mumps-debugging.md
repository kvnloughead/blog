---
title: 'A Case of the MUMPS'
date: '2022-02-14'
tags: ['Debugging', 'Obscure Languages', 'Mumps']
---

The other day I learned a tiny bit about a programming language called MUMPS. To start with, I learned that there is a programming language and database called MUMPS. It stands for "Massachusetts General Hospital Utility Multi-Programming System" and apparently has a [history](https://en.wikipedia.org/wiki/MUMPS) stretching back to before the dawn of C, having been originally developed at Massachuset's General Hospital in 1966 and 1967. But MUMPS isn't just a historical curiosity — it's still powering multiple major electronic health record systems.[^1]

I learned about MUMPS in the usual way — someone [posting a question](https://www.reddit.com/r/learnprogramming/comments/sptqse/mumps_help_rounding/) about it on r/learnprogramming. The OP works in healthcare and was getting unexpected results from the justify function, which they were using like this `$J(%X, 3, 0)`. They expected a whole number result, or possibly a float with a single digit of precision. But they were getting the result with some padding on it. I'm assuming it looked like this `"   num"`. Well, my initial inclination was to suppose that the second argument referred to padding, and suggest changing it to `$J(%X, 0, 0)` for a whole number, or `$J(%X, 0, 1)`. For a float with one significant digit. This would coincide with some pretty standard usage in some other languages I know of:

```c
// prints some_float with minimum with 3 and precision 1
printf("%f3.1", some_float)
```

And indeed, the OP mentioned this as a possible solution. But I decided to take the educated guesswork out of the equation and do the right thing — read the docs. And in fact it was quite easy to find the [relevant documentation](http://mumps.sourceforge.net/docs.html#DJUSTIFY), and rather easy to read the documentation too:

```plain
Func:   $J[USTIFY]
Form:   $J(expr,int1[,int2])
Retn:   expr space padded on the left to a length of int1 characters.
        If int2 is specified, expr is first rounded to int2 decimal places.
Std:    Complies exactly
Eg:     $J("ABC",5) -> "  ABC"
        $J(.456,6,2) -> "  0.46"
```

Thus having established the accuracy of my guess, I returned to Reddit bearing the fruits of my research — and of course, citing my sources.

[^1] Until recently including the US's Veteran's Administration (VA). [source](https://hspeakers.com/h-speakers-blog/2019/9/19/ehrs-have-the-mumps)]
