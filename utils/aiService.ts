import OpenAI from 'openai';
import { AYURVEDA_SYSTEM_PROMPT } from '../config/aiPrompt';
import { supabase } from './supabase';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

class AIService {
  private static instance: AIService;
  private openai: OpenAI;
  private conversationHistory: ChatMessage[] = [];
  private userName: string | null = null;
  private isFirstInteraction: boolean = true;

  private constructor() {
    const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error('OpenRouter API key not found. Please check your .env.local file.');
      throw new Error('OpenRouter API key is required');
    }

    console.log('Initializing AI Service with API key:', apiKey.substring(0, 10) + '...');

    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:8081", // Localhost for development
        "X-Title": "VedaRogya AI",
      },
    });

    // Initialize with system prompt (will be updated with user name)
    this.conversationHistory.push({
      id: this.generateId(),
      role: 'system',
      content: AYURVEDA_SYSTEM_PROMPT,
      timestamp: new Date()
    });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      try {
        AIService.instance = new AIService();
        console.log('AI Service initialized successfully with Ayurveda system prompt');
      } catch (error) {
        console.error('Failed to initialize AI Service:', error);
        throw error;
      }
    }
    return AIService.instance;
  }

  private async fetchUserName(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      // Fetch user's full name from the users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user name:', error);
        return null;
      }

      if (userData && userData.full_name) {
        console.log('Fetched user name:', userData.full_name);
        return userData.full_name;
      }

      return null;
    } catch (error) {
      console.error('Error in fetchUserName:', error);
      return null;
    }
  }

  private updateSystemPromptWithUserName(userName: string | null): void {
    // Find and update the system prompt with the user's name
    const systemMessage = this.conversationHistory.find(msg => msg.role === 'system');
    if (systemMessage) {
      if (userName) {
        // Replace the system prompt with one that includes the user's name
        systemMessage.content = AYURVEDA_SYSTEM_PROMPT.replace(/\${userName}/g, userName);
        console.log('Updated system prompt with user name:', userName);
      } else {
        // Use default system prompt without user name
        systemMessage.content = AYURVEDA_SYSTEM_PROMPT.replace(/\${userName}/g, 'Seeker');
        console.log('Using default system prompt without user name');
      }
    }
  }

  private createFirstResponsePrompt(userMessage: string): string {
    const userName = this.userName || 'Seeker';
    const greetings = [
      `🌸 Namaste ${userName}! How may I guide you on your wellness path today?`,
      `🙏 Namaskar ${userName}! Wishing you harmony of body, mind, and spirit.`,
      `🌿 Namo vaḥ ${userName}! I'm here to share Ayurveda and Yoga wisdom for your balance.`
    ];
    
    // Randomly select a greeting
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    return `${greeting}\n\n${userMessage}`;
  }

  public async sendMessage(userMessage: string): Promise<string> {
    try {
      console.log('Sending message to AI:', userMessage);

      // Fetch user name if not already fetched
      if (this.userName === null) {
        this.userName = await this.fetchUserName();
        this.updateSystemPromptWithUserName(this.userName);
      }

      const userMsg: ChatMessage = {
        id: this.generateId(),
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      this.conversationHistory.push(userMsg);

      // Prepare messages for API call
      let messages = this.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // If this is the first interaction, modify the user message to include greeting
      if (this.isFirstInteraction) {
        const firstResponsePrompt = this.createFirstResponsePrompt(userMessage);
        messages = [
          { role: 'system', content: messages[0].content },
          { role: 'user', content: firstResponsePrompt }
        ];
        this.isFirstInteraction = false;
      }

      console.log('Calling OpenRouter API with messages:', messages.length);
      console.log('System prompt included:', messages[0].content.substring(0, 100) + '...');

      const completion = await this.openai.chat.completions.create({
        model: "meta-llama/llama-3-8b-instruct",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

      console.log('AI Response received:', aiResponse.substring(0, 100) + '...');

      const aiMsg: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      this.conversationHistory.push(aiMsg);

      return aiResponse;
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);

      const errorMessage: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your internet connection and try again. If the problem persists, please restart the app.',
        timestamp: new Date()
      };
      this.conversationHistory.push(errorMessage);

      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  public getConversationHistory(): ChatMessage[] {
    // Return all messages except system prompt for display
    return this.conversationHistory.filter(msg => msg.role !== 'system');
  }

  public clearConversation(): void {
    // Keep system prompt, clear only user and assistant messages
    const systemPrompt = this.conversationHistory.find(msg => msg.role === 'system');
    this.conversationHistory = systemPrompt ? [systemPrompt] : [];
    this.isFirstInteraction = true; // Reset first interaction flag
    console.log('Conversation history cleared (system prompt preserved)');
  }

  public getMessageCount(): number {
    // Count only user and assistant messages
    return this.conversationHistory.filter(msg => msg.role !== 'system').length;
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

export default AIService;
