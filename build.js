#!/usr/bin/env node

// Build script for Call of Duty Hardpoint Simulator
// This script replaces configuration values at build time

const fs = require('fs');
const path = require('path');

// Configuration values (must be set via environment variables)
const config = {
    APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID
};

if (!config.APPWRITE_PROJECT_ID) {
    throw new Error('Missing Appwrite Project ID: Please set APPWRITE_PROJECT_ID as an environment variable.');
}
if (!config.APPWRITE_ENDPOINT) {
    throw new Error('Missing Appwrite Endpoint: Please set APPWRITE_ENDPOINT as an environment variable.');
}

function replaceConfigInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Replace hardcoded Appwrite configuration in league.js
        if (filePath.endsWith('league.js')) {
            const endpointRegex = /\.setEndpoint\('([^']+)'\)/;
            const projectRegex = /\.setProject\('([^']+)'\)/;
            
            if (endpointRegex.test(content)) {
                content = content.replace(endpointRegex, `.setEndpoint('${config.APPWRITE_ENDPOINT}')`);
                modified = true;
            }
            
            if (projectRegex.test(content)) {
                content = content.replace(projectRegex, `.setProject('${config.APPWRITE_PROJECT_ID}')`);
                modified = true;
            }
        }
        
        // Replace configuration object in config.js
        if (filePath.endsWith('config.js')) {
            const fallbackRegex = /'68639c810030f7f67bab' \/\/ Build-time configured ID/;
            if (fallbackRegex.test(content)) {
                content = content.replace(fallbackRegex, `'${config.APPWRITE_PROJECT_ID}' // Build-time configured ID`);
                modified = true;
            }
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated configuration in ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

function main() {
    console.log('🔧 Building with configuration...');
    console.log(`📡 Endpoint: ${config.APPWRITE_ENDPOINT}`);
    console.log(`🆔 Project ID: ${config.APPWRITE_PROJECT_ID}`);
    
    // Process main files
    const files = ['league.js', 'config.js'];
    files.forEach(file => {
        if (fs.existsSync(file)) {
            replaceConfigInFile(file);
        }
    });
    
    console.log('✅ Build completed!');
    console.log('💡 To use custom values, set environment variables:');
    console.log('   export APPWRITE_PROJECT_ID="your_project_id"');
    console.log('   export APPWRITE_ENDPOINT="your_endpoint"');
    console.log('   node build.js');
}

main(); 