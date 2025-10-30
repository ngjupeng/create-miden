#!/bin/bash


set -e

echo "Publishing create-miden CLI tool..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "package.json not found. Are you in the right directory?"
  exit 1
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "dist directory not found. Run 'npm run build' first."
  exit 1
fi

# Check if user is logged in to npm
echo "Checking npm authentication..."
if ! npm whoami > /dev/null 2>&1; then
  echo "Not logged in to npm. Please run 'npm login' first."
  exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Ask for version bump type
echo "Choose version bump type:"
echo "1) Patch (1.0.0 -> 1.0.1) - Bug fixes"
echo "2) Minor (1.0.0 -> 1.1.0) - New features"
echo "3) Major (1.0.0 -> 2.0.0) - Breaking changes"
echo "4) Stable (default patch)"
echo "5) Next (default minor)"
read -p "Enter choice (1-5, default: 4): " -n 1 -r
echo

case $REPLY in
  1|"")
    npm run version:patch
    ;;
  2)
    npm run version:minor
    ;;
  3)
    npm run version:major
    ;;
  4)
    npm run version:stable
    ;;
  5)
    npm run version:next
    ;;
  *)
    echo "Invalid choice. Using stable (patch) bump."
    npm run version:stable
    ;;
esac

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "New version: $NEW_VERSION"

# Ask for confirmation
read -p "🤔 Are you sure you want to publish version $NEW_VERSION? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Publishing cancelled."
  exit 1
fi

echo "Building project..."
npm run build

echo "Publishing to npm..."
npm publish

echo "Successfully published create-miden@$NEW_VERSION!"
