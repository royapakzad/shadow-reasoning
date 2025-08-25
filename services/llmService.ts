
import OpenAI from "openai";
import { LLMModelType } from '../types/index';
import { AVAILABLE_MODELS } from '../constants/index';
import * as config from '../env.js'; // Import API keys from env.js

// Caching initialized clients to avoid re-creation on every call
let togetherAi: OpenAI | null = null;

/**
 * Initializes the Together.ai client if not already initialized.
 * @throws {Error} if the API key is missing or a placeholder.
 */
const initializeTogetherAI = () => {
  if (togetherAi) return;
  const apiKey = config.TOGETHER_API_KEY;
  if (!apiKey || (apiKey as string) === "YOUR_TOGETHER_AI_KEY_HERE") {
    console.error("Together AI API key is not defined or is a placeholder.");
    throw new Error("TOGETHER_API_KEY_MISSING_OR_PLACEHOLDER");
  }
  togetherAi = new OpenAI({ 
      apiKey, 
      baseURL: 'https://api.together.xyz/v1',
      dangerouslyAllowBrowser: true 
  });
  console.log("Together AI client initialized.");
};

/**
 * Gets the provider ('togetherai') for a given model ID.
 * @param modelId The full model ID (e.g., 'togetherai/openai/gpt-oss-20b').
 * @returns The provider name.
 * @throws {Error} if the model ID is not found.
 */
const getModelProvider = (modelId: LLMModelType) => {
    const modelDefinition = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (!modelDefinition) {
        throw new Error(`Model ID ${modelId} not found in AVAILABLE_MODELS.`);
    }
    return modelDefinition.provider;
};

/**
 * Generates a response from the specified LLM.
 * @param prompt The user prompt.
 * @param modelId The model to use.
 * @param providerConfig Optional provider-specific configuration.
 * @returns The LLM's text response as a string.
 */
export const generateLlmResponse = async (prompt: string, modelId: LLMModelType, providerConfig?: any): Promise<string> => {
  if (!prompt.trim()) {
    console.warn("Empty prompt provided to generateLlmResponse.");
    return ""; 
  }

  const provider = getModelProvider(modelId);
  const actualModelId = modelId.substring(modelId.indexOf('/') + 1);

  try {
    if (provider === 'togetherai') {
        initializeTogetherAI();
        if (!togetherAi) throw new Error("Together.ai client not initialized.");
        
        const messages: any[] = [];
        if (providerConfig?.systemInstruction) {
            messages.push({ role: "system", content: providerConfig.systemInstruction });
        }
        messages.push({ role: "user", content: prompt });
        
        const response = await togetherAi.chat.completions.create({ model: actualModelId, messages });
        return response.choices[0]?.message?.content?.trim() || `No text content received from Together.ai. Finish reason: ${response.choices[0]?.finish_reason || 'N/A'}.`;
    } else {
      throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error with provider ${provider}:`, error);
    let errorMessage = `Failed to get response from ${provider}.`;
    if (error instanceof Error) {
        if (error.message.includes("_API_KEY_MISSING_OR_PLACEHOLDER")) {
            errorMessage = `API key for ${provider} is missing or is a placeholder in env.js.`;
        } else if ((error as any).status === 401 || error.message?.toLowerCase().includes('api key')) {
            errorMessage = `API key for ${provider} is not valid. Please check it. Original error: ${error.message}`;
        } else if ((error as any).status === 429) {
            errorMessage = `${provider} API Error (429): Rate limit or quota exceeded. Please check your account plan and usage.`;
        } else {
            errorMessage = `An unexpected error occurred with ${provider}: ${error.message}`;
        }
    } else {
        errorMessage = `An unknown error occurred with ${provider}: ${String(error)}`;
    }
    throw new Error(errorMessage);
  }
};


/**
 * Parses a string response from an LLM that is structured with markdown headers.
 * @param responseText The raw text from the LLM.
 * @param headers An array of header strings to look for (e.g., ['## Expert Trace', '## Final Answer']).
 * @returns A record mapping the header key (e.g., 'expertTrace') to its content.
 */
export const parseLlmSections = (responseText: string, headers: {key: string, header: string}[]): Record<string, string> => {
    const result: Record<string, string> = {};
    let remainingText = responseText;

    for (let i = 0; i < headers.length; i++) {
        const current = headers[i];
        const next = headers[i + 1];
        
        const currentHeaderIndex = remainingText.indexOf(current.header);
        
        if (currentHeaderIndex === -1) {
            continue; // Header not found
        }
        
        let contentEndIndex = remainingText.length;
        if (next) {
            const nextHeaderIndex = remainingText.indexOf(next.header, currentHeaderIndex);
            if (nextHeaderIndex !== -1) {
                contentEndIndex = nextHeaderIndex;
            }
        }
        
        const contentStartIndex = currentHeaderIndex + current.header.length;
        const content = remainingText.substring(contentStartIndex, contentEndIndex).trim();
        result[current.key] = content;
    }

    // If no headers were found at all, assume the whole text is the primary content (e.g., 'finalAnswer')
    if (Object.keys(result).length === 0 && headers.length > 0) {
        const primaryKey = headers.find(h => h.key.toLowerCase().includes('answer'))?.key || headers[0].key;
        result[primaryKey] = responseText.trim();
    }
    
    return result;
};