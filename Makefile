APPJS_SOURCES:=$(filter-out frontend/app.js, $(wildcard frontend/*))
BINDATA_FILES:=$(wildcard frontend/templates/*) frontend/app.js
GO_SOURCES:=$(wildcard *.go) bindata.go
WEBPACK_BIN:=node_modules/.bin/webpack

# Don't add the frontend building here. Just build it once, and the add it to git and build it # manually when changing it
all: goscript
	@echo "All done!"

goscript: $(GO_SOURCES)
	go build -o $@

# Specify app.js manually in the list of the files in bindata, so if it is not there, it should be
# generated
bindata.go: $(BINDATA_FILES)
	go-bindata --prefix frontend -o $@ $^

frontend/app.js: $(APPJS_SOURCES)
	cd frontend && $(WEBPACK_BIN)
	@echo "Frontend build done!"

run_frontend:
	cd frontend && $(WEBPACK_BIN)-dev-server  --watch --hot

clean:
	rm -fr goscript bindata.go frontend/app.js
