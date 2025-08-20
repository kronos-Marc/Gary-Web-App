# 🚀 Gary Web - Netlify Quick Deploy Guide

**Get Gary running on Netlify in 5 minutes with full Claude 3.5 Sonnet support! 🐶**

## Prerequisites
- GitHub account
- Netlify account (free)
- Anthropic API key for Claude 3.5 Sonnet (recommended)
  - Get yours at: https://console.anthropic.com/

## Step-by-Step Deployment

### 1. Prepare Your Repository
```bash
# If you don't have this code in a git repository yet:
git init
git add .
git commit -m "Initial Gary Web setup with Claude 3.5 Sonnet support"
git branch -M main
git remote add origin https://github.com/yourusername/gary-web.git
git push -u origin main
```

### 2. Deploy to Netlify
1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose "GitHub" and authorize if needed
4. Select your Gary Web repository
5. **Build settings** (leave as defaults):
   - Build command: (leave empty)
   - Publish directory: (leave empty)
6. Click "Deploy site"

### 3. Configure Claude 3.5 Sonnet
1. Once deployed, click your site URL (something like `amazing-gary-123.netlify.app`)
2. Gary should load with Anthropic/Claude as the default provider
3. Click the settings gear ⚙️
4. Select "Anthropic" as your AI provider (should be pre-selected)
5. Choose "Claude 3.5 Sonnet (Latest & Best)" as your model
6. Enter your Anthropic API key
7. Click "Save Settings"
8. Click "Test Connection" to verify everything works

### 4. Test Your Claude Integration
1. Try asking Gary: "Hello Claude! Can you help me with some coding?"
2. Gary should respond using Claude 3.5 Sonnet
3. Upload some code files and ask Gary to review them
4. Enjoy your super intelligent AI coding assistant!

## 🔥 Features That Work on Netlify with Claude
- ✅ **Claude 3.5 Sonnet**: Latest and most capable model
- ✅ **Serverless Functions**: Proxy API calls to avoid CORS
- ✅ **System Messages**: Proper Gary personality prompting
- ✅ **File Analysis**: Upload code for Claude to review
- ✅ **Modern UI**: Dark theme optimized for coding
- ✅ **Settings Persistence**: Your API key stays secure in browser

## 🎯 Why Claude 3.5 Sonnet?
- **🧠 Superior Reasoning**: Best for complex coding tasks
- **📚 Larger Context**: Handles bigger codebases
- **🔍 Better Code Analysis**: More accurate debugging and suggestions
- **⚡ Fast & Efficient**: Quick responses for productivity
- **🛡️ Safety Focused**: Responsible AI for code generation

## 🐛 Troubleshooting

**Site won't load?**
- Check the Netlify deploy logs for errors
- Ensure all files are properly committed to git

**Claude not responding?**
- Verify your Anthropic API key is correct
- Check browser console for errors
- Try the "Test Connection" button in settings
- Make sure you have credits in your Anthropic account

**Function errors?**
- Check Netlify Functions logs in your site dashboard
- Ensure the `netlify/functions` folder structure is correct
- Verify the openai-proxy.js function handles Claude properly

## 🎯 Next Steps
- Share your Gary Web URL with team members
- Upload your project files and let Claude analyze them
- Try advanced prompts like "refactor this code following SOLID principles"
- Experiment with different Claude models for different tasks
- Consider setting up custom domain (Netlify makes this easy)

**WOOF! Your Gary with Claude 3.5 Sonnet is now live on the internet! 🌐🐶🧠**