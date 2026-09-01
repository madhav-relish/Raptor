import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generativeEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";
import { Octokit } from "octokit";

const getOctokitWithFallback = (token?: string) => {
    const authToken = token || process.env.GITHUB_TOKEN;
    if (authToken && authToken.trim() !== "") {
        return new Octokit({ auth: authToken });
    }
    return new Octokit();
};

const getFileCount = async (path: string, octokit: Octokit, githubOwner: string, githubRepo: string, acc: number = 0) => {
    const { data } = await octokit.rest.repos.getContent({
        owner: githubOwner,
        repo: githubRepo,
        path
    })

    if (!Array.isArray(data) && data.type === 'file') {
        return acc + 1
    }
    if (Array.isArray(data)) {
        let fileCount = 0
        const directories: string[] = []

        for (const item of data) {
            if (item.type === 'dir') {
                directories.push(item.path)
            } else {
                fileCount++;
            }
        }
        if (directories.length > 0) {
            const directoryCounts = await Promise.all(
                directories.map(dirPath => getFileCount(dirPath, octokit, githubOwner, githubRepo, 0))
            )
            fileCount += directoryCounts.reduce((acc, count) => acc + count, 0)
        }
        return acc + fileCount
    }
    return acc
}

export const checkCredits = async (githubUrl: string, githubToken?: string) => {
    const githubOwner = githubUrl.split('/')[3]
    const githubRepo = githubUrl.split('/')[4]

    if (!githubOwner || !githubRepo) {
        return 0
    }

    let octoKit = getOctokitWithFallback(githubToken);

    // Fast 1-request git tree fetch
    try {
        const treeRes = await octoKit.rest.git.getTree({
            owner: githubOwner,
            repo: githubRepo,
            tree_sha: 'HEAD',
            recursive: 'true'
        });
        if (treeRes.data && Array.isArray(treeRes.data.tree)) {
            const files = treeRes.data.tree.filter(
                item => item.type === 'blob' &&
                !item.path?.includes('lock') &&
                !item.path?.startsWith('.git/')
            );
            return files.length;
        }
    } catch (error: any) {
        if (error?.status === 401 || error?.message?.includes('Bad credentials')) {
            console.warn('[Octokit] Bad credentials encountered. Retrying unauthenticated...');
            octoKit = new Octokit();
            try {
                const treeRes = await octoKit.rest.git.getTree({
                    owner: githubOwner,
                    repo: githubRepo,
                    tree_sha: 'HEAD',
                    recursive: 'true'
                });
                if (treeRes.data && Array.isArray(treeRes.data.tree)) {
                    const files = treeRes.data.tree.filter(
                        item => item.type === 'blob' &&
                        !item.path?.includes('lock') &&
                        !item.path?.startsWith('.git/')
                    );
                    return files.length;
                }
            } catch (innerErr) {
                // Fallthrough to recursive getFileCount or fallback
            }
        }
    }

    // Secondary fallback: recursive getFileCount or rate limit protection
    try {
        return await getFileCount('', octoKit, githubOwner, githubRepo, 0);
    } catch (error: any) {
        console.warn('[Octokit] Rate limit or fetch error in checkCredits:', error?.message);
        return 10; // Fallback estimate to prevent UI hang
    }
}

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    let octoKit = getOctokitWithFallback(githubToken);
    const [owner, repo] = githubUrl.split('/').slice(-2);

    let defaultBranch = 'main';
    try {
        const { data: repoData } = await octoKit.rest.repos.get({
            owner: owner || "",
            repo: repo || "",
        });
        defaultBranch = repoData.default_branch;
    } catch (error: any) {
        if (error?.status === 401 || error?.message?.includes('Bad credentials')) {
            octoKit = new Octokit();
            try {
                const { data: repoData } = await octoKit.rest.repos.get({
                    owner: owner || "",
                    repo: repo || "",
                });
                defaultBranch = repoData.default_branch;
            } catch (e) {
                defaultBranch = 'main';
            }
        } else {
            defaultBranch = 'main';
        }
    }

    const activeToken = githubToken || process.env.GITHUB_TOKEN;
    const loaderOptions: any = {
        branch: defaultBranch,
        ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yml', 'bun.lockb'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5
    };
    if (activeToken && activeToken.trim() !== "") {
        loaderOptions.accessToken = activeToken;
    }

    const loader = new GithubRepoLoader(githubUrl, loaderOptions);

    try {
        return await loader.load();
    } catch (error: any) {
        if (error?.message?.includes('Bad credentials') && loaderOptions.accessToken) {
            delete loaderOptions.accessToken;
            const fallbackLoader = new GithubRepoLoader(githubUrl, loaderOptions);
            return await fallbackLoader.load();
        }
        throw error;
    }
}

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken)
    const allEmbeddings = await generateEmbeddings(docs)
    await Promise.all(allEmbeddings.map(async (embedding, index) => {
        console.log(`processing ${index + 1} of ${allEmbeddings.length}`)

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
                summary: embedding.summary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                projectId
            }
        })
        await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
        `
    }))
}

const generateEmbeddings = async (docs: Document[]) => {
    const results = []
    const BATCH_SIZE = 2

    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = docs.slice(i, i + BATCH_SIZE)
        const batchResults = await Promise.all(
            batch.map(async (doc) => {
                const summary = await summariseCode(doc)
                const embedding = await generativeEmbedding(summary)

                return {
                    summary,
                    embedding,
                    sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
                    fileName: doc.metadata.source
                }
            })
        )
        results.push(...batchResults)

        if (i + BATCH_SIZE < docs.length) {
            await new Promise((res) => setTimeout(res, 500))
        }
    }

    return results
}