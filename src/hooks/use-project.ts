import { api } from "@/trpc/react"

const useProject =()=>{
    const {data: projects} = api.project.getAllProjects.useQuery()
    return {
        projects
    }
}