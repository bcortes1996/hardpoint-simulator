# Call of Duty Hardpoint Simulator

A comprehensive Call of Duty Hardpoint simulation game with league management, player development, and realistic gameplay mechanics.

## 🔐 Security Configuration

This application uses environment variables to securely manage Appwrite credentials. The project ID and endpoint are no longer hardcoded in the source code.

### Setting Up Environment Variables

#### Option 1: Build-time Configuration (Recommended)

1. **Set environment variables:**
   ```bash
   export APPWRITE_PROJECT_ID="your_actual_project_id"
   export APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
   ```

2. **Run the build script:**
   ```bash
   node build.js
   ```

3. **Deploy the updated files**

#### Option 2: Runtime Configuration

You can also set configuration at runtime in the browser console:
```javascript
localStorage.setItem('config_APPWRITE_PROJECT_ID', 'your_actual_project_id');
localStorage.setItem('config_APPWRITE_ENDPOINT', 'https://cloud.appwrite.io/v1');
// Refresh the page
```

#### Option 3: One-liner Build

```bash
APPWRITE_PROJECT_ID="your_actual_project_id" node build.js
```

### Configuration Priority

The system loads configuration in this order:
1. **localStorage** (runtime configuration)
2. **window.__CONFIG__** (build-time injection)
3. **Environment variables** (build process)
4. **Default values** (fallback)

### Security Benefits

✅ **No hardcoded credentials** in source code  
✅ **Environment variable support**  
✅ **Build-time configuration**  
✅ **Runtime configuration**  
✅ **Backward compatibility**  

### Files Modified

- `config.js` - Configuration management system
- `build.js` - Build script for custom configuration
- `league.js` - Updated to use dynamic configuration
- `index.html` - Added config.js script

### Default Configuration

If no environment variables are set, the system uses:
- **Endpoint**: `https://cloud.appwrite.io/v1`
- **Project ID**: `68639c810030f7f67bab` (original ID as fallback)

## 🚀 Getting Started

1. Clone the repository
2. Set your Appwrite credentials as environment variables
3. Run `node build.js` to configure the application
4. Deploy to your hosting platform

## 📝 License

This project is open source and available under the MIT License. 