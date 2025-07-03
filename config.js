// Configuration management for Appwrite credentials
class ConfigManager {
    constructor() {
        this.config = this.loadConfig();
    }

    loadConfig() {
        // Try to load from environment variables (for build process)
        const envConfig = {
            APPWRITE_ENDPOINT: process?.env?.APPWRITE_ENDPOINT,
            APPWRITE_PROJECT_ID: process?.env?.APPWRITE_PROJECT_ID
        };

        // Try to load from localStorage (for runtime configuration)
        const localConfig = {
            APPWRITE_ENDPOINT: localStorage.getItem('config_APPWRITE_ENDPOINT'),
            APPWRITE_PROJECT_ID: localStorage.getItem('config_APPWRITE_PROJECT_ID')
        };

        // Try to load from window.__CONFIG__ (for build-time injection)
        const windowConfig = window.__CONFIG__ || {};

        // Merge configurations with priority: localStorage > window.__CONFIG__ > environment > defaults
        return {
            APPWRITE_ENDPOINT: localConfig.APPWRITE_ENDPOINT || 
                              windowConfig.APPWRITE_ENDPOINT || 
                              envConfig.APPWRITE_ENDPOINT || 
                              'https://cloud.appwrite.io/v1',
            APPWRITE_PROJECT_ID: localConfig.APPWRITE_PROJECT_ID || 
                                windowConfig.APPWRITE_PROJECT_ID || 
                                envConfig.APPWRITE_PROJECT_ID || 
                                '68639c810030f7f67bab' // Build-time configured ID
        };
    }

    get(key) {
        return this.config[key];
    }

    set(key, value) {
        this.config[key] = value;
        localStorage.setItem(`config_${key}`, value);
    }

    // Method to update configuration at runtime
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        Object.entries(newConfig).forEach(([key, value]) => {
            localStorage.setItem(`config_${key}`, value);
        });
    }
}

// Create global config instance
window.configManager = new ConfigManager(); 