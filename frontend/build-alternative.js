#!/usr/bin/env node

/**
 * Alternative build script that doesn't rely on pnpm
 * This script attempts to build the project using direct node calls
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting alternative build process...');

try {
    // Check if node_modules exists
    if (!fs.existsSync('node_modules')) {
        console.log('📦 Installing dependencies using npm...');
        execSync('npm install', { stdio: 'inherit' });
    }

    // Run TypeScript compiler directly
    console.log('🔧 Running TypeScript compilation...');
    try {
        execSync('npx tsc -b', { stdio: 'inherit' });
    } catch (error) {
        console.log('⚠️  TypeScript compilation had issues, trying alternative...');
        execSync('node_modules/.bin/tsc -b', { stdio: 'inherit' });
    }

    // Run Vite build directly
    console.log('🏗️  Running Vite build...');
    try {
        execSync('npx vite build', { stdio: 'inherit' });
    } catch (error) {
        console.log('⚠️  Vite build had issues, trying alternative...');
        execSync('node_modules/.bin/vite build', { stdio: 'inherit' });
    }

    console.log('✅ Build completed successfully!');
    
    // Check if dist folder was created
    if (fs.existsSync('dist')) {
        console.log('📁 Build output available in ./dist folder');
    }

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}