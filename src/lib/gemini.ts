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
    const model = genAI.getGenerativeModel({
      model: 'gemini-embedding-001',
    });
    const result = await model.embedContent({
      content: { role: 'user', parts: [{ text: summary }] },
      outputDimensionality: 768,
    } as any);
    const embedding = result.embedding;
    return embedding.values;
  });
}
