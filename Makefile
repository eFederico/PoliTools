Sources := src
Archive := politools.xpi

.PHONY  : package
.DEFAULT: package

package:
	cd $(Sources) && zip -r -FS "../$(Archive)" *;