package main

import (
	"encoding/base64"
	"fmt"
	"os"
	"text/template"
	"time"
)

type scriptWriter struct {
	outFileName    string
	outputFile     *os.File
	timestampStart time.Time
}

func (w *scriptWriter) WriteData(first bool, data []byte) {
	ts := time.Since(w.timestampStart).Seconds() * 1000
	cm := ","
	if first {
		cm = ""
	}
	fmt.Fprintf(w.outputFile, `%s{
			tp : 1,
			ts:%f,
			dt:"%s"
		}`,
		cm, ts, base64.StdEncoding.EncodeToString(data))
}

func (w *scriptWriter) WriteSize(first bool, size WindowSizeT) {
	ts := time.Since(w.timestampStart).Seconds() * 1000

	cm := ","
	if first {
		cm = ""
	}

	fmt.Fprintf(w.outputFile, `%s{
			tp : 2,
			ts:%f,
			cols:%d,
		    rows:%d
		}`, cm, ts, size.cols, size.rows)

}

func (w *scriptWriter) Begin(size WindowSizeT) error {
	// Read the header
	binFile, err := Asset("templates/output_header.html.in")
	if err != nil {
		return err
	}

	w.outputFile, err = os.Create(w.outFileName)
	if err != nil {
		return err
	}

	w.outputFile.Write(binFile)

	w.timestampStart = time.Now()
	w.WriteSize(true, size)
	return nil
}

func (w *scriptWriter) End() error {
	binFile, err := Asset("templates/output_footer.html.in")

	if err != nil {
		return err
	}

	tempOut := template.New("output")
	tempOut.Parse(string(binFile))

	// Read the rest of the template files
	for _, fileName := range []string{"app.js"} {
		binFile, err = Asset(fileName)
		if err != nil {
			return err
		}
		tempOut.New(fileName).Parse(string(binFile))
	}

	err = tempOut.ExecuteTemplate(w.outputFile, "output", nil)
	if err != nil {
		return err
	}

	return w.outputFile.Close()
}

func (w *scriptWriter) Write(data []byte) (n int, err error) {

	w.WriteData(false, data)
	return len(data), err
}
