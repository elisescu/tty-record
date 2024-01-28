package main

import (
	"fmt"
	"os"
	"text/template"
	"time"
	"unicode/utf8"
)

type scriptWriter struct {
	outFileName    string
	outputFile     *os.File
	timestampStart time.Time
}

func escapeNonPrintableChars(data []byte) string {
	result := ""
	for i := 0; i < len(data); {
		r, size := utf8.DecodeRune(data[i:])
		if r == utf8.RuneError && size == 1 {
			// Handle non-printable characters
			result += fmt.Sprintf("\\u%04X", data[i])
			i++
		} else {
			// Escape special JSON characters
			if r == '"' {
				result += "\\\""
			} else if r == '\\' {
				result += "\\\\"
			} else if r < ' ' {
				// Handle other non-printable characters
				result += fmt.Sprintf("\\u%04X", r)
			} else {
				result += string(r)
			}
			i += size
		}
	}
	return result
}

func (w *scriptWriter) WriteData(data []byte) {
	timestamp := time.Since(w.timestampStart).Seconds()

	// https://docs.asciinema.org/manual/asciicast/v2/
	fmt.Fprintf(w.outputFile, `,[
			%f,
			"o",
			"%s"
		]`, timestamp, escapeNonPrintableChars(data))
}

func (w *scriptWriter) WriteSize(size WindowSizeT) {
	ts := time.Since(w.timestampStart).Seconds()

	// https://docs.asciinema.org/manual/asciicast/v2/
	fmt.Fprintf(w.outputFile, `,[
		%f,
		"r",
		"%dx%d"
	]`, ts, size.cols, size.rows)
}

func (w *scriptWriter) Begin(size WindowSizeT) error {
	// Read the header
	binFile, err := Asset("templates/output_header.html.in")
	if err != nil {
		panic(err.Error())
	}

	w.outputFile, err = os.Create(w.outFileName)
	if err != nil {
		panic(err.Error())
	}

	w.outputFile.Write(binFile)

	w.timestampStart = time.Now()

	fmt.Fprintf(w.outputFile, `{
		version: 2,
		width:%d,
		height:%d
	}`, size.cols, size.rows)

	return nil
}

func (w *scriptWriter) End() error {
	binFile, err := Asset("templates/output_footer.html.in")

	if err != nil {
		panic(err.Error())
	}

	tempOut := template.New("output")
	tempOut.Parse(string(binFile))

	// Read the rest of the template files
	for _, fileName := range []string{"asciinema-player.min.js", "asciinema-player.css"} {
		binFile, err = Asset(fileName)
		if err != nil {
			panic(err.Error())
		}
		tempOut.New(fileName).Parse(string(binFile))
	}

	err = tempOut.ExecuteTemplate(w.outputFile, "output", nil)
	if err != nil {
		panic(err.Error())
	}

	return w.outputFile.Close()
}

func (w *scriptWriter) Write(data []byte) (n int, err error) {

	w.WriteData(data)
	return len(data), err
}
