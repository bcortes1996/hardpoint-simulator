// Configuration Management for COD Hardpoint Simulator
// This file manages API credentials and configuration settings

class AppwriteConfig {
    constructor() {
        // Check if we're in development or production
        this.isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.includes('localhost');
        
        // Initialize configuration
        try {
            this.config = this.loadConfig();
            // Validate configuration
            this.validateConfig();
        } catch (error) {
            console.error('❌ Configuration Error:', error.message);
            this.handleConfigurationError(error);
        }
    }
    
    loadConfig() {
        // Try to load from environment variables first (if available)
        const envConfig = this.loadFromEnvironment();
        if (envConfig) {
            console.log('✅ Configuration loaded from environment variables');
            return envConfig;
        }
        
        // Fallback to configuration object (for development only)
        if (this.isDevelopment) {
            console.warn('⚠️  Using development configuration. Do not use in production!');
            return this.getDevelopmentConfig();
        }
        
        // Production should always use environment variables
        throw new Error('Production environment requires proper configuration. Please ensure you are running the built version from the dist/ folder, not the raw HTML file.');
    }
    
    loadFromEnvironment() {
        // Check if configuration is provided via global variables
        // This would be set by a server-side template or build process
        if (typeof window !== 'undefined' && window.APP_CONFIG) {
            return window.APP_CONFIG;
        }
        
        // Check for meta tags (updated to match build script)
        const projectId = this.getMetaContent('APPWRITE_PROJECT_ID');
        const endpoint = this.getMetaContent('APPWRITE_ENDPOINT');
        const databaseId = this.getMetaContent('APPWRITE_DATABASE_ID');
        const leaguesCollectionId = this.getMetaContent('APPWRITE_LEAGUES_COLLECTION_ID');
        const membersCollectionId = this.getMetaContent('APPWRITE_MEMBERS_COLLECTION_ID');
        
        // Check if any meta tags have actual values (not empty strings or demo values)
        if (projectId && endpoint && databaseId && leaguesCollectionId && membersCollectionId &&
            projectId.trim() !== '' && endpoint.trim() !== '' && databaseId.trim() !== '' && 
            leaguesCollectionId.trim() !== '' && membersCollectionId.trim() !== '' &&
            projectId !== 'demo-project' && databaseId !== 'demo-database') {
            return {
                appwrite: {
                    endpoint: endpoint,
                    projectId: projectId,
                    databaseId: databaseId,
                    collections: {
                        leagues: leaguesCollectionId,
                        members: membersCollectionId
                    }
                }
            };
        }
        
        return null;
    }
    
    getMetaContent(name) {
        const meta = document.querySelector(`meta[name="${name}"]`);
        return meta ? meta.getAttribute('content') : null;
    }
    
    getDevelopmentConfig() {
        // Development configuration - should be moved to environment variables
        return {
            appwrite: {
                endpoint: 'https://cloud.appwrite.io/v1',
                projectId: '68639c810030f7f67bab', // TODO: Move to environment variable
                databaseId: '686510ee0020a76d0d98', // TODO: Move to environment variable
                collections: {
                    leagues: '6867058300318420674c', // TODO: Move to environment variable
                    members: '686706550034758889a2' // TODO: Move to environment variable
                }
            }
        };
    }
    
    handleConfigurationError(error) {
        // Store error for later display when DOM is ready
        this.configError = error;
        
        // Try to show error immediately if DOM is ready
        if (document.readyState === 'loading') {
            // DOM is still loading, wait for it
            document.addEventListener('DOMContentLoaded', () => {
                this.showConfigurationError(error);
            });
        } else {
            // DOM is already loaded
            this.showConfigurationError(error);
        }
    }
    
    showConfigurationError(error) {
        // Ensure we have a body element
        if (!document.body) {
            setTimeout(() => this.showConfigurationError(error), 100);
            return;
        }
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        errorDiv.innerHTML = `
            <div style="background-color: #7f1d1d; border: 2px solid #b91c1c; color: #fecaca; padding: 2rem; border-radius: 0.5rem; max-width: 500px; margin: 1rem; text-align: center;">
                <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">⚠️ Configuration Error</h2>
                <p style="margin-bottom: 1rem;">${error.message}</p>
                <div style="font-size: 0.875rem; color: #fca5a5; margin-bottom: 1rem;">
                    <p><strong>This is a demo deployment!</strong></p>
                    <p>The app is running in fallback mode.</p>
                    <p>Some features may not work without proper configuration.</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background-color: #b91c1c; color: white; font-weight: bold; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; cursor: pointer;">
                    Continue in Demo Mode
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    validateConfig() {
        const { appwrite } = this.config;
        
        if (!appwrite) {
            throw new Error('Appwrite configuration is missing');
        }
        
        const required = ['endpoint', 'projectId', 'databaseId'];
        for (const field of required) {
            if (!appwrite[field]) {
                throw new Error(`Missing required Appwrite configuration: ${field}`);
            }
        }
        
        if (!appwrite.collections || !appwrite.collections.leagues || !appwrite.collections.members) {
            throw new Error('Missing required collection IDs in Appwrite configuration');
        }
        
        // Log configuration status (without sensitive data)
        console.log('✅ Configuration loaded successfully');
        console.log(`📍 Environment: ${this.isDevelopment ? 'Development' : 'Production'}`);
        console.log(`🔗 Endpoint: ${appwrite.endpoint}`);
        console.log(`📊 Project ID: ${appwrite.projectId.substring(0, 8)}...`);
    }
    
    getAppwriteConfig() {
        return this.config.appwrite;
    }
    
    getEndpoint() {
        return this.config.appwrite.endpoint;
    }
    
    getProjectId() {
        return this.config.appwrite.projectId;
    }
    
    getDatabaseId() {
        return this.config.appwrite.databaseId;
    }
    
    getLeaguesCollectionId() {
        return this.config.appwrite.collections.leagues;
    }
    
    getMembersCollectionId() {
        return this.config.appwrite.collections.members;
    }
    
    // Check if configuration is properly loaded
    isConfigured() {
        return this.config !== null && this.config.appwrite !== null;
    }
    
    // Get configuration error if any
    getError() {
        return this.configError || null;
    }
    
    // Security helper methods
    maskSensitiveData(data) {
        if (typeof data === 'string' && data.length > 8) {
            return data.substring(0, 8) + '...';
        }
        return data;
    }
    
    // Method to safely log configuration for debugging
    logConfigStatus() {
        const config = this.getAppwriteConfig();
        console.log('Configuration Status:', {
            endpoint: config.endpoint,
            projectId: this.maskSensitiveData(config.projectId),
            databaseId: this.maskSensitiveData(config.databaseId),
            collections: {
                leagues: this.maskSensitiveData(config.collections.leagues),
                members: this.maskSensitiveData(config.collections.members)
            }
        });
    }
}

// Export configuration instance
try {
    window.appwriteConfig = new AppwriteConfig();
} catch (error) {
    console.error('Failed to initialize configuration:', error);
    // Create a fallback configuration that allows the app to continue
    window.appwriteConfig = {
        config: null,
        configError: error,
        isDevelopment: false,
        getAppwriteConfig: () => null,
        getEndpoint: () => null,
        getProjectId: () => null,
        getDatabaseId: () => null,
        getLeaguesCollectionId: () => null,
        getMembersCollectionId: () => null,
        isConfigured: () => false,
        getError: () => error
    };
    console.warn('⚠️  Running in fallback mode - some features may not work');
} 