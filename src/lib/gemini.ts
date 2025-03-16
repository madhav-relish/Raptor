import {GoogleGenerativeAI} from '@google/generative-ai'
import { commitSummaryPrompt } from './constants'
console.log('API KEY::', process.env.GEMINI_API_KEY)


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


export const aiSummariesCommit = async(diff: string)=>{
    
    const response = await model.generateContent([
       commitSummaryPrompt,
       `Please summaries the following diff file: \n\n${diff}`
    ])
   
    console.log("Summary::", response.response.text());
    return response.response.text();
} 