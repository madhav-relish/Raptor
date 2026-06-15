import { Button } from '@/components/ui/button'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const ArchiveButton = ({icon, projectId} : {icon?: boolean, projectId: string}) => {

    const archiveProject = api.project.archiveProject.useMutation()
    const refetch = useRefetch()
  return (
    <Button disabled={archiveProject.isPending} variant={'destructive'} size={'sm'} onClick={()=>{
    const confirm = window.confirm("Are you sure you want to archive this project?")
      if(confirm)  archiveProject.mutate({projectId},{
        onSuccess: ()=>{
            toast.success("Project Archived!")
            refetch()
            // setProjectId("")
        }, onError: ()=>{
            toast.error("Unable to archive project")
        }
      })
    }}>{icon ? <Trash /> : "Archive"}</Button>
  )
}

export default ArchiveButton