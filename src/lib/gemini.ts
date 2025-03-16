import { GoogleGenerativeAI } from '@google/generative-ai'
import { commitSummaryPrompt } from './constants'
import { Document } from '@langchain/core/documents';
console.log('API KEY::', process.env.GEMINI_API_KEY)


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


export const aiSummariesCommit = async (diff: string) => {

    const response = await model.generateContent([
        commitSummaryPrompt,
        `Please summaries the following diff file: \n\n${diff}`
    ])

    console.log("Summary::", response.response.text());
    return response.response.text();
}

export async function summariseCode(doc: Document) {
    console.log("Getting summary for::", doc.metadata.source)
    const code = doc.pageContent.slice(0, 10000);
    const response = await model.generateContent([
        `You are a intelligent senior software engineer who specialises in onboarding junior
        software engineers onto projects`,
        `You are onboarding a junior software engineer and explaining to them the purpose
        of the ${doc.metadata.source} file
        Here is the code
        ---
        ${code}
        ---
                Give a summary no more than 100 words of the code above
        
        `
    ])
    const summary = await aiSummariesCommit(doc.pageContent)
    return response.response.text()
}