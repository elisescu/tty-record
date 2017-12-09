package main

import (
	"flag"
	"fmt"
	"github.com/elisescu/pty"
	"golang.org/x/crypto/ssh/terminal"
	"io"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"strings"
	"syscall"
)

type winSize struct {
	rows, cols int
}

func clamp(min, max, val int) int {
	if val < min {
		return min
	}
	if val > max {
		return max
	}
	return val
}

func main() {
	commandName := flag.String("command", "bash", "The command to run")
	commandArgs := flag.String("args", "", "The command arguments")
	outputName := flag.String("output", "typescript.html", "The name of the html output file to write")
	maxWindowSize := flag.String("max-win-size", "200x50", "The maximum window size for the terminal (columns x rows). Ex: 150x40")
	flag.Parse()

	winChangedSig := make(chan os.Signal, 1)
	signal.Notify(winChangedSig, syscall.SIGWINCH)

	scriptWriter := &scriptWriter{
		outFileName: *outputName,
	}
	fmt.Printf("Script started, output file is %s\n\n\r", *outputName)

	oldState, err := terminal.MakeRaw(0)
	defer terminal.Restore(0, oldState)

	c := exec.Command(*commandName, strings.Fields(*commandArgs)...)

	ptyMaster, err := pty.Start(c)
	if err != nil {
		fmt.Printf("Cannot start the command: %s\n\r", err.Error())
		return
	}

	maxCols := -1
	maxRows := -1
	if maxWindowSize != nil {
		_, err := fmt.Sscanf(*maxWindowSize, "%dx%d", &maxCols, &maxRows)

		if err != nil {
			fmt.Printf("Cannot parse <%s> for maximum window size", *maxWindowSize)
			return
		}
	}

	setSetTerminalSize := func(writeEvent bool) (cols, rows int) {
		cols, rows, err := terminal.GetSize(0)
		if err != nil {
			log.Printf("Can't get window size: %s", err.Error())
			return
		}

		if maxWindowSize != nil {
			if maxCols != -1 && maxRows != -1 {
				rows = clamp(1, maxRows, rows)
				cols = clamp(1, maxCols, cols)
			}
		}

		pty.Setsize(ptyMaster, rows, cols)
		if writeEvent {
			scriptWriter.WriteSize(false, winSize{cols: cols, rows: rows})
		}
		return
	}

	go func() {
		for {
			select {
			case <-winChangedSig:
				setSetTerminalSize(true)
			}
		}
	}()

	cols, rows := setSetTerminalSize(false)
	err = scriptWriter.Begin(winSize{cols: cols, rows: rows})
	if err != nil {
		fmt.Printf("Cannot create output. Error: %s", err.Error())
		return
	}

	allWriter := io.MultiWriter(os.Stdout, scriptWriter)

	go func() {
		io.Copy(allWriter, ptyMaster)
	}()

	go func() {
		io.Copy(ptyMaster, os.Stdin)
	}()
	c.Wait()

	scriptWriter.End()
	fmt.Printf("\nScript done! output file is %s\n\r", *outputName)
}
