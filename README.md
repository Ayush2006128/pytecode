# PyteCode - Python Playground

A modern, in-browser Python code editor and playground powered by Pyodide. Write, run, and experiment with Python code directly in your browser - no backend required!

## ✨ Features

- 🐍 **Real Python Execution** - Run Python code directly in your browser using Pyodide
- 📦 **Pre-loaded Libraries** - numpy and pandas are ready to use
- 💾 **Code Saving** - Download your code as .py files with automatic date formatting
- 🎨 **Beautiful UI** - Modern design with glass morphism effects and smooth animations
- 📱 **Progressive Web App** - Install as a native app on any device
- ⚡ **Fast & Responsive** - Monaco Editor for a VS Code-like editing experience
- 🔒 **Privacy-First** - All code execution happens in your browser, nothing is sent to servers

## 🚀 Quick Start

Simply visit the app and start coding! The Python environment loads automatically with numpy and pandas.

### Controls

- **Run Code** - Execute your Python code (Ctrl/Cmd + Enter)
- **Reset** - Restore the default example code
- **Clear All** - Remove all code and output
- **Save** - Download your code as `pytecodeDDMM.py`

## 🛠️ Tech Stack

- **React** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Pyodide** - Python runtime for the browser
- **Monaco Editor** - Professional code editor
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components

## 📦 Libraries Included

- **numpy** - Numerical computing
- **pandas** - Data analysis and manipulation

## 🏗️ Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📱 PWA Installation

PyteCode can be installed as a Progressive Web App on any device:

1. Visit the app in your browser
2. Click the "Install" button in the header
3. Follow your browser's installation prompts
4. Launch PyteCode as a native app!

## 🤖 TWA (Trusted Web Activity) Setup

PyteCode includes support for Android Trusted Web Activity (TWA). The `assetlinks.json` file has been created at `public/.well-known/assetlinks.json`.

### To configure your TWA:

1. **Update the assetlinks.json file** with your Android app details:
   - Replace `com.yourcompany.pytecode` with your actual Android package name
   - Replace `YOUR_SHA256_FINGERPRINT_HERE` with your app's SHA-256 certificate fingerprint

2. **Get your SHA-256 fingerprint:**
   ```bash
   # For debug keystore
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   
   # For release keystore
   keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
   ```

3. **The file will be automatically served at:**
   `https://yourdomain.com/.well-known/assetlinks.json`

4. **Test your asset links:**
   ```bash
   digital assetlinks validate \
     --site https://yourdomain.com \
     --app com.yourcompany.pytecode
   ```

5. **For Chrome on Android, ensure Digital Asset Links are verified:**
   - Your Android app must reference your web app's URL
   - The digital asset links file must be accessible and valid

## 🎯 Use Cases

- **Learning Python** - Practice Python syntax and concepts
- **Quick Prototyping** - Test code snippets without setting up an environment
- **Data Analysis** - Experiment with numpy and pandas
- **Code Sharing** - Save and share Python scripts
- **Offline Coding** - Works offline after first load (PWA)

## 🔧 Project Configuration

Built with Lovable's modern stack:
- Vite for fast builds
- TypeScript for type safety
- React for reactive UI
- Tailwind CSS for styling
- PWA support for offline functionality

## 📝 License

This project is built with Lovable.

## 🤝 Contributing

This is a Lovable project. To make changes:

1. **Use Lovable** - Simply prompt in the [Lovable Project](https://lovable.dev/projects/75675fd6-ad7e-4a54-8b64-f7d3142560e0)
2. **Use your IDE** - Clone, make changes, and push
3. **Edit on GitHub** - Make changes directly in the browser

## 🔗 Links

- [Live App](https://lovable.dev/projects/75675fd6-ad7e-4a54-8b64-f7d3142560e0)
- [Lovable Documentation](https://docs.lovable.dev)
- [Pyodide Documentation](https://pyodide.org)
