#!/bin/bash
# Workaround script to build the project using npm instead of pnpm
# when pnpm has permission issues

echo "Building project using npm as fallback..."

# Remove pnpm-lock.yaml if it exists
if [ -f "pnpm-lock.yaml" ]; then
    rm pnpm-lock.yaml
    echo "Removed pnpm-lock.yaml"
fi

# Install dependencies with npm
npm install

# Run TypeScript build
npx tsc -b

# Run Vite build
npx vite build

echo "Build completed successfully with npm"