# TTY-RECORD


`tty-record` is a tool that records a terminal session (well, any command you run it with) and saves the output in a self contained html file that can be run in the browser.

It is based on [asciinema-player](https://github.com/asciinema/asciinema-player) to playback the recorded session.

See also [tty-share](https://github.com/elisescu/tty-share) for sharing a terminal session.


## Demo


![demo](https://github.com/elisescu/tty-record-demo/raw/master/demo-short.gif)

You can see how the corresponding html file here: [recording.html](https://github.com/elisescu/tty-record-demo/raw/master/recording.html)

## Build & Run


If you want to make changes to the frontend (any files under `./frontend/`), install the node
modules:
```bash
git clone https://github.com/elisescu/tty-record.git
cd tty-record

make get-go-bindata && make
go run .
```

## Similar projects

Some similar projects and how `tty-record` relates to them:

* `script` - the linux command part of `util-linux` package and which records the terminal session
  in a file. This is tool is available on most of Linux distributions and on OSX. The saved
  "typescript" can be played back with the same tool and only in the terminal.
* [asciinema](https://asciinema.org/) - a nice tool that records your terminal session and it uploads
  it to the asciinema server where it can be played back. The recorded session can also be played back
  locally in the terminal by the same tool. However, you need to install the tool to play it,
  so if you want to share the recorded session you will have to upload it  on the server, or the
  other person  will have to install the tool to play it back.

## Other resources

* [Ansi escape sequences](http://ascii-table.com/ansi-escape-sequences-vt-100.php)
* [VT100 1](https://vt100.net/docs/vt100-ug/chapter3.html)
* [VT100 2](http://www.termsys.demon.co.uk/vtansi.htm)

## License

* Files: asciinema-player.css
         asciinema-player.min.js

Copyright: 2011-2024 Marcin Kulik

Comment: these files were extracted from

https://github.com/asciinema/asciinema-player/releases/download/v3.6.3/asciinema-player.css

https://github.com/asciinema/asciinema-player/releases/download/v3.6.3/asciinema-player.min.js

License: Apache-2.0

* Files: *

Copyright: 2017-2024 Elis Popescu <elisescu@elisescu.com>

License: MIT
