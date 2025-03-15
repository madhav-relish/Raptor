 import { db } from '@/server/db';
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

 export const getCommitHashes = async(githubUrl: string): Promise<Response[]>=>{
   const {data} = await octokit.rest.repos.listCommits({
      owner: 'madhav-relish',
      repo: 'willy'
   })
   const sortedCommits = data.sort((a: any, b:any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()  ) as any[]
   return sortedCommits.slice(0,10).map((commit: any)=>({
      commitHash: commit.sha as string,
      commitMessage: commit.commit.message ?? "",
      commitAuthorName: commit.commit.author?.name ?? "",
      commitAuthorAvatar: commit.commit.author?.avatar_url ?? "",
      commitDate: commit.commit.author.date
   }))
  
 }

 export const pollCommits = async (projectId:string) =>{
   const {project, githubUrl} = await fetchProjectGithubUrl(projectId)
   const commitHashes = await getCommitHashes(githubUrl)
   const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
   return unprocessedCommits
 }

export const fetchProjectGithubUrl = async(projectId: string)=>{
   const project = await db.project.findUnique({
      where:{ id: projectId},
      select:{
         githubUrl: true
      }
   })

   if(!project?.githubUrl){
      throw new Error("Project has no github url")
   }
   return{
      project, githubUrl: project?.githubUrl
   }
}


async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]){
   const processedCommits = await db.commit.findMany({
      where: {projectId}
   })
   const unprocessedCommits = commitHashes.filter((commit)=> !processedCommits.some((processedCommit)=>processedCommit.commitHash === commit.commitHash))
   return unprocessedCommits
}
 console.log(getCommitHashes(githubUrl))