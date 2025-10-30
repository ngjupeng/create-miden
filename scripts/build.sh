#!/bin/bash

set -e

echo "Building create-miden CLI tool..."

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.cache/

# Install dependencies
echo "Installing dependencies..."
npm install

# Run linting
echo "Running linter..."
npm run lint

# Build TypeScript
echo "Building TypeScript..."
npm run build

# Verify build
echo "Verifying build..."
if [ ! -d "dist" ]; then
  echo "Build failed - dist directory not found"
  exit 1
fi

if [ ! -f "dist/index.js" ]; then
  echo "Build failed - dist/index.js not found"
  exit 1
fi

echo "Build completed successfully!"
echo "Output directory: dist/"
echo "Ready for publishing!"
