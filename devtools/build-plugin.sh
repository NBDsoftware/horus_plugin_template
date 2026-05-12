#!/bin/bash

echo "Building plugin with Bun and packaging..."

# Build frontend using Bun
bun run build

# Remove old package if exists
rm -f hitss.zip

# Package the hitss directory as hitss.zip
zip -r hitss.zip hitss
