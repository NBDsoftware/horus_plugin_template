#!/bin/bash

echo "Building plugin with Bun and packaging..."

# Build frontend using Bun
bun run build

# Remove old package if exists
rm -f my_plugin.zip

# Package the my_plugin directory as my_plugin.zip
zip -r my_plugin.zip my_plugin
