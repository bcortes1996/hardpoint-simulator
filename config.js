// Configuration Management for COD Hardpoint Simulator
// This file manages API credentials and configuration settings

class AppwriteConfig {
    constructor() {
        // Check if we're in development or production
        this.isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.includes('localhost') ||
                           window.location.protocol === 'file:' ||
                           window.location.hostname.includes('127.0.0.1');
        
        // Initialize configuration with error handling
        try {
            this.config = this.loadConfig();
            // Validate configuration
            this.validateConfig();
        } catch (error) {
            console.error('❌ Configuration Error:', error.message);
            console.warn('⚠️  Falling back to development configuration');
            // Force development mode if configuration fails
            this.isDevelopment = true;
            this.config = this.getDevelopmentConfig();
        }
    }
    
    loadConfig() {
        // Try to load from environment variables first (if available)
        const envConfig = this.loadFromEnvironment();
        if (envConfig) {
            console.log('✅ Configuration loaded from environment variables');
            return envConfig;
        }
        
        // Fallback to configuration object (for development)
        if (this.isDevelopment) {
            console.warn('⚠️  Using development configuration. Do not use in production!');
            return this.getDevelopmentConfig();
        }
        
        // If not in development and no env config, use development config anyway
        console.warn('⚠️  No environment configuration found. Using development configuration.');
        return this.getDevelopmentConfig();
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
try {
    window.appwriteConfig = new AppwriteConfig();
    console.log('✅ Configuration system initialized successfully');
} catch (error) {
    console.error('❌ Failed to initialize configuration system:', error);
    // Create a fallback configuration object
    window.appwriteConfig = {
        isDevelopment: true,
        config: {
            appwrite: {
                endpoint: 'https://cloud.appwrite.io/v1',
                projectId: '68639c810030f7f67bab',
                databaseId: '686510ee0020a76d0d98',
                collections: {
                    leagues: '6867058300318420674c',
                    members: '686706550034758889a2'
                }
            }
        },
        getAppwriteConfig: function() { return this.config.appwrite; },
        getEndpoint: function() { return this.config.appwrite.endpoint; },
        getProjectId: function() { return this.config.appwrite.projectId; },
        getDatabaseId: function() { return this.config.appwrite.databaseId; },
        getLeaguesCollectionId: function() { return this.config.appwrite.collections.leagues; },
        getMembersCollectionId: function() { return this.config.appwrite.collections.members; },
        logConfigStatus: function() { console.log('Using fallback configuration'); }
    };
    console.warn('⚠️  Using fallback configuration object');
} 