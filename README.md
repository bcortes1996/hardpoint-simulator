# Call of Duty: Hardpoint Simulator

A web-based esports simulation game that allows users to manage teams and simulate Call of Duty Hardpoint matches.

## 🎮 Features

- **League Season Management**: Full 7-week season with standings
- **Team Roster Management**: 4 active players + 2 substitutes
- **Training System**: Weekly drills to improve player stats
- **Player Market**: Sign free agents each week
- **Real-time Match Simulation**: Live Hardpoint games with kill feed
- **Economy System**: Earn coins from matches
- **User Authentication**: Secure login/signup system

## 🛡️ Security Features

### Implemented Protections

1. **Rate Limiting**
   - Authentication attempts: 5 per minute
   - API calls: 100 per minute
   - Match simulations: 10 per minute
   - Training sessions: 3 per 5 minutes

2. **Input Validation & Sanitization**
   - Email format validation
   - Password strength requirements (6-128 characters)
   - XSS protection through input sanitization
   - Length limits on all inputs

3. **Content Security Policy (CSP)**
   - Prevents XSS attacks
   - Restricts resource loading to trusted sources
   - Blocks inline scripts and styles

4. **Session Security**
   - 24-hour session limits
   - CSRF token protection
   - Suspicious activity detection

5. **Authentication Security**
   - Secure password handling
   - Rate-limited login attempts
   - Session validation

### Security Headers

- `Content-Security-Policy`: Prevents XSS and resource injection
- `X-Content-Type-Options`: Prevents MIME type sniffing
- `X-Frame-Options`: Prevents clickjacking
- `Referrer-Policy`: Controls referrer information

## 🚀 Live Demo

Visit: [https://bcortes1996.github.io/hardpoint-simulator](https://bcortes1996.github.io/hardpoint-simulator)

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Tailwind CSS
- **Backend**: Appwrite (BaaS)
- **Authentication**: Appwrite Auth
- **Database**: Appwrite Databases
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
├── index.html          # Main application file
├── league.js           # Core game logic and league management
├── Script.js           # Match simulation engine
├── security.js         # Security module with protections
├── styles.css          # Custom styling
├── images/             # Player and team images
└── README.md           # This file
```

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bcortes1996/hardpoint-simulator.git
   cd hardpoint-simulator
   ```

2. **Run locally**
   ```bash
   python3 -m http.server 8000
   # or
   npx serve .
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 🔐 Security Considerations

### What's Protected
- ✅ User authentication and sessions
- ✅ Input validation and sanitization
- ✅ Rate limiting on all actions
- ✅ XSS protection via CSP
- ✅ CSRF protection
- ✅ Session timeout

### What's Public (By Design)
- Project ID and endpoint (required for client-side apps)
- Team data and player stats
- Game mechanics and rules

### 🔒 Hiding Configuration IDs

The app supports multiple methods to hide or obfuscate configuration values:

#### **Option 1: Environment Variables (Recommended)**
```bash
# Set environment variables before building
export APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
export APPWRITE_PROJECT_ID="your_project_id"

# Run build script
node build.js
```

#### **Option 2: Build-time Configuration**
```bash
# Use the build script with custom values
APPWRITE_PROJECT_ID="your_project_id" node build.js
```

#### **Option 3: Runtime Configuration**
```javascript
// Set configuration at runtime (in browser console)
localStorage.setItem('config_APPWRITE_PROJECT_ID', 'your_project_id');
// Refresh the page
```

#### **Option 4: Obfuscation**
The build script can replace IDs with placeholders:
```bash
node build.js --obfuscate
```

### Recommended Additional Security
1. **Appwrite Console Settings**:
   - Set database permissions to "Users" only
   - Enable rate limiting in Appwrite
   - Monitor API usage

2. **Production Considerations**:
   - Set up monitoring for suspicious activity
   - Implement IP-based rate limiting
   - Add CAPTCHA for high-traffic scenarios
   - Use environment variables for configuration

## 🎯 How to Play

1. **Create an account** or login
2. **Select "League Season"** from the main menu
3. **Choose your franchise** (one of 8 teams)
4. **Manage your roster** in the Roster tab
5. **Train your players** weekly in the Training tab
6. **Sign free agents** in the Market tab
7. **Play matches** and earn coins
8. **Compete for the championship**!

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

This project is for educational and entertainment purposes.

## 🔗 Links

- **Live App**: [https://bcortes1996.github.io/hardpoint-simulator](https://bcortes1996.github.io/hardpoint-simulator)
- **GitHub Repository**: [https://github.com/bcortes1996/hardpoint-simulator](https://github.com/bcortes1996/hardpoint-simulator)

---

**Note**: This is a simulation game and not affiliated with Call of Duty or Activision. 