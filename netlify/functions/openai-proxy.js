// Gary Web API Proxy - Netlify Serverless Function 🐶
// Handles OpenAI, Gemini, and Claude API requests with CORS support

exports.handler = async (event, context) => {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: ''
        };
    }
    
    // Only allow POST requests for API calls
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: { message: 'Method not allowed' } })
        };
    }
    
    try {
        const requestData = JSON.parse(event.body);
        const { apiKey, model, messages, provider } = requestData;
        
        console.log('🐶 Gary Proxy Request:', {
            provider: provider || 'openai',
            model: model || 'auto',
            hasApiKey: !!apiKey,
            messageCount: messages?.length || 0
        });
        
        if (!apiKey) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: { message: '🔑 API key is required for the proxy' } 
                })
            };
        }
        
        if (!messages || !Array.isArray(messages)) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: { message: 'Messages array is required' } 
                })
            };
        }
        
        // Determine which API to call based on model or provider
        let apiUrl, headers, payload;
        
        if (provider === 'gemini' || model?.includes('gemini')) {
            // Google Gemini API
            apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
            headers = {
                'Content-Type': 'application/json'
            };
            
            // Convert OpenAI format to Gemini format
            const parts = messages.map(msg => ({
                text: msg.content
            }));
            
            payload = {
                contents: [{
                    parts: parts
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4000
                }
            };
        } else if (provider === 'claude' || model?.includes('claude')) {
            // Anthropic Claude API
            apiUrl = 'https://api.anthropic.com/v1/messages';
            headers = {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            };
            
            // Separate system message from user messages for Claude
            const systemMessage = messages.find(msg => msg.role === 'system');
            const userMessages = messages.filter(msg => msg.role !== 'system');
            
            payload = {
                model: model || 'claude-3-5-sonnet-20241022',
                max_tokens: 4000,
                temperature: 0.7,
                messages: userMessages
            };
            
            // Add system message if present
            if (systemMessage) {
                payload.system = systemMessage.content;
            }
        } else {
            // OpenAI API (default)
            apiUrl = 'https://api.openai.com/v1/chat/completions';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            
            payload = {
                model: model || 'gpt-4o',
                messages: messages,
                max_tokens: 4000,
                temperature: 0.7
            };
        }
        
        console.log(`🚀 Making request to ${provider || 'openai'} API...`);
        
        // Make the API request
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.log(`❌ API Error (${response.status}):`, data);
            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: data })
            };
        }
        
        console.log('✅ API Success!');
        
        // Normalize response format for different providers
        let normalizedResponse;
        
        if (provider === 'gemini' || model?.includes('gemini')) {
            // Convert Gemini response to OpenAI format
            normalizedResponse = {
                choices: [{
                    message: {
                        role: 'assistant',
                        content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini'
                    }
                }],
                usage: {
                    prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
                    completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
                    total_tokens: data.usageMetadata?.totalTokenCount || 0
                }
            };
        } else if (provider === 'claude' || model?.includes('claude')) {
            // Convert Claude response to OpenAI format
            normalizedResponse = {
                choices: [{
                    message: {
                        role: 'assistant',
                        content: data.content?.[0]?.text || 'No response from Claude'
                    }
                }],
                usage: {
                    prompt_tokens: data.usage?.input_tokens || 0,
                    completion_tokens: data.usage?.output_tokens || 0,
                    total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
                }
            };
        } else {
            // OpenAI format (already normalized)
            normalizedResponse = data;
        }
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(normalizedResponse)
        };
        
    } catch (error) {
        console.error('❌ Gary Proxy Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                error: { 
                    message: `Proxy error: ${error.message}`,
                    type: 'proxy_error'
                } 
            })
        };
    }
};