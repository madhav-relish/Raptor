import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl: z.string(),
            githubToken: z.string().optional()
        })
    ).mutation(async ({ctx, input})=>{
        const project = await ctx.db.project.create({
            data:{
                githubUrl: input.githubUrl,
                name: input.name,
                UserToProject:{
                    create:{
                        userId: ctx.user.user.id
                    }
                }
            }
        })
       return project
    }),
    getAllProjects: protectedProcedure.query(async ({ctx})=>{
        return await ctx.db.project.findMany({
            where:{
                UserToProject: {
                    some:{
                        userId: ctx.user.user.id
                    }
                },
                deletedAt: null
            }
        })
    })
})