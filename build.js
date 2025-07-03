#!/usr/bin/env node

// Build script for Call of Duty Hardpoint Simulator
// This script can replace configuration values at build time

const fs = require('fs');

// Configuration values (can be set via environment variables)
const config = {
    APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID || '68639c810030f7f67bab'
};

function replaceConfigInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace the configuration object
        const configRegex = /window\.__CONFIG__\s*=\s*\{[\s\S]*?\};/;
        const newConfig = `window.__CONFIG__ = {
            APPWRITE_ENDPOINT: '${config.APPWRITE_ENDPOINT}',
            APPWRITE_PROJECT_ID: '${config.APPWRITE_PROJECT_ID}'
        };`;
        
        if (configRegex.test(content)) {
            content = content.replace(configRegex, newConfig);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated configuration in ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

function main() {
    console.log('🔧 Building with configuration...');
    replaceConfigInFile('index.html');
    console.log('✅ Build completed!');
}

main(); 