// Configuration Management for COD Hardpoint Simulator
// This file manages API credentials and configuration settings

class AppwriteConfig {
    constructor() {
        // Check if we're in development or production
        this.isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.includes('localhost');
        
        // Initialize configuration
        this.config = this.loadConfig();
        
        // Validate configuration
        this.validateConfig();
    }
    
    loadConfig() {
        // Try to load from environment variables first (if available)
        const envConfig = this.loadFromEnvironment();
        if (envConfig) {
            return envConfig;
        }
        
        // Fallback to configuration object (for development only)
        if (this.isDevelopment) {
            console.warn('⚠️  Using development configuration. Do not use in production!');
            return this.getDevelopmentConfig();
        }
        
        // Production should always use environment variables
        throw new Error('Production environment requires proper configuration. Please set up environment variables.');
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
        
        if (projectId && endpoint && databaseId && leaguesCollectionId && membersCollectionId) {
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
window.appwriteConfig = new AppwriteConfig(); 