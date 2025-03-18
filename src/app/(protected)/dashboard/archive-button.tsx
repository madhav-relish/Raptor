import { Button } from '@/components/ui/button'
import useProject from '@/hooks/use-project'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import React from 'react'
import { toast } from 'sonner'

const ArchiveButton = () => {
    const {projectId} = useProject()

    const archiveProject = api.project.archiveProject.useMutation()
    const refetch = useRefetch()
  return (
    <Button disabled={archiveProject.isPending} variant={'destructive'} size={'sm'} onClick={()=>{
    const confirm = window.confirm("Are you sure you want to archive this project?")
      if(confirm)  archiveProject.mutate({projectId},{
        onSuccess: ()=>{
            toast.success("Project Archived!")
            refetch()
        }, onError: ()=>{
            toast.error("Unable to archive project")
        }
      })
    }}>Archive</Button>
  )
}

export default ArchiveButton