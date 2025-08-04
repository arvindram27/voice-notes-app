# Installation & Setup Guide

A comprehensive guide to set up and deploy the Voice Notes App locally and on various hosting platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [HTTPS Setup for Microphone Access](#https-setup-for-microphone-access)
- [Deployment Options](#deployment-options)
  - [GitHub Pages](#github-pages)
  - [Netlify](#netlify)
  - [Vercel](#vercel)
- [Browser Compatibility](#browser-compatibility)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **Modern Web Browser**: 
  - Chrome 85+ (recommended)
  - Edge 85+
  - Safari 14+
  - Firefox 79+ (limited support)
- **Hardware**: 
  - Microphone (built-in or external)
  - Internet connection (for initial setup and speech recognition)

### Development Tools (Optional)
- **Node.js**: Version 14+ (for local development server)
- **Git**: For version control and deployment
- **Code Editor**: VS Code, Sublime Text, or any preferred editor

---

## Local Development Setup

### Quick Start (Basic)

1. **Download/Clone the Project**
   ```bash
   # Clone from repository
   git clone https://github.com/your-username/voice-notes-app.git
   
   # Or download and extract ZIP file
   ```

2. **Navigate to Project Directory**
   ```bash
   cd voice-notes-app
   ```

3. **Open in Browser**
   - **Method 1**: Double-click `index.html` to open directly in browser
   - **Method 2**: Use a local development server (recommended)

### Using a Local Development Server (Recommended)

#### Option 1: Using Node.js http-server
```bash
# Install http-server globally
npm install -g http-server

# Navigate to project directory
cd voice-notes-app

# Start server
http-server -p 8080

# Open http://localhost:8080 in your browser
```

#### Option 2: Using Python (if Python is installed)
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Open http://localhost:8080 in your browser
```

#### Option 3: Using Live Server (VS Code Extension)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Initial Setup Verification

1. **Allow Microphone Access**: When prompted by your browser, click "Allow"
2. **Test Recording**: Click "Start Recording" and speak into your microphone
3. **Verify Transcription**: Ensure your speech appears in the transcription area
4. **Save a Test Note**: Select a category and save your first note

---

## HTTPS Setup for Microphone Access

Modern browsers require HTTPS for microphone access in production environments. Here are several options:

### Option 1: Using mkcert (Recommended for Development)

1. **Install mkcert**
   ```bash
   # Windows (using Chocolatey)
   choco install mkcert
   
   # macOS (using Homebrew)
   brew install mkcert
   
   # Linux
   # Follow instructions at https://github.com/FiloSottile/mkcert
   ```

2. **Create Local Certificate Authority**
   ```bash
   mkcert -install
   ```

3. **Generate SSL Certificate**
   ```bash
   # In your project directory
   mkcert localhost 127.0.0.1 ::1
   ```

4. **Serve with HTTPS**
   ```bash
   # Using http-server with SSL
   http-server -S -C localhost+2.pem -K localhost+2-key.pem -p 8443
   
   # Open https://localhost:8443 in your browser
   ```

### Option 2: Using live-server with HTTPS
```bash
# Install live-server globally
npm install -g live-server

# Start with HTTPS
live-server --https=path/to/cert.pem --https-module=spdy
```

### Option 3: Browser Flags (Chrome - Development Only)
For development purposes, you can disable HTTPS requirement:
```bash
# Start Chrome with disabled security (NOT for production)
chrome --unsafely-treat-insecure-origin-as-secure="http://localhost:8080" --user-data-dir=/tmp/foo
```

---

## Deployment Options

### GitHub Pages

#### Method 1: Through GitHub Web Interface
1. **Push Code to GitHub Repository**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

3. **Access Your App**
   - Your app will be available at: `https://your-username.github.io/repository-name`
   - HTTPS is automatically enabled

#### Method 2: Using GitHub CLI
```bash
# Install GitHub CLI and authenticate
gh auth login

# Enable Pages
gh api repos/:owner/:repo/pages -X POST -f source.branch=main -f source.path=/
```

### Netlify

#### Method 1: Git Integration (Recommended)
1. **Create Netlify Account** at [netlify.com](https://www.netlify.com/)

2. **Connect Repository**
   - Click **"New site from Git"**
   - Choose **GitHub** (or your Git provider)
   - Select your repository
   - Configure build settings:
     - **Build command**: Leave empty (static site)
     - **Publish directory**: Leave empty (root directory)
   - Click **Deploy site**

3. **Custom Domain (Optional)**
   - Go to **Site settings** → **Domain management**
   - Add your custom domain
   - Configure DNS settings as instructed

#### Method 2: Drag & Drop Deployment
1. Build your project locally (if needed)
2. Zip your project files
3. Drag and drop the ZIP file onto Netlify's deploy area

#### Netlify CLI Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from project directory
netlify deploy --prod --dir .
```

### Vercel

#### Method 1: Git Integration
1. **Create Vercel Account** at [vercel.com](https://vercel.com/)

2. **Import Project**
   - Click **"New Project"**
   - Import from your Git repository
   - Configure project settings:
     - **Framework Preset**: Other
     - **Build Command**: Leave empty
     - **Output Directory**: Leave empty
   - Click **Deploy**

3. **Custom Domain (Optional)**
   - Go to project **Settings** → **Domains**
   - Add your custom domain

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel --prod
```

### Other Static Hosting Options

#### Surge.sh
```bash
# Install Surge
npm install -g surge

# Deploy
surge . your-domain.surge.sh
```

#### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

---

## Browser Compatibility

### Fully Supported Browsers
- **Chrome 85+**: Full Web Speech API support
- **Edge 85+**: Full Web Speech API support
- **Safari 14+**: Full Web Speech API support

### Limited Support
- **Firefox 79+**: Basic functionality, limited speech recognition

### Required Browser Permissions
- **Microphone Access**: Required for voice recording
- **Local Storage**: For saving notes locally
- **IndexedDB**: For persistent note storage

### Feature Detection
The app automatically detects browser capabilities and displays appropriate error messages for unsupported features.

---

## Troubleshooting

### Common Issues

#### Microphone Access Denied
**Problem**: Browser blocks microphone access
**Solutions**:
- Click the microphone icon in the address bar and allow access
- Check browser settings for microphone permissions
- Ensure microphone is not being used by another application
- Try refreshing the page and allowing access again

#### Speech Recognition Not Working
**Problem**: Transcription doesn't appear
**Solutions**:
- Verify browser compatibility (use Chrome/Edge/Safari)
- Check internet connection (speech recognition requires online service)
- Ensure microphone is working in other applications
- Try speaking louder and more clearly

#### HTTPS Required Error
**Problem**: Microphone access blocked on HTTP
**Solutions**:
- Use a local HTTPS server (see [HTTPS Setup](#https-setup-for-microphone-access))
- Deploy to a hosting service (automatic HTTPS)
- Use localhost instead of IP address for local development

#### Notes Not Persisting
**Problem**: Notes disappear after page refresh
**Solutions**:
- Check if browser supports IndexedDB
- Verify browser storage permissions
- Clear browser cache and try again
- Check browser developer tools for storage errors

#### Performance Issues
**Problem**: App runs slowly or freezes
**Solutions**:
- Close other browser tabs
- Clear browser cache
- Check available system memory
- Try using a different browser

### Browser-Specific Issues

#### Chrome
- If speech recognition stops unexpectedly, check Chrome's site settings
- Ensure "Use microphone" is allowed for the site

#### Safari
- Speech recognition may have delays compared to Chrome
- Ensure microphone access is granted in Safari preferences

#### Firefox
- Limited Web Speech API support
- Consider using Chrome or Edge for full functionality

### Development Issues

#### CORS Errors
**Problem**: Cross-origin resource sharing errors
**Solutions**:
- Use a local development server instead of file:// protocol
- Serve files through HTTP/HTTPS server

#### Module Loading Issues
**Problem**: JavaScript modules not loading
**Solutions**:
- Ensure proper file paths in HTML
- Use a local server for development
- Check browser developer tools for specific error messages

---

## Getting Help

### Documentation
- [API Reference](API_REFERENCE.md) - Detailed API documentation
- [Troubleshooting Guide](TROUBLESHOOTING.md) - Additional troubleshooting steps
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project

### Support Channels
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community support and questions

### Useful Resources
- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [IndexedDB Documentation](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Progressive Web Apps Guide](https://web.dev/progressive-web-apps/)

---

## Next Steps

After successful installation:
1. Read the [User Guide](README.md) for detailed usage instructions
2. Explore the [API Reference](API_REFERENCE.md) for customization options
3. Check out [Contributing Guidelines](CONTRIBUTING.md) if you'd like to contribute
4. Review [Changelog](CHANGELOG.md) for version history and updates

---

*Last updated: January 2024*
