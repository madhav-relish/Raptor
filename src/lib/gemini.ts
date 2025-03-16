import {GoogleGenerativeAI} from '@google/generative-ai'
import { commitSummaryPrompt } from './constants'
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "")
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
})

export const summariesCommit = async(diff: string)=>{
    
    const response = await model.generateContent([
       commitSummaryPrompt,
       `Please summaries the following diff file: \n\n${diff}`
    ])
    return response.response.text
} 