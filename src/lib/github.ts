import { db } from '@/server/db';
import { Octokit } from 'octokit';
import axios from 'axios'
import { aiSummariesCommit } from './gemini';

const getOctokit = () => {
   const token = process.env.GITHUB_TOKEN;
   if (token && token.trim() !== "") {
      return new Octokit({ auth: token });
   }
   return new Octokit();
};

export const octokit = getOctokit();

type Response = {
   commitHash: string;
   commitMessage: string;
   commitAuthorName: string;
   commitAuthorAvatar: string;
   commitDate: string;
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
   const [owner, repo] = githubUrl.split('/').slice(-2)
   if(!owner || !repo){
      throw new Error("Invalid github url")
   }
   let client = getOctokit();
   let data;
   try {
      const res = await client.rest.repos.listCommits({
         owner,
         repo
      });
      data = res.data;
   } catch (error: any) {
      if (error?.status === 401 || error?.message?.includes('Bad credentials')) {
         client = new Octokit();
         const res = await client.rest.repos.listCommits({
            owner,
            repo
         });
         data = res.data;
      } else {
         throw error;
      }
   }
   const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]
   return sortedCommits.slice(0, 10).map((commit: any) => ({
      commitHash: commit.sha as string,
      commitMessage: commit.commit.message ?? "",
      commitAuthorName: commit.commit.author?.name ?? "",
      commitAuthorAvatar: commit.author?.avatar_url ?? "",
      commitDate: commit.commit.author?.date
   }))
}

export const pollCommits = async (projectId: string) => {
   const { project, githubUrl } = await fetchProjectGithubUrl(projectId)
   const commitHashes = await getCommitHashes(githubUrl)
   const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)

   const summaries: string[] = [];
   const BATCH_SIZE = 5;

   for (let i = 0; i < unprocessedCommits.length; i += BATCH_SIZE) {
      const batch = unprocessedCommits.slice(i, i + BATCH_SIZE);
      const batchResponses = await Promise.allSettled(batch.map((commit) => {
         return summariseCommit(githubUrl, commit.commitHash);
      }));

      for (const response of batchResponses) {
         if (response.status === 'fulfilled') {
            summaries.push(typeof response.value === 'string' ? response.value : "");
         } else {
            summaries.push("");
         }
      }

      if (i + BATCH_SIZE < unprocessedCommits.length) {
         await new Promise((res) => setTimeout(res, 100));
      }
   }

   const commits = await db.commit.createMany({
      data: summaries.map((summary, index) =>{
         console.log(`processing commit ${index}`)
         return {
            projectId: projectId,
            commitHash: unprocessedCommits[index]!.commitHash,
            commitMessage: unprocessedCommits[index]!.commitMessage,
            commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
            commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
            commitDate: unprocessedCommits[index]!.commitDate,
            summary
         }
      })
   })
   return commits
}

export const fetchProjectGithubUrl = async (projectId: string) => {
   const project = await db.project.findUnique({
      where: { id: projectId },
      select: {
         githubUrl: true
      }
   })

   if (!project?.githubUrl) {
      throw new Error("Project has no github url")
   }
   return {
      project, githubUrl: project?.githubUrl
   }
}


async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
   const processedCommits = await db.commit.findMany({
      where: { projectId }
   })
   const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))
   return unprocessedCommits
}

export async function summariseCommit(githubUrl: string, commitHash: string){
   // get the diff with the url then pass it to ai
   const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`,{
      headers:{
         Accept: 'application/vnd.github.v3.diff' //github's own custom formatting
      }
   })
   return await aiSummariesCommit(data) || ""
}
