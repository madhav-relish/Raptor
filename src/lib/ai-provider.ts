import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const openrouterKey = process.env.OPENROUTER_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
const defaultModel = process.env.OPENROUTER_MODEL || 'openrouter/auto';

export const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: openrouterKey || '',
  headers: {
    'HTTP-Referer': 'https://github.com/madhav-relish/Raptor',
    'X-Title': 'Raptor',
  },
});

export const google = createGoogleGenerativeAI({
  apiKey: geminiKey || '',
});

/**
 * Returns the primary LanguageModel based on available API keys.
 * Prefers OpenRouter if OPENROUTER_API_KEY is provided, otherwise falls back to Gemini.
 */
export function getAIModel(overrideModel?: string) {
  if (process.env.OPENROUTER_API_KEY) {
    const modelName = overrideModel || process.env.OPENROUTER_MODEL || defaultModel;
    return openrouter.chat(modelName);
  }
  return google('gemini-1.5-flash');
}

/**
 * Exponential backoff retry utility to handle rate limits (429) and transient errors.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 4,
  delayMs = 1500
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.statusCode || error?.response?.status;
      const isRateLimit =
        status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.toLowerCase().includes('rate limit') ||
        error?.message?.toLowerCase().includes('quota');

      if (attempt < retries - 1 && (isRateLimit || status >= 500)) {
        const backoff = delayMs * Math.pow(2, attempt) + Math.random() * 500;
        console.warn(`[AI Provider] Rate limited or server error (Attempt ${attempt + 1}/${retries}). Retrying in ${Math.round(backoff)}ms...`);
        await new Promise((res) => setTimeout(res, backoff));
      } else {
        throw error;
      }
    }
  }
  throw lastError;
}

/**
 * Helper to generate text using the configured AI model with automatic retry and fallback.
 */
export async function generateTextWithRetry(prompt: string | any[]): Promise<string> {
  const promptString = Array.isArray(prompt) ? prompt.join('\n\n') : prompt;

  try {
    return await withRetry(async () => {
      const model = getAIModel();
      const { text } = await generateText({
        model: model as any,
        prompt: promptString,
      });
      return text;
    });
  } catch (error: any) {
    // If specific OpenRouter model failed (e.g. 404 slug deprecated), try openrouter/auto
    if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_MODEL !== 'openrouter/auto') {
      console.warn('[AI Provider] Specific OpenRouter model failed. Falling back to openrouter/auto...');
      try {
        const autoModel = openrouter.chat('openrouter/auto');
        const { text } = await generateText({
          model: autoModel as any,
          prompt: promptString,
        });
        return text;
      } catch (autoErr) {
        // Continue to Gemini fallback
      }
    }

    // Fallback to Gemini if available
    if (process.env.GEMINI_API_KEY) {
      console.warn('[AI Provider] Primary OpenRouter model failed. Falling back to Gemini...');
      const fallbackModel = google('gemini-1.5-flash');
      const { text } = await generateText({
        model: fallbackModel as any,
        prompt: promptString,
      });
      return text;
    }
    throw error;
  }
}
