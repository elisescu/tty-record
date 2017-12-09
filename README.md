Goscript
========

Goscript is a tool that records the terminal session (well, any command you run it with) and saves
the output in a self contained html file that can be run in the browser, to playback the session.

It is based on [xterm.js](https://xtermjs.org/) project, with some hacks to disable the selection
manager.

The project is just a toy and is by far complete or without issues.

Demo
====

![demo](https://github.com/elisescu/goscript-demo/raw/master/demo-short.gif)

A demo video of a recorded session can be found [here](https://www.youtube.com/watch?v=Nnvs5C746U0)
and its corresponding [typescript.html](https://github.com/elisescu/goscript-demo/raw/master/typescript.html)

Build
=====

If you want to make changes to the frontend (any files under `./frontend/`), install the node
modules:
```
cd goscript/frontend/
npm install
```
Build:
```
cd goscript
make
```

Similar projects
================

Bellow I'm listing some similar projects that I know of, and how `goscript` relates to them.

* `script` - the linux command part of `util-linux` package and which records the terminal session
  in a file. This is tool is available on most of Linux distributions and on OSX as well. The saved
  typescript can be played back with the same tool and only in the terminal.
* [asciinema](https://asciinema.org/) - a nice tool that records your terminal session and it uploads
  it to the asciinema server, where it can be played back. The record can also be played back locally
  in the terminal, by the same tool. However, one needs to install the tool to play them back
  locally, so if you want to share the recoreded session with somebody you will have to upload it
  on the server, or they will have to install the tool, in order to play it back.

Resources
=========
* [Ansi escape sequences](http://ascii-table.com/ansi-escape-sequences-vt-100.php)
* [VT100 1](https://vt100.net/docs/vt100-ug/chapter3.html)
* [VT100 2](http://www.termsys.demon.co.uk/vtansi.htm)
