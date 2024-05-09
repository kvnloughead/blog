---
title: "Hot reload for a Go app using Air and Makefile"
category: posts
author: Kevin Loughead
date: "2024-05-09T13:40:55.124Z"
tags: ["golang", "air", "Makefile"]
---

I've been learning Go via Alex Edwards' excellent books, <a href="https://lets-go.alexedwards.net/">Let's Go</a> and <a href="https://lets-go-further.alexedwards.net/">Let's Go Further</a>. It's been an enjoyable experience so far, and in some ways the development experience is nicer than what I'm accustomed to coming from JavaScript-world. But one thing that I missed was having the server automatically restart on changes to the source code, which is built-in to frontend tools like Vite or Live Server, and trivial to set up on the backend with nodemon.

I have found setting it up in a Go app to be rather more difficult, but I've managed to work something out. I'm making use of the [Air](https://github.com/cosmtrek/air) module, which you can install globally with

```plain
go install github.com/cosmtrek/air@latest
```

Then put an `.air.toml` file in your project's root with the following content:

```toml
root = "."
tmp_dir = "tmp"

[build]
  cmd = "go build -o ./tmp/main ./cmd/web && chmod +x ./tmp/main"
  bin = "./tmp/main -db-dsn=${YOUR_DB_DSN} -port=${PORT}"
  include_ext = ["go", "tmpl", "html", "css", "js"]
  exclude_dir = ["assets", "tmp"]

[log]
  time_format = "15:04:05"
  log_file = "air.log"

[color]
  main = "yellow"
  watcher = "cyan"
  build = "green"
  runner = "magenta"
```

Full disclosure: this is mostly provided by ChatGPT, with a few suitable modifications. Adjust the `include_ext` and `exclude_dir` fields to suit the needs of your project. A few notes:

- `cmd` is the command that builds the binary, saves it as `./tmp/main`, makes it executable with `chmod`, then runs it
- `bin` is the command that runs the binary. Adjust the flags as needed (if needed). More on this soon.

Now, I'm sure there is a way that you can run this command successfully by supplying flags. For example:

```plain
air -- -db-dsn=your-dsn-string -port=4000
```

But I ran in to issues with escaping my dsn and I don't feel like figuring them out. But I got it to work as follows. I already had a Makefile like this:

```makefile
include .envrc

## run/web: run the cmd/web application
.PHONY: run/web
run/web:
	@go run ./cmd/web -db-dsn=${CONTACTS_DB_DSN} -port=4000
```

For this to work, I have a gitignored `.envrc` file, like so:

```plain
CONTACTS_DB_DSN=my-dsn-string
PORT=4000
```

So I added the following:

```makefile
## run/air: run server using air for live reloading
.PHONY: run/air
run/air:
	@export CONTACTS_DB_DSN=$(CONTACTS_DB_DSN) && export PORT=$(PORT) && air
```

And now I can run my app with

```plain
make run/air
```

Great! There is one smallish issue: all this does is restart the server, it doesn't automatically refresh the browser. To implement this I believe I need to use some client-side JavaScript that uses WebSockets to listen for a reload signal sent by my Go application. Might be an interesting project for a later day.
