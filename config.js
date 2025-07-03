// Configuration management for Appwrite credentials
class ConfigManager {
    constructor() {
        this.config = this.loadConfig();
    }

    loadConfig() {
        // Try to load from environment variables (for build process)
        const envConfig = {
            APPWRITE_ENDPOINT: typeof process !== 'undefined' && process.env ? process.env.APPWRITE_ENDPOINT : undefined,
            APPWRITE_PROJECT_ID: typeof process !== 'undefined' && process.env ? process.env.APPWRITE_PROJECT_ID : undefined
        };

        // Try to load from localStorage (for runtime configuration)
        const localConfig = {
            APPWRITE_ENDPOINT: typeof localStorage !== 'undefined' ? localStorage.getItem('config_APPWRITE_ENDPOINT') : undefined,
            APPWRITE_PROJECT_ID: typeof localStorage !== 'undefined' ? localStorage.getItem('config_APPWRITE_PROJECT_ID') : undefined
        };

        // Try to load from window.__CONFIG__ (for build-time injection)
        const windowConfig = typeof window !== 'undefined' && window.__CONFIG__ ? window.__CONFIG__ : {};

        // Merge configurations with priority: localStorage > window.__CONFIG__ > environment
        const APPWRITE_ENDPOINT = localConfig.APPWRITE_ENDPOINT || windowConfig.APPWRITE_ENDPOINT || envConfig.APPWRITE_ENDPOINT;
        const APPWRITE_PROJECT_ID = localConfig.APPWRITE_PROJECT_ID || windowConfig.APPWRITE_PROJECT_ID || envConfig.APPWRITE_PROJECT_ID;

        if (!APPWRITE_PROJECT_ID) {
            throw new Error('Missing Appwrite Project ID: Please set APPWRITE_PROJECT_ID via environment variable, localStorage, or window.__CONFIG__.');
        }
        if (!APPWRITE_ENDPOINT) {
            throw new Error('Missing Appwrite Endpoint: Please set APPWRITE_ENDPOINT via environment variable, localStorage, or window.__CONFIG__.');
        }

        return {
            APPWRITE_ENDPOINT,
            APPWRITE_PROJECT_ID
        };
    }

    get(key) {
        return this.config[key];
    }

    set(key, value) {
        this.config[key] = value;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`config_${key}`, value);
        }
    }

    // Method to update configuration at runtime
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        if (typeof localStorage !== 'undefined') {
            Object.entries(newConfig).forEach(([key, value]) => {
                localStorage.setItem(`config_${key}`, value);
            });
        }
    }
}

// Create global config instance
window.configManager = new ConfigManager(); 