
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { summariseCode } from "./gemini";


export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl,
        {
            accessToken: githubToken || "",
            branch: 'main',
            ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yml', 'bun.lockb'],
            recursive: true,
            unknown: 'warn',
            maxConcurrency: 5
        }
    )
    const docs = await loader.load()
    return docs
}

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string)=>{
    const docs = await loadGithubRepo(githubUrl, githubToken)
    const allEmbeddings = await generateEmbeddings(docs)


}

const generateEmbeddings = async(docs: Document[])=>{
    return await Promise.all(docs.map(async doc =>{
        const summary = summariseCode(doc)
    }))
}