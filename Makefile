OUTPUT_NAME:=tty-record
BINDATA_FILES:=$(wildcard templates/*) asciinema-player.min.js  asciinema-player.css
GO_SOURCES:=$(wildcard *.go) bindata.go

all: $(OUTPUT_NAME)
	@echo "All done!"

$(OUTPUT_NAME): $(GO_SOURCES)
	go build -o $@

bindata.go: $(BINDATA_FILES)
	go-bindata -o $@ $^

asciinema-player.min.js:
	curl -L -o  $@ https://github.com/asciinema/asciinema-player/releases/download/v3.6.3/asciinema-player.min.js

asciinema-player.css:
	curl -L -o  $@ https://github.com/asciinema/asciinema-player/releases/download/v3.6.3/asciinema-player.css

clean:
	rm -fr $(OUTPUT_NAME) bindata.go asciinema-*

get-go-bindata:
	go install github.com/go-bindata/go-bindata/...@latest