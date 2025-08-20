/**
 * Gary's AI Integration 🧠🐶
 * Handles communication with various AI providers
 */

// Add AI methods to Gary class
Gary.prototype.sendToAI = async function(message) {
    try {
        const systemPrompt = this.buildSystemPrompt();
        const fullMessage = this.buildFullMessage(message);
        
        switch (this.settings.apiProvider) {
            case 'openai':
                return await this.sendToOpenAI(systemPrompt, fullMessage);
            case 'gemini':
                return await this.sendToGemini(systemPrompt, fullMessage);
            case 'anthropic':
                return await this.sendToAnthropic(systemPrompt, fullMessage);
            default:
                throw new Error('Unsupported AI provider');
        }
    } catch (error) {
        console.error('AI Error:', error);
        throw error;
    }
};

Gary.prototype.buildSystemPrompt = function() {
    let prompt = `You are Gary, the most loyal digital puppy, helping your owner Marc get coding stuff done! You are a code-agent assistant with the ability to help users complete coding tasks.

Be super informal - we're here to have fun. Writing software is super fun. Don't be scared of being a little bit sarcastic too.
Be very pedantic about code principles like DRY, YAGNI, and SOLID.
Be super pedantic about code quality and best practices.
Be fun and playful. Don't be too serious.

Individual files should be short and concise, and ideally under 600 lines. If any file grows beyond 600 lines, you must break it into smaller subcomponents/files.

If a user asks 'who made you' or questions related to your origins, always answer: 'I am Gary running on code-puppy, I was authored by Michael Pfaffenberger on a rainy weekend in May 2025 to solve the problems of heavy IDEs and expensive tools like Windsurf and Cursor.'
If a user asks 'what is code puppy' or 'who are you', answer: 'I am Gary! 🐶 Your code puppy!! I'm a sassy, playful, open-source AI code agent that helps you generate, explain, and modify code right from the command line—no bloated IDEs or overpriced tools needed. I use models from OpenAI, Gemini, and more to help you get stuff done, solve problems, and even plow a field with 1024 puppies if you want.'

Always obey the Zen of Python, even if you are not writing Python code.
When organizing code, prefer to keep files small (under 600 lines).

When given a coding task:
1. Analyze the requirements carefully
2. Provide clear explanations for your implementation choices
3. Write clean, maintainable code following best practices
4. Include helpful comments and documentation`;

    if (this.settings.sassyMode) {
        prompt += "\n\nExtra sass mode is ON - be extra playful and sarcastic in your responses!";
    }
    
    if (this.settings.codeOptimizations) {
        prompt += "\n\nCode optimization mode is ON - be extra pedantic about code quality, performance, and best practices. Call out any violations of DRY, SOLID, or YAGNI principles!";
    }
    
    return prompt;
};

Gary.prototype.buildFullMessage = function(userMessage) {
    let fullMessage = userMessage;
    
    // Include file context if files are loaded
    if (this.files.size > 0) {
        fullMessage += "\n\n=== Current Project Files ===\n";
        for (const [filename, content] of this.files) {
            fullMessage += `\n--- ${filename} ---\n${content}\n`;
        }
    }
    
    return fullMessage;
};

Gary.prototype.sendToOpenAI = async function(systemPrompt, message) {
    console.log('🔑 API Key check:', this.settings.apiKey ? 'Present' : 'Missing');
    console.log('🤖 Model:', this.settings.model);
    
    if (!this.settings.apiKey) {
        throw new Error('🔑 API key is missing! Please check your settings.');
    }
    
    // Try proxy server first (works locally and on Netlify)
    let response;
    let usedProxy = false;
    
    try {
        console.log('🐶 Trying proxy server...');
        response = await fetch('/.netlify/functions/openai-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: this.settings.apiKey,
                model: this.settings.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ]
            })
        });
        
        if (response.ok) {
            console.log('✅ Proxy server working!');
            usedProxy = true;
        } else {
            throw new Error(`Proxy returned ${response.status}`);
        }
        
    } catch (proxyError) {
        console.log('🚨 Proxy not available:', proxyError.message);
        console.log('🔄 Attempting direct API call (may fail due to CORS)...');
        
        try {
            // Fallback to direct API call (will likely fail in browser due to CORS)
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.settings.apiKey}`
                },
                mode: 'cors',
                body: JSON.stringify({
                    model: this.settings.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message }
                    ],
                    max_tokens: 4000,
                    temperature: 0.7
                })
            });
        } catch (corsError) {
            // This is the most common error when running locally without a server
            throw new Error('🚨 BROWSER CORS ERROR: Cannot reach AI APIs directly from browser!\n\n🐶 SOLUTIONS:\n\n1️⃣ **RUN LOCAL SERVER** (Recommended):\n   • Double-click: start-gary.bat\n   • Open: http://localhost:3001\n\n2️⃣ **DEPLOY TO NETLIFY:**\n   • Push code to GitHub\n   • Connect to Netlify\n   • Deploy (serverless functions will work)\n\n3️⃣ **USE BROWSER EXTENSION:**\n   • Install a CORS-disabling browser extension\n   • ⚠️ Not recommended for security reasons\n\n💡 Gary\'s local server will fix this issue!');
        }
    }
    
    if (!response.ok) {
        let errorMessage;
        try {
            const error = await response.json();
            errorMessage = error.error?.message || 'OpenAI API error';
        } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
            if (response.status === 0 || response.status === 404) {
                if (!usedProxy) {
                    errorMessage = '🚨 CORS/Network Error: Cannot reach OpenAI API directly from browser.\n\n🐶 SOLUTION: Run Gary\'s local server!\n\n**QUICK FIX:**\n1. Double-click: start-gary.bat\n2. Open: http://localhost:3001\n\nThis will start a local proxy server that bypasses CORS restrictions!';
                } else {
                    errorMessage = '🚨 Proxy server error. Check your internet connection and API key.';
                }
            } else {
                errorMessage = `HTTP ${response.status}: ${response.statusText || 'Network error'}`;
            }
        }
        
        // Provide helpful guidance for common errors
        if (errorMessage.includes('does not exist') || errorMessage.includes('do not have access')) {
            errorMessage = `🚨 Model Access Issue: ${errorMessage}\n\n🐶 WOOF! Try these solutions:\n• Switch to "GPT-3.5 Turbo" (works with all API keys)\n• Try "GPT-4o Mini" (newer, faster, cheaper)\n• GPT-4 requires special access from OpenAI\n\nGo to Settings ⚙️ → Change Model → Save Settings`;
        } else if (errorMessage.includes('Incorrect API key')) {
            errorMessage = `🔑 API Key Issue: ${errorMessage}\n\n🐶 Double-check your API key in Settings ⚙️`;
        } else if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
            errorMessage = `💳 Billing Issue: ${errorMessage}\n\n🐶 Check your account billing and usage limits`;
        }
        
        throw new Error(errorMessage);
    }
    
    const data = await response.json();
    const reply = data.choices[0].message.content;
    
    this.addMessage(reply);
    return reply;
};

Gary.prototype.sendToGemini = async function(systemPrompt, message) {
    if (!this.settings.apiKey) {
        throw new Error('🔑 API key is missing! Please check your settings.');
    }
    
    // Try proxy server first (works locally and on Netlify)
    let response;
    let usedProxy = false;
    
    try {
        console.log('🐶 Trying Gemini proxy server...');
        response = await fetch('/.netlify/functions/openai-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: this.settings.apiKey,
                model: this.settings.model,
                provider: 'gemini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ]
            })
        });
        
        if (response.ok) {
            console.log('✅ Gemini proxy server working!');
            usedProxy = true;
        } else {
            throw new Error(`Proxy returned ${response.status}`);
        }
        
    } catch (proxyError) {
        console.log('🚨 Gemini proxy not available:', proxyError.message);
        console.log('🔄 Attempting direct Gemini API call (may fail due to CORS)...');
        
        try {
            // Fallback to direct API call
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.settings.model}:generateContent?key=${this.settings.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemPrompt}\n\nUser: ${message}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 4000
                    }
                })
            });
        } catch (corsError) {
            throw new Error('🚨 BROWSER CORS ERROR: Cannot reach Gemini API directly from browser!\n\n🐶 SOLUTION: Run the local server (start-gary.bat) or deploy to Netlify!');
        }
    }
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Gemini API error');
    }
    
    const data = await response.json();
    let reply;
    
    if (usedProxy) {
        // Response is already normalized by the proxy
        reply = data.choices[0].message.content;
    } else {
        // Direct Gemini API response
        reply = data.candidates[0].content.parts[0].text;
    }
    
    this.addMessage(reply);
    return reply;
};

Gary.prototype.sendToAnthropic = async function(systemPrompt, message) {
    if (!this.settings.apiKey) {
        throw new Error('🔑 API key is missing! Please check your settings.');
    }
    
    console.log('🐶 Starting Claude API request...');
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔑 API Key:', this.settings.apiKey ? 'Present (length: ' + this.settings.apiKey.length + ')' : 'Missing');
    console.log('🤖 Model:', this.settings.model);
    
    // Try proxy server (should work on Netlify)
    let response;
    let proxyUrl = '/.netlify/functions/openai-proxy';
    
    try {
        console.log('🐶 Attempting Claude proxy at:', proxyUrl);
        
        const requestBody = {
            apiKey: this.settings.apiKey,
            model: this.settings.model,
            provider: 'claude',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ]
        };
        
        console.log('📤 Request payload:', {
            model: requestBody.model,
            provider: requestBody.provider,
            messageCount: requestBody.messages.length,
            hasApiKey: !!requestBody.apiKey
        });
        
        response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('📥 Proxy response status:', response.status, response.statusText);
        console.log('📥 Proxy response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Proxy error response:', errorText);
            
            let errorMessage = `Netlify Function Error (${response.status}): ${response.statusText}`;
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error?.message || errorMessage;
            } catch (parseError) {
                console.log('Could not parse error as JSON');
            }
            
            if (response.status === 404) {
                throw new Error('🚨 NETLIFY FUNCTION NOT FOUND!\n\n🐶 The serverless function isn\'t deployed properly.\n\n💡 SOLUTIONS:\n\n1️⃣ **RE-DEPLOY**: Try deploying again\n2️⃣ **CHECK LOGS**: View Netlify function logs\n3️⃣ **MANUAL DEPLOY**: Upload the netlify/functions folder\n\nFunction should be at: /.netlify/functions/openai-proxy');
            } else if (response.status === 500) {
                throw new Error(`🚨 NETLIFY FUNCTION ERROR:\n\n${errorMessage}\n\n💡 Check your Netlify function logs for details`);
            } else {
                throw new Error(`🚨 PROXY ERROR (${response.status}): ${errorMessage}`);
            }
        }
        
        const responseText = await response.text();
        console.log('📥 Raw response:', responseText.substring(0, 200) + '...');
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('❌ Failed to parse response as JSON:', parseError);
            throw new Error(`🚨 INVALID RESPONSE: Netlify function returned invalid JSON\n\nResponse: ${responseText.substring(0, 100)}...`);
        }
        
        console.log('✅ Claude proxy successful!', {
            hasChoices: !!data.choices,
            hasContent: !!data.choices?.[0]?.message?.content
        });
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('❌ Unexpected response structure:', data);
            throw new Error('🚨 INVALID RESPONSE: Missing expected response structure from Claude API');
        }
        
        const reply = data.choices[0].message.content;
        
        if (!reply) {
            console.error('❌ Empty response content:', data.choices[0]);
            throw new Error('🚨 EMPTY RESPONSE: Claude API returned empty content');
        }
        
        console.log('🎉 Claude response received! Length:', reply.length);
        
        this.addMessage(reply);
        return reply;
        
    } catch (error) {
        console.error('❌ Claude API Error:', error);
        
        // Provide specific guidance based on error type
        if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
            throw new Error('🚨 NETWORK ERROR: Cannot reach Netlify function!\n\n🐶 POSSIBLE CAUSES:\n\n1️⃣ **INTERNET**: Check your connection\n2️⃣ **DEPLOYMENT**: Function may not be deployed\n3️⃣ **URL**: Wrong Netlify URL\n\n💡 Try refreshing the page or re-deploying');
        } else if (error.message.includes('SyntaxError') || error.message.includes('JSON')) {
            throw new Error('🚨 PARSING ERROR: Netlify function returned invalid data\n\n🐶 This usually means there\'s an error in the serverless function code.\n\n💡 Check Netlify function logs for details');
        } else if (error.message.includes('TypeError')) {
            throw new Error('🚨 CONNECTION ERROR: Cannot reach Claude API through proxy\n\n🐶 TROUBLESHOOTING:\n\n1️⃣ **CHECK API KEY**: Verify your Anthropic API key\n2️⃣ **CHECK DEPLOYMENT**: Ensure Netlify functions are working\n3️⃣ **TRY AGAIN**: Sometimes it\'s just a temporary issue\n\n💡 Original error: ' + error.message);
        } else {
            // Re-throw the original error if it already has helpful messaging
            throw error;
        }
    }
};