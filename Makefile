# Directories.
SRC := "src"
BIN := "bin"

Version  := $(shell grep -Po "(?<=\"version\"\: \")[\.0-9]*" src/manifest.json)
WebExt   := $(shell echo "$$(npm bin)/web-ext")
Homepage := "https://didattica.polito.it/pls/portal30/sviluppo.pagina_studente_2016.main"

.PHONY  : run lint package clean
.DEFAULT: package

# Install the required NodeJS modules for WebExt.
node_modules: package-lock.json package.json
	@npm ci

# Create the build artifacts directory.
bin:
	@mkdir ${BIN}

# Run the extension in a test instance of FireFox.
# If you are using VS Code this should be run on startup.
run: node_modules bin
	@${WebExt} run -s ${SRC} -a ${BIN} -u ${Homepage} --verbose

# Run the web-ext linter on the extension.
lint: node_modules bin
	@${WebExt} lint -s ${SRC} -a ${BIN} -o json --no-config-discovery | python util/convert.py

# Create an XPI package of the extension sources to submit to Mozilla.
# If you are using VS Code you can run this with CTRL+SHIFT+B.
package: node_modules bin
	rm bin/politools-release-${Version}.xpi 2>/dev/null || true
	@${WebExt} build -s ${SRC} -a ${BIN} -n "politools-release-${Version}.xpi"

# Remove all build artifacts.
clean:
	@rm -rf bin