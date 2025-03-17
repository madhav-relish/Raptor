import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";

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
      const project = await ctx.db.project.create({
        data: {
          githubUrl: input.githubUrl,
          name: input.name,
          UserToProject: {
            create: {
              userId: ctx.user.user.id,
            },
          },
        },
      });
      await indexGithubRepo(project.id, input.githubUrl, input.githubToken)
      await pollCommits(project.id);
      return project;
    }),
  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        UserToProject: {
          some: {
            userId: ctx.user.user.id,
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
    savedAnswer: protectedProcedure.input(z.object({
      projectId: z.string(),
      question: z.string(),
      filesReferences: z.any(),
      answer: z.string()
    })).mutation(async ({ctx, input})=>{
      return await ctx.db.question.create({
        data: {
          answer: input.answer,
          filesReference: input.filesReferences,
          question: input.question,
          projectId: input.projectId,
          userId: ctx.user.user.id
        }
      })
    })
});
