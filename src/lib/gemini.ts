import { GoogleGenerativeAI } from '@google/generative-ai';
import { commitSummaryPrompt } from './constants';
import { Document } from '@langchain/core/documents';
import { generateTextWithRetry, withRetry } from './ai-provider';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const aiSummariesCommit = async (diff: string) => {
  const prompt = `${commitSummaryPrompt}\n\nPlease summarize the following diff file:\n\n${diff}`;
  const text = await generateTextWithRetry(prompt);
  console.log("Summary::", text);
  return text;
};

export async function summariseCode(doc: Document) {
  console.log("Getting summary for::", doc.metadata.source);
  const code = doc.pageContent.slice(0, 10000);
  const prompt = `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects.

You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.
Here is the code:
---
${code}
---
Give a summary no more than 100 words of the code above.`;

  return await generateTextWithRetry(prompt);
}

export async function generativeEmbedding(summary: string) {
  return withRetry(async () => {
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    if (openrouterKey && openrouterKey.trim() !== '') {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/embeddings', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openrouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/madhav-relish/Raptor',
            'X-Title': 'Raptor',
          },
          body: JSON.stringify({
            model: 'openai/text-embedding-3-small',
            input: summary,
            dimensions: 768,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data[0] && data.data[0].embedding) {
            return data.data[0].embedding;
          }
        } else {
          console.warn('[OpenRouter Embedding] Request returned status', res.status);
        }
      } catch (err: any) {
        console.warn('[OpenRouter Embedding] Failed, falling back to Gemini:', err?.message || err);
      }
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-embedding-2-preview',
    });
    const result = await model.embedContent({
      content: { role: 'user', parts: [{ text: summary }] },
      outputDimensionality: 768,
    } as any);
    const embedding = result.embedding;
    return embedding.values;
  });
}
