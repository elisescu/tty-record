APPJS_SOURCES:=$(wildcard frontend/*)

BINDATA_FILES:=$(wildcard bindata/*)

GO_SOURCES:=$(wildcard *.go) bindata.go

WEBPACK_BIN:=node_modules/.bin/webpack

# Don't add the frontend building here. Just build it once, and the add it to git and build it # manually when changing it
all: goscript
	@echo "All done!"

goscript: $(GO_SOURCES)
	go build -o $@

# Specify app.js manually in the list of the files in bindata, so if it is not there, it should be
# generated
bindata.go: $(BINDATA_FILES) bindata/app.js
	go-bindata -o $@ bindata/

$(WEBPACK_BIN): frontend/package.json
	cd ./frontend && npm install

frontend: $(APPJS_SOURCES) $(WEBPACK_BIN)
	cd frontend && $(WEBPACK_BIN)
	@echo "Frontend build done!"

bindata/app.js: frontend/app.js
	cp $^ $@

frontend/app.js:
	@echo "Need to call \"make frontend\""
	@exit 1

run_frontend:
	cd frontend && $(WEBPACK_BIN)-dev-server  --watch --hot

clean:
	rm -fr goscript bindata.go
