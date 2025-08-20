/**
 * Gary's Core Functionality 🐶
 * Main UI interactions, settings management, and core features
 */

class Gary {
    constructor() {
        this.settings = {
            apiProvider: 'anthropic',
            apiKey: '',
            model: 'claude-3-5-sonnet-20241022',
            sassyMode: true,
            puppyEmojis: true,
            codeOptimizations: true,
            theme: 'dark'
        };
        
        this.files = new Map();
        this.currentFile = null;
        this.conversationHistory = [];
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        // updateApiConfig will be called after DOM is loaded
        console.log('🐶 WOOF! Gary is ready to help with your code!');
    }
    
    loadSettings() {
        const saved = localStorage.getItem('gary-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.updateSettingsUI();
        }
    }
    
    saveSettings() {
        localStorage.setItem('gary-settings', JSON.stringify(this.settings));
    }
    
    updateSettingsUI() {
        document.getElementById('apiProvider').value = this.settings.apiProvider;
        document.getElementById('apiKey').value = this.settings.apiKey;
        document.getElementById('model').value = this.settings.model;
        document.getElementById('sassyMode').checked = this.settings.sassyMode;
        document.getElementById('puppyEmojis').checked = this.settings.puppyEmojis;
        document.getElementById('codeOptimizations').checked = this.settings.codeOptimizations;
    }
    
    setupEventListeners() {
        // File upload
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
        
        // Settings changes
        document.getElementById('sassyMode').addEventListener('change', (e) => {
            this.settings.sassyMode = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('puppyEmojis').addEventListener('change', (e) => {
            this.settings.puppyEmojis = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('codeOptimizations').addEventListener('change', (e) => {
            this.settings.codeOptimizations = e.target.checked;
            this.saveSettings();
        });
        
        // Apply saved theme
        this.applyTheme(this.settings.theme);
    }
    
    addMessage(content, isUser = false) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = isUser ? '👤' : '🐶';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (isUser) {
            messageContent.innerHTML = `<strong>You:</strong> ${this.escapeHtml(content)}`;
        } else {
            messageContent.innerHTML = this.formatAssistantMessage(content);
        }
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Syntax highlighting
        Prism.highlightAll();
    }
    
    formatAssistantMessage(content) {
        // Add Gary's personality
        let formattedContent = content;
        
        if (this.settings.puppyEmojis) {
            // Add some puppy flair
            formattedContent = formattedContent.replace(/\bWOOF\b/g, '🐶 WOOF');
            formattedContent = formattedContent.replace(/\bwoof\b/g, '🐶 woof');
        }
        
        // Format code blocks
        formattedContent = formattedContent.replace(
            /```(\w+)?\n([\s\S]*?)```/g,
            '<pre><code class="language-$1">$2</code></pre>'
        );
        
        // Format inline code
        formattedContent = formattedContent.replace(
            /`([^`]+)`/g,
            '<code>$1</code>'
        );
        
        // Format bold text
        formattedContent = formattedContent.replace(
            /\*\*([^*]+)\*\*/g,
            '<strong>$1</strong>'
        );
        
        // Convert newlines to breaks
        formattedContent = formattedContent.replace(/\n/g, '<br>');
        
        return `<strong>Gary:</strong> ${formattedContent}`;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showLoading(show = true) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'flex' : 'none';
    }
    
    showError(message) {
        this.addMessage(`🚨 Oops! ${message}\n\nMake sure your API key is configured correctly in settings.`);
    }
    
    applyTheme(theme) {
        // Remove all theme classes
        document.body.classList.remove('light-theme', 'blue-theme', 'purple-theme', 'green-theme');
        
        // Apply new theme
        if (theme !== 'dark') {
            document.body.classList.add(`${theme}-theme`);
        }
        
        this.settings.theme = theme;
        this.saveSettings();
    }
}

// Global Gary instance
let gary = null;

// UI Functions
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('open');
}

function updateApiConfig() {
    const provider = document.getElementById('apiProvider').value;
    const modelSelect = document.getElementById('model');
    
    // Clear existing options
    modelSelect.innerHTML = '';
    
    // Add provider-specific models
    const models = {
        openai: [
            { value: 'gpt-4o', text: 'GPT-4o (Default - Advanced)' },
            { value: 'gpt-4o-mini', text: 'GPT-4o Mini (Fast & Cheap)' },
            { value: 'gpt-3.5-turbo', text: 'GPT-3.5 Turbo (Budget Option)' },
            { value: 'gpt-4', text: 'GPT-4 (Legacy - Requires Access)' }
        ],
        gemini: [
            { value: 'gemini-pro', text: 'Gemini Pro' },
            { value: 'gemini-pro-vision', text: 'Gemini Pro Vision' }
        ],
        anthropic: [
            { value: 'claude-3-5-sonnet-20241022', text: 'Claude 3.5 Sonnet (Latest & Best)' },
            { value: 'claude-3-5-haiku-20241022', text: 'Claude 3.5 Haiku (Fast & Efficient)' },
            { value: 'claude-3-opus-20240229', text: 'Claude 3 Opus (Most Capable)' },
            { value: 'claude-3-sonnet-20240229', text: 'Claude 3 Sonnet (Balanced)' },
            { value: 'claude-3-haiku-20240307', text: 'Claude 3 Haiku (Fast)' }
        ]
    };
    
    models[provider].forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.text;
        modelSelect.appendChild(option);
    });
}

function saveApiConfig() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const apiProvider = document.getElementById('apiProvider').value;
    const model = document.getElementById('model').value;
    
    if (!apiKey) {
        gary.addMessage('⚠️ Please enter an API key before saving!');
        return;
    }
    
    gary.settings.apiProvider = apiProvider;
    gary.settings.apiKey = apiKey;
    gary.settings.model = model;
    gary.saveSettings();
    
    console.log('✅ Settings saved:', {
        provider: apiProvider,
        model: model,
        keyLength: apiKey.length
    });
    
    gary.addMessage(`🎯 Settings saved! Provider: ${apiProvider}, Model: ${model}\n\n⚠️ NOTE: This web app may have CORS limitations when calling AI APIs directly from the browser. If you get connection errors, you may need to run this through a backend server or use it on a platform like Netlify with serverless functions.`);
    toggleSettings();
}

function testApiConnection() {
    if (!gary.settings.apiKey) {
        gary.showError('Please enter an API key first!');
        return;
    }
    
    gary.addMessage(`🧪 Testing connection to ${gary.settings.apiProvider} using model: ${gary.settings.model}...`);
    
    gary.showLoading();
    gary.sendToAI('Test connection - respond with "WOOF! Connection successful!" and tell me which AI model you are.')
        .then(() => {
            gary.showLoading(false);
            gary.addMessage('✅ Test successful! Gary is ready to help with your coding tasks!');
        })
        .catch(error => {
            gary.showLoading(false);
            gary.showError(`Connection failed: ${error.message}`);
        });
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    console.log('🐶 Send button clicked!');
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    console.log('Message:', message);
    
    if (!message) {
        console.log('Empty message, returning');
        return;
    }
    
    if (!gary) {
        console.error('Gary not initialized!');
        alert('Gary is not ready yet. Please refresh the page.');
        return;
    }
    
    if (!gary.settings.apiKey) {
        console.log('No API key configured - using test mode');
        // Test mode - simulate a response
        gary.addMessage(`🎾 WOOF! I got your message: "${message}"\n\nBut I need an API key to give you a real response! Please:\n1. Click the settings gear ⚙️ in the top right\n2. Choose your AI provider\n3. Enter your API key\n4. Save settings\n\nThen I'll be ready to help with all your coding needs!`);
        return;
    }
    
    console.log('Sending message to AI...');
    
    // Add user message
    gary.addMessage(message, true);
    input.value = '';
    
    // Show loading and send to AI
    gary.showLoading();
    
    if (typeof gary.sendToAI !== 'function') {
        console.error('sendToAI method not available!');
        gary.showLoading(false);
        gary.showError('AI integration not loaded. Please refresh the page.');
        return;
    }
    
    gary.sendToAI(message)
        .then(() => {
            console.log('AI response received');
            gary.showLoading(false);
        })
        .catch(error => {
            console.error('AI Error:', error);
            gary.showLoading(false);
            gary.showError(error.message || 'Unknown error occurred');
        });
}

// Theme cycling function
function toggleTheme() {
    const themes = ['dark', 'light', 'blue', 'purple', 'green'];
    const currentIndex = themes.indexOf(gary.settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    gary.applyTheme(nextTheme);
    
    // Show notification
    const themeName = nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1);
    gary.addMessage(`🎨 Theme changed to: ${themeName} Theme! 🐶`);
}

// Initialize Gary when page loads
document.addEventListener('DOMContentLoaded', () => {
    gary = new Gary();
    updateApiConfig(); // Initialize the API config dropdown
});