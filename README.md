# PoliTools for FireFox

## Building the extension
```bash
# Get into the same directory of the extension
cd PoliTools

# Checkout the correct branch
git checkout firefox

# Create the ZIP with all the required files
zip -r -FS politools.xpi docs fonts immagini lib popup scripts themes manifest.json background.html background.js style.css
```