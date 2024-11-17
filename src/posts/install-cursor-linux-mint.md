---
title: "Installing Cursor on Linux Mint"
category: posts
author: Kevin Loughead
date: "2024-11-12T23:00:50.591Z"
tags: ["Linux"]
---

I wanted to try out [Cursor](https://www.cursor.com/) so tonight I downloaded the app image. I had never installed from an app image before and it took me a few tries to get it right. This post specifically explains how to install Cursor on Linux Mint, but I assume you could use it to install from other app images.

## Install Cursor on Linux Mint

1. Download the app image from the website
2. Install dependencies

   ```plain
   sudo apt-get install libfuse2
   ```

3. Make it executable

   ```plain
   cd ~/Downloads
   chmod +x cursor-*.AppImage
   ```

   Replace `cursor-*.AppImage` with the actual file name.

4. Move the executable to a permanent location

   ```plain
   sudo mv cursor-*.AppImage /opt/cursor.appimage
   ```

At this point you should be able to run cursor with `/opt/cursor.appimage`. If not, try starting a new terminal session.

## Setting up a menu option

If you want to set up an entry for this in your start menu, you can do the following.

1. Create a `.desktop` file

   ```plain
   sudo nano /usr/share/applications/cursor.desktop
   ```

2. Add these contents

   ```plain
   [Desktop Entry]
   Name=Cursor
   Exec=/opt/cursor.appimage
   Icon=/opt/cursor.png
   Type=Application
   Categories=Development;
   ```

   Save and exit with `Ctrl + X` then `Ctrl + Y`.

3. Retrieve the icon from the AppImage

   ```plain
   cd /opt
   sudo ./cursor.appimage --appimage-extract
   ```

   This creates a directory `squashfs-root`. Grab the icon it contains with

   ```plain
   mv squashfs-root/cursor.png .
   ```

   Then delete the `squashfs-root` directory.

4. Run `sudo update-desktop-database`.
