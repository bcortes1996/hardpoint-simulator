// =========== SECURITY MODULE ===========
// This module provides security protections for the Call of Duty Hardpoint Simulator

class SecurityManager {
    constructor() {
        this.rateLimiter = {
            actions: {},
            limits: {
                authAttempts: { max: 5, window: 60000 }, // 5 attempts per minute
                apiCalls: { max: 100, window: 60000 },   // 100 calls per minute
                matchSimulations: { max: 10, window: 60000 }, // 10 matches per minute
                trainingSessions: { max: 3, window: 300000 } // 3 training sessions per 5 minutes
            }
        };
        
        this.csrfToken = this.generateCSRFToken();
        this.sessionStartTime = Date.now();
        this.suspiciousActivityCount = 0;
    }

    // Rate limiting to prevent abuse
    checkRateLimit(actionType) {
        const now = Date.now();
        const limit = this.rateLimiter.limits[actionType];
        
        if (!this.rateLimiter.actions[actionType]) {
            this.rateLimiter.actions[actionType] = [];
        }
        
        // Remove old entries outside the time window
        this.rateLimiter.actions[actionType] = this.rateLimiter.actions[actionType].filter(
            timestamp => now - timestamp < limit.window
        );
        
        // Check if limit exceeded
        if (this.rateLimiter.actions[actionType].length >= limit.max) {
            this.logSuspiciousActivity(`Rate limit exceeded for ${actionType}`);
            return false;
        }
        
        // Add current action
        this.rateLimiter.actions[actionType].push(now);
        return true;
    }

    // Input validation and sanitization
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        // Remove potentially dangerous characters and limit length
        return input
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim()
            .substring(0, 1000); // Limit length
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    validatePassword(password) {
        return password && password.length >= 6 && password.length <= 128;
    }

    // CSRF protection
    generateCSRFToken() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    validateCSRFToken(token) {
        return token === this.csrfToken;
    }

    // Session security
    checkSessionValidity() {
        const sessionAge = Date.now() - this.sessionStartTime;
        const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionAge > maxSessionAge) {
            this.logSuspiciousActivity('Session expired');
            return false;
        }
        return true;
    }

    // Suspicious activity detection
    logSuspiciousActivity(activity) {
        this.suspiciousActivityCount++;
        console.warn(`Security Warning: ${activity} (Count: ${this.suspiciousActivityCount})`);
        
        // If too many suspicious activities, take action
        if (this.suspiciousActivityCount > 10) {
            this.blockUser();
        }
    }

    blockUser() {
        console.error('User blocked due to suspicious activity');
        // In a real app, you'd redirect to a blocked page or show a message
        alert('Account temporarily blocked due to suspicious activity. Please try again later.');
    }

    // API call protection
    protectAPICall(callback, actionType = 'apiCalls') {
        return async (...args) => {
            if (!this.checkRateLimit(actionType)) {
                throw new Error(`Rate limit exceeded. Please wait before trying again.`);
            }
            
            try {
                return await callback(...args);
            } catch (error) {
                this.logSuspiciousActivity(`API call failed: ${error.message}`);
                throw error;
            }
        };
    }

    // Secure authentication wrapper
    secureAuth(authFunction) {
        return async (email, password) => {
            // Rate limit auth attempts
            if (!this.checkRateLimit('authAttempts')) {
                throw new Error('Too many authentication attempts. Please wait before trying again.');
            }

            // Validate inputs
            if (!this.validateEmail(email)) {
                throw new Error('Invalid email format.');
            }

            if (!this.validatePassword(password)) {
                throw new Error('Password must be between 6 and 128 characters.');
            }

            // Sanitize inputs
            const sanitizedEmail = this.sanitizeInput(email);
            
            try {
                return await authFunction(sanitizedEmail, password);
            } catch (error) {
                this.logSuspiciousActivity(`Authentication failed: ${error.message}`);
                throw error;
            }
        };
    }

    // Secure match simulation
    secureMatchSimulation(simulationFunction) {
        return async (...args) => {
            if (!this.checkRateLimit('matchSimulations')) {
                throw new Error('Too many match simulations. Please wait before trying again.');
            }

            if (!this.checkSessionValidity()) {
                throw new Error('Session expired. Please refresh the page.');
            }

            try {
                return await simulationFunction(...args);
            } catch (error) {
                this.logSuspiciousActivity(`Match simulation failed: ${error.message}`);
                throw error;
            }
        };
    }

    // Secure training session
    secureTraining(trainingFunction) {
        return async (...args) => {
            if (!this.checkRateLimit('trainingSessions')) {
                throw new Error('Too many training sessions. Please wait before trying again.');
            }

            try {
                return await trainingFunction(...args);
            } catch (error) {
                this.logSuspiciousActivity(`Training session failed: ${error.message}`);
                throw error;
            }
        };
    }

    // Get security status
    getSecurityStatus() {
        return {
            suspiciousActivityCount: this.suspiciousActivityCount,
            sessionAge: Date.now() - this.sessionStartTime,
            csrfToken: this.csrfToken
        };
    }
}

// Export for use in other files
window.SecurityManager = SecurityManager; 