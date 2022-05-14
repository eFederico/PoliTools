Sources := src
Archive := politools.xpi

.PHONY  : package setup
.DEFAULT: package

setup:
	mkdir bin
	npm ci

package:
	cd $(Sources) && zip -r -FS "../$(Archive)" *;