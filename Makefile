BINDATA="./bindata"
BINFILES=$(wildcard $(BINDATA)/*)
SOURCES=$(wildcard *.go) bindata.go

all: goscript
	@echo "All done!"

goscript: $(SOURCES)
	go build -o $@

bindata.go: $(BINFILES)
	go-bindata -o $@ $(BINDATA)

clean:
	rm -fr goscript bindata.go
