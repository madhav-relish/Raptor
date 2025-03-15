 import { Octokit } from 'octokit'

 export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
 })

 const githubUrl = ''

 type Response = {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
 }

 export const getCommitHashes = async(githubUrl: string)=>{

 }