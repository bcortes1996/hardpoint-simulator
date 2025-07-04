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
        
        // Check for meta tags (alternative approach)
        const projectId = this.getMetaContent('appwrite-project-id');
        const endpoint = this.getMetaContent('appwrite-endpoint');
        const databaseId = this.getMetaContent('appwrite-database-id');
        const leaguesCollectionId = this.getMetaContent('appwrite-leagues-collection-id');
        const membersCollectionId = this.getMetaContent('appwrite-members-collection-id');
        
        // Check if any meta tags have actual values (not empty strings)
        if (projectId && endpoint && databaseId && leaguesCollectionId && membersCollectionId &&
            projectId.trim() !== '' && endpoint.trim() !== '' && databaseId.trim() !== '' && 
            leaguesCollectionId.trim() !== '' && membersCollectionId.trim() !== '') {
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
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        errorDiv.innerHTML = `
            <div class="bg-red-900 border border-red-700 text-red-100 px-8 py-6 rounded-lg max-w-md mx-4 text-center">
                <h2 class="text-xl font-bold mb-4">⚠️ Configuration Error</h2>
                <p class="mb-4">${error.message}</p>
                <div class="text-sm text-red-300 mb-4">
                    <p><strong>Quick Fix:</strong></p>
                    <p>1. Run: <code class="bg-red-800 px-2 py-1 rounded">npm run build</code></p>
                    <p>2. Serve from: <code class="bg-red-800 px-2 py-1 rounded">dist/</code> folder</p>
                </div>
                <button onclick="location.reload()" class="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                    Reload Page
                </button>
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        // Prevent further initialization
        throw error;
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
    // Don't throw here to prevent blocking the entire page
} 