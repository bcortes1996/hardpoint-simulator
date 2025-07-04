# COD Hardpoint Simulator - Secure Deployment Guide

## Overview

This project now includes a secure build system that properly handles sensitive configuration data through environment variables instead of hardcoded values.

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual Appwrite credentials:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_actual_project_id
APPWRITE_DATABASE_ID=your_actual_database_id
APPWRITE_LEAGUES_COLLECTION_ID=your_actual_leagues_collection_id
APPWRITE_MEMBERS_COLLECTION_ID=your_actual_members_collection_id
NODE_ENV=production
```

### 2. Build Commands

```bash
# Install dependencies
npm install

# Check environment variables
npm run build:check

# Run security check
npm run security:check

# Build for production
npm run build

# Clean build artifacts
npm run clean

# Serve locally for testing
npm run serve
```

### 3. Development Workflow

```bash
# Load environment variables and build
source .env.local && npm run build

# Or use a single command with inline variables
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1 \
APPWRITE_PROJECT_ID=your_project_id \
APPWRITE_DATABASE_ID=your_database_id \
APPWRITE_LEAGUES_COLLECTION_ID=your_leagues_collection_id \
APPWRITE_MEMBERS_COLLECTION_ID=your_members_collection_id \
npm run build
```

## Security Features

### ✅ What's Been Secured

1. **Environment Variables**: All sensitive configuration moved to environment variables
2. **Build-time Injection**: Credentials are injected during build process, not hardcoded
3. **Security Checks**: Automated scanning for exposed credentials
4. **Secure Defaults**: Template files use placeholder values
5. **Gitignore Protection**: `.env.local` is excluded from version control

### 🔒 Security Validations

The build system includes several security checks:

- **Environment Validation**: Ensures all required variables are present
- **Credential Scanning**: Detects any exposed credentials in source code
- **Build Verification**: Confirms successful configuration injection

### 📁 Build Output

The build process creates a `dist/` directory with:

- `index.html` - HTML file with injected configuration
- `config.js` - Configuration module
- `league.js` - Main game logic
- `Script.js` - Additional game scripts
- `styles.css` - Styling
- `images/` - Game assets

## Deployment Options

### Option 1: Static Hosting (Recommended)

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to your hosting provider:
   - Netlify: Drag and drop the `dist` folder
   - Vercel: Deploy from the `dist` directory
   - GitHub Pages: Push `dist` contents to `gh-pages` branch
   - AWS S3: Upload `dist` contents to your S3 bucket

### Option 2: Server-Side Deployment

For server-side deployment, you can:

1. Set environment variables on your server
2. Run the build process on the server
3. Serve the `dist` directory with your web server

### Option 3: CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build
        env:
          APPWRITE_ENDPOINT: ${{ secrets.APPWRITE_ENDPOINT }}
          APPWRITE_PROJECT_ID: ${{ secrets.APPWRITE_PROJECT_ID }}
          APPWRITE_DATABASE_ID: ${{ secrets.APPWRITE_DATABASE_ID }}
          APPWRITE_LEAGUES_COLLECTION_ID: ${{ secrets.APPWRITE_LEAGUES_COLLECTION_ID }}
          APPWRITE_MEMBERS_COLLECTION_ID: ${{ secrets.APPWRITE_MEMBERS_COLLECTION_ID }}
      - name: Deploy to hosting
        # Add your deployment steps here
```

## Security Best Practices

### 🔐 Credential Management

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use different credentials** for development and production
3. **Rotate credentials regularly** - Update them in your hosting platform
4. **Monitor API usage** - Check Appwrite logs for suspicious activity

### 🛡️ Appwrite Security

1. **Configure Security Rules**: Set up proper access controls in Appwrite
2. **Enable CORS**: Only allow your domain in Appwrite settings
3. **API Key Restrictions**: Limit API key permissions to minimum required
4. **Rate Limiting**: Configure appropriate rate limits

### 🌐 Hosting Security

1. **Use HTTPS**: Always serve over secure connections
2. **Security Headers**: Configure CSP, HSTS, and other security headers
3. **Domain Verification**: Ensure your domain is properly configured
4. **Access Logs**: Monitor access patterns for anomalies

## Troubleshooting

### Common Issues

1. **Build fails with "Missing environment variables"**
   - Ensure all required variables are set in `.env.local`
   - Run `npm run build:check` to verify

2. **Security check fails**
   - Run `npm run security:check` to identify exposed credentials
   - Remove any hardcoded values from source files

3. **Configuration not working in browser**
   - Verify the build process completed successfully
   - Check browser console for configuration errors
   - Ensure Appwrite credentials are valid

### Debug Commands

```bash
# Check environment variables
npm run build:check

# Scan for security issues
npm run security:check

# Verify build output
ls -la dist/

# Test locally
npm run serve
```

## File Structure

```
project-root/
├── .env.local              # Your environment variables (not committed)
├── env.example             # Template for environment variables
├── build-config.js         # Secure build script
├── package.json           # Build scripts and dependencies
├── config.js              # Configuration module
├── index.html             # Main HTML template
├── league.js              # Game logic
├── Script.js              # Additional scripts
├── styles.css             # Styling
├── images/                # Game assets
└── dist/                  # Build output (generated)
    ├── index.html         # Configured HTML
    ├── config.js          # Configuration
    ├── league.js          # Game logic
    ├── Script.js          # Scripts
    ├── styles.css         # Styling
    └── images/            # Assets
```

## Support

If you encounter any issues with the secure deployment system:

1. Check the troubleshooting section above
2. Verify your environment variables are correctly set
3. Run the security and build checks
4. Review the build output for any errors

The secure build system ensures your sensitive data is properly protected while maintaining the full functionality of the COD Hardpoint Simulator. 