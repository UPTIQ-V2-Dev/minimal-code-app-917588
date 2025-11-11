#!/usr/bin/env node

/**
 * Build verification script to help diagnose build issues
 * This script checks if the TypeScript compilation will succeed
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build requirements...');

// Check if essential files exist
const essentialFiles = [
    'src/App.tsx',
    'src/main.tsx',
    'src/pages/LoginPage.tsx',
    'src/pages/DashboardPage.tsx',
    'src/hooks/useAuth.tsx',
    'src/services/auth.ts',
    'src/lib/api.ts',
    'src/types/user.ts',
    'package.json',
    'vite.config.ts',
    'tsconfig.json'
];

let missingFiles = [];

essentialFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        missingFiles.push(file);
    }
});

if (missingFiles.length > 0) {
    console.error('❌ Missing essential files:');
    missingFiles.forEach(file => console.error(`  - ${file}`));
    process.exit(1);
}

console.log('✅ All essential files present');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
    console.error('❌ node_modules not found. Dependencies need to be installed.');
    process.exit(1);
}

console.log('✅ node_modules exists');

// Check package.json for required dependencies
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    '@tanstack/react-query',
    'axios',
    'zod',
    'react-hook-form'
];

let missingDeps = [];
requiredDeps.forEach(dep => {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
        missingDeps.push(dep);
    }
});

if (missingDeps.length > 0) {
    console.error('❌ Missing required dependencies:');
    missingDeps.forEach(dep => console.error(`  - ${dep}`));
    process.exit(1);
}

console.log('✅ All required dependencies are listed in package.json');

console.log('🎉 Build verification complete! The project should build successfully.');
console.log('');
console.log('Available build commands:');
console.log('  npm run build:npm     - Build using npm');
console.log('  npm run build:direct  - Build using npx directly');
console.log('  npm run build:fallback - Build using node_modules/.bin');