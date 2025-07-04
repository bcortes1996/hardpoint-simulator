#!/usr/bin/env node

/**
 * Build Configuration Script
 * Securely injects environment variables into HTML for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting secure configuration build...');

// Validate required environment variables
const requiredEnvVars = [
    'APPWRITE_ENDPOINT',
    'APPWRITE_PROJECT_ID',
    'APPWRITE_DATABASE_ID',
    'APPWRITE_LEAGUES_COLLECTION_ID',
    'APPWRITE_MEMBERS_COLLECTION_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
        console.error(`   - ${varName}`);
    });
    console.error('\nPlease set these environment variables before building.');
    console.error('See env.example for reference.');
    process.exit(1);
}

// Read the template HTML file
const htmlPath = path.join(__dirname, 'index.html');
if (!fs.existsSync(htmlPath)) {
    console.error('❌ index.html not found');
    process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');

// Inject configuration into meta tags
const config = {
    'appwrite-endpoint': process.env.APPWRITE_ENDPOINT,
    'appwrite-project-id': process.env.APPWRITE_PROJECT_ID,
    'appwrite-database-id': process.env.APPWRITE_DATABASE_ID,
    'appwrite-leagues-collection-id': process.env.APPWRITE_LEAGUES_COLLECTION_ID,
    'appwrite-members-collection-id': process.env.APPWRITE_MEMBERS_COLLECTION_ID
};

// Replace empty meta tags with actual values
Object.entries(config).forEach(([key, value]) => {
    const pattern = new RegExp(`<meta name="${key}" content="">`, 'g');
    const replacement = `<meta name="${key}" content="${value}">`;
    html = html.replace(pattern, replacement);
    console.log(`✅ Configured ${key}: ${value.substring(0, 20)}...`);
});

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Write the configured HTML file
const distHtmlPath = path.join(distDir, 'index.html');
fs.writeFileSync(distHtmlPath, html);

// Copy other necessary files
const filesToCopy = [
    'config.js',
    'league.js',
    'Script.js',
    'styles.css'
];

filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied ${file}`);
    } else {
        console.warn(`⚠️  Warning: ${file} not found, skipping`);
    }
});

// Copy images directory if it exists
const imagesDir = path.join(__dirname, 'images');
const distImagesDir = path.join(distDir, 'images');

if (fs.existsSync(imagesDir)) {
    if (!fs.existsSync(distImagesDir)) {
        fs.mkdirSync(distImagesDir, { recursive: true });
    }
    
    const imageFiles = fs.readdirSync(imagesDir);
    imageFiles.forEach(file => {
        const srcPath = path.join(imagesDir, file);
        const destPath = path.join(distImagesDir, file);
        fs.copyFileSync(srcPath, destPath);
    });
    console.log(`✅ Copied images directory (${imageFiles.length} files)`);
}

console.log('\n🎉 Build completed successfully!');
console.log(`📁 Output directory: ${distDir}`);
console.log('🚀 Ready for deployment');

// Security reminder
console.log('\n🔒 Security Reminder:');
console.log('- Ensure your hosting platform uses HTTPS');
console.log('- Verify Appwrite security rules are configured');
console.log('- Monitor API usage and access logs');
console.log('- Regularly rotate your API credentials'); 