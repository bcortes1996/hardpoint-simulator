// =========== CONFIGURATION MODULE ===========
// This module handles configuration and environment variables

class ConfigManager {
    constructor() {
        this.config = this.loadConfig();
    }

    loadConfig() {
        // Try to load from environment variables first
        const endpoint = process.env?.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
        const projectId = process.env?.APPWRITE_PROJECT_ID || '68639c810030f7f67bab';
        
        // For client-side, we can use a more sophisticated approach
        return {
            appwrite: {
                endpoint: this.getConfigValue('APPWRITE_ENDPOINT', endpoint),
                projectId: this.getConfigValue('APPWRITE_PROJECT_ID', projectId)
            },
            security: {
                enableRateLimiting: true,
                maxAuthAttempts: 5,
                sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
            }
        };
    }

    // Get configuration value from multiple sources
    getConfigValue(key, defaultValue) {
        // 1. Try to get from window object (for client-side)
        if (typeof window !== 'undefined' && window.__CONFIG__ && window.__CONFIG__[key]) {
            return window.__CONFIG__[key];
        }
        
        // 2. Try to get from environment variable
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key];
        }
        
        // 3. Try to get from localStorage (for runtime configuration)
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(`config_${key}`);
            if (stored) return stored;
        }
        
        // 4. Return default value
        return defaultValue;
    }

    // Set configuration value at runtime
    setConfigValue(key, value) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`config_${key}`, value);
        }
    }

    // Get Appwrite configuration
    getAppwriteConfig() {
        return this.config.appwrite;
    }

    // Get security configuration
    getSecurityConfig() {
        return this.config.security;
    }
}

// Export for use in other files
window.ConfigManager = ConfigManager; 