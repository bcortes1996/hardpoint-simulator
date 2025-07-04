# Security Guide - COD Hardpoint Simulator

## 🔒 Credential Security Implementation

This document outlines the security measures implemented to protect API credentials and sensitive configuration data.

## ⚠️ IMPORTANT: Immediate Actions Required

### 1. Rotate Compromised Credentials
The following credentials were previously exposed in the codebase and should be rotated immediately:

- **Appwrite Project ID**: `68639c810030f7f67bab`
- **Database ID**: `686510ee0020a76d0d98`
- **Collections IDs**: `6867058300318420674c`, `686706550034758889a2`

**Action Steps:**
1. Log into your Appwrite console
2. Create a new project or regenerate project keys
3. Update database and collection IDs if possible
4. Update your production configuration with new credentials

### 2. Configure Appwrite Security Rules
Ensure your Appwrite project has proper security rules configured:

```javascript
// Example security rules for collections
// Users can only read/write their own league memberships
{
  "read": ["user:self"],
  "write": ["user:self"],
  "create": ["user:self"],
  "update": ["user:self"],
  "delete": ["user:self"]
}
```

## 🏗️ Secure Configuration System

### Development Environment
The application now uses a secure configuration system with the following features:

1. **Environment Detection**: Automatically detects development vs production
2. **Configuration Validation**: Validates all required configuration parameters
3. **Secure Logging**: Masks sensitive data in console logs
4. **Fallback Protection**: Prevents production deployment without proper configuration

### Configuration Methods

#### Method 1: Meta Tags (Recommended for Static Sites)
Add configuration via meta tags in your HTML template:

```html
<meta name="appwrite-endpoint" content="https://cloud.appwrite.io/v1">
<meta name="appwrite-project-id" content="your_project_id">
<meta name="appwrite-database-id" content="your_database_id">
<meta name="appwrite-leagues-collection-id" content="your_leagues_collection_id">
<meta name="appwrite-members-collection-id" content="your_members_collection_id">
```

#### Method 2: Global Configuration Object
Set configuration via a global JavaScript object:

```javascript
window.APP_CONFIG = {
  appwrite: {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: 'your_project_id',
    databaseId: 'your_database_id',
    collections: {
      leagues: 'your_leagues_collection_id',
      members: 'your_members_collection_id'
    }
  }
};
```

## 🚀 Deployment Guide

### Static Site Deployment (Netlify, Vercel, etc.)

1. **Set Environment Variables** in your hosting platform:
   ```
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your_project_id
   APPWRITE_DATABASE_ID=your_database_id
   APPWRITE_LEAGUES_COLLECTION_ID=your_leagues_collection_id
   APPWRITE_MEMBERS_COLLECTION_ID=your_members_collection_id
   ```

2. **Create a Build Script** to inject configuration:
   ```javascript
   // build-config.js
   const fs = require('fs');
   
   const config = {
     appwrite: {
       endpoint: process.env.APPWRITE_ENDPOINT,
       projectId: process.env.APPWRITE_PROJECT_ID,
       databaseId: process.env.APPWRITE_DATABASE_ID,
       collections: {
         leagues: process.env.APPWRITE_LEAGUES_COLLECTION_ID,
         members: process.env.APPWRITE_MEMBERS_COLLECTION_ID
       }
     }
   };
   
   // Inject into HTML
   let html = fs.readFileSync('index.html', 'utf8');
   html = html.replace('<meta name="appwrite-endpoint" content="">', 
                      `<meta name="appwrite-endpoint" content="${config.appwrite.endpoint}">`);
   // ... repeat for other meta tags
   
   fs.writeFileSync('dist/index.html', html);
   ```

3. **Update your build process**:
   ```json
   {
     "scripts": {
       "build": "node build-config.js && cp -r . dist/"
     }
   }
   ```

### Server-Side Deployment

For server-side deployments, populate the meta tags or global configuration object using your server-side templating engine.

## 🔐 Security Best Practices

### 1. Credential Management
- ✅ Use environment variables for all sensitive data
- ✅ Never commit credentials to version control
- ✅ Rotate credentials regularly
- ✅ Use different credentials for development and production

### 2. Appwrite Security
- ✅ Configure proper database permissions
- ✅ Set up collection-level security rules
- ✅ Enable rate limiting
- ✅ Monitor API usage and access logs

### 3. Client-Side Security
- ✅ Validate all configuration on startup
- ✅ Mask sensitive data in logs
- ✅ Use HTTPS for all communications
- ✅ Implement proper error handling

### 4. Development Security
- ✅ Use separate development credentials
- ✅ Never use production credentials in development
- ✅ Regularly audit configuration files
- ✅ Use security-focused linting rules

## 🚨 Security Checklist

Before deploying to production:

- [ ] All hardcoded credentials removed from source code
- [ ] Environment variables configured on hosting platform
- [ ] Appwrite security rules configured
- [ ] Production credentials rotated
- [ ] HTTPS enabled
- [ ] Configuration validation working
- [ ] Error handling tested
- [ ] Security audit completed

## 📞 Security Contact

If you discover a security vulnerability, please report it responsibly:

1. Do not create a public GitHub issue
2. Email security concerns to the project maintainer
3. Include detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## 🔄 Regular Security Maintenance

- **Monthly**: Review and rotate API keys
- **Quarterly**: Audit Appwrite security rules
- **Annually**: Complete security assessment
- **As needed**: Update dependencies and security patches 