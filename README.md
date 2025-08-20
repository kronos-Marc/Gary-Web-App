# Gary 🐶 - Web Version

**Your sassy, playful AI code assistant - now in your browser!**

> **🚨 CORS ISSUE FIXED!** - I've added a local development server to solve API connectivity issues.

Gary is an open-source AI code agent that helps you generate, explain, and modify code right from your web browser. No bloated IDEs or expensive subscriptions needed!

## ✨ Features

🎯 **Multi-AI Provider Support**
- OpenAI (GPT-4, GPT-3.5)
- Google Gemini 
- Anthropic Claude
- Easy API key configuration

🗂️ **File Management**
- Upload and manage project files
- Built-in code editor with syntax highlighting
- Download modified files
- Support for all major programming languages

💬 **Intelligent Chat Interface**
- Natural language code assistance
- Code explanation and debugging
- Best practices enforcement (DRY, SOLID, YAGNI)
- Sassy personality with helpful guidance

🎨 **Modern UI**
- Dark theme optimized for coding
- Responsive design (mobile-friendly)
- Syntax highlighting with Prism.js
- Smooth animations and transitions

## 🚀 Quick Start

### **Option 1: Run Local Server (Recommended & Easiest)**
```bash
# Install dependencies (only needed once)
npm install

# Start Gary's local development server
npm start

# Open your browser to:
http://localhost:3000
```

**Why use Gary's local server?**
- ✅ **Fixes CORS issues** - No more "Failed to fetch" errors!
- ✅ **Works with all AI providers** (OpenAI, Gemini, Claude)
- ✅ **Same functionality** as deployed version
- ✅ **Secure API key handling** through proxy
- ✅ **Easy setup** - just `npm install` and `npm start`

### **Option 2: Deploy to Netlify (Production)**

1. **Get an API Key**
   - OpenAI: https://platform.openai.com/api-keys
   - Google Gemini: https://makersuite.google.com/app/apikey
   - Anthropic: https://console.anthropic.com/

2. **Deploy to Netlify**
   - Fork/clone this repository to GitHub
   - Connect your GitHub repository to Netlify
   - Deploy with default settings (Netlify Functions will be auto-configured)
   - Your app will be live at yourname.netlify.app

3. **Configure Gary**
   - Click the settings gear ⚙️ in the top right
   - Select your AI provider (Anthropic recommended for Claude 3.5 Sonnet)
   - Enter your API key
   - Save settings

4. **Start Coding!**
   - Upload files or start fresh
   - Ask Gary anything: "create a React component", "debug this Python code", etc.
   - Let Gary help you write better code!

## 💡 Example Prompts

- "Create a responsive navbar component in React"
- "Explain what this JavaScript function does"
- "Refactor this Python code to follow best practices"
- "Help me debug this CSS layout issue"
- "Write unit tests for this function"
- "Convert this jQuery code to vanilla JavaScript"

## 🔧 Gary's Personality Settings

- **Extra Sassy Mode**: More playful and sarcastic responses
- **Puppy Emojis**: Add cute emojis throughout responses  
- **Pedantic Code Reviews**: Extra strict about code quality and best practices

## 📱 Mobile Support

Gary works great on mobile devices! The responsive design adapts to smaller screens while maintaining full functionality.

## 🔒 Privacy & Security

- API keys are stored locally in your browser
- No data is sent to Gary's servers
- Direct communication with AI providers
- All file processing happens client-side

## 🌟 Why Gary?

- **Open Source**: No vendor lock-in or subscription fees
- **Multi-Provider**: Switch between AI models easily
- **Lightweight**: No heavy IDE installation required
- **Fast**: Optimized for quick iterations
- **Fun**: Coding should be enjoyable!

## 🐛 Troubleshooting

**"Failed to fetch" or Connection Errors?**
- **✅ SOLUTION**: Use Gary's local server! Run `npm install` then `npm start`
- **Most Common**: CORS issue - resolved by the local server
- Don't open the HTML file directly (`file://`) - use the local server instead
- Check your API key in settings
- Try the "Test Connection" button

**Gary not responding?**
- Verify you have internet connection
- Check browser console for error messages
- Make sure you're using a supported model for your API key

**Upload issues?**
- Ensure files are under 10MB
- Check file format is supported
- Try refreshing the page

## 🤝 Contributing

Gary is open source! Visit the [code-puppy repository](https://github.com/mpfaffenberger/code-puppy) to contribute.

## 📄 License

MIT License - Feel free to use Gary in your projects!

---

*Created with ❤️ by Michael Pfaffenberger on a rainy weekend in May 2025*

**WOOF! Happy coding! 🐶🎾**