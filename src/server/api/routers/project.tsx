import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { checkCredits, indexGithubRepo } from "@/lib/github-loader";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({where:{id: ctx.session.user.id!}, select:{credits: true}})
     if(!user){
      throw new Error("User not found")
     }

     const currentCredits = user.credits || 0
     const fileCount = await checkCredits(input.githubUrl, input.githubToken)

     if(currentCredits <  fileCount){
      throw new Error('Insufficient credits')
     }

      const project = await ctx.db.project.create({
        data: {
          githubUrl: input.githubUrl,
          name: input.name,
          UserToProject: {
            create: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
      await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
      await pollCommits(project.id);
      await ctx.db.user.update({where: {id: ctx.session.user.id}, data: { credits: {decrement: fileCount}}})
      return project;
    }),
  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        UserToProject: {
          some: {
            userId: ctx.session.user.id,
          },
        },
        deletedAt: null,
      },
    });
  }),
  getCommits: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      pollCommits(input.projectId).then().catch(console.error);
      return await ctx.db.commit.findMany({
        where: {
          projectId: input.projectId,
        },
      });
    }),
  savedAnswer: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        question: z.string(),
        filesReferences: z.any(),
        answer: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.question.create({
        data: {
          answer: input.answer,
          filesReference: input.filesReferences,
          question: input.question,
          projectId: input.projectId,
          userId: ctx.session.user.id,
        },
      });
    }),
  getQuestions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.question.findMany({
        where: { projectId: input.projectId },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
    }),
  archiveProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.project.update({
        where: { id: input.projectId },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
    getTeamMembers: protectedProcedure.input(z.object({
      projectId: z.string()
    })).query( async({ctx, input})=>{
      return await ctx.db.userToProject.findMany({
        where: {projectId: input.projectId}, 
        include: {user: true}
      })
    }),
    myCredits: protectedProcedure.query(async({ctx})=>{
      return await ctx.db.user.findUnique({where: {id: ctx.session.user.id!}, select:{credits: true}})
    }),
    checkCredits: protectedProcedure.input(z.object({
      githubUrl: z.string(),
      githubToken: z.string().optional()
    })).mutation(async ({ctx, input})=>{
      const fileCount = await checkCredits(input.githubUrl, input.githubToken)
      const userCredits = await ctx.db.user.findUnique({where: {id: ctx.session.user.id!}, select:{credits: true}})
      return { fileCount, userCredits: userCredits?.credits || 0 }
    })
});
