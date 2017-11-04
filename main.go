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

func main() {
	commandName := flag.String("command", "bash", "The command to run")
	commandArgs := flag.String("args", "", "The command arguments")
	outputName := flag.String("output", "typescript.html", "The name of the html output file to write")
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

	go func() {
		for {
			select {
			case <-winChangedSig:
				{
					w, h, err := terminal.GetSize(0)
					if err != nil {
						log.Printf("Can't get window size: %s", err.Error())
						return
					}
					pty.Setsize(ptyMaster, h, w)
					scriptWriter.WriteSize(false, winSize{cols: w, rows: h})
				}
			}
		}
	}()

	w, h, err := terminal.GetSize(0)
	pty.Setsize(ptyMaster, h, w)

	err = scriptWriter.Begin(winSize{cols: w, rows: h})
	if err != nil {
		log.Fatalf("Cannot create output. Error: %s", err.Error())
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
