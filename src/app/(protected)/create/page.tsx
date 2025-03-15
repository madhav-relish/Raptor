'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useRefetch from '@/hooks/use-refetch';
import { api } from '@/trpc/react';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken?: string
}



const CreatePage = () => {
  const createProject = api.project.createProject.useMutation()
  const {register, handleSubmit, reset} = useForm<FormInput>()
const refetch = useRefetch()

  function onSubmit (data: FormInput){
    window.alert(JSON.stringify(data))
    createProject.mutate({
      githubUrl: data.repoUrl,
      name: data.projectName,
      githubToken: data.githubToken
    },{
      onSuccess:()=>{
        toast.success("Project created successfully")
        refetch()
        reset()
      },
      onError:()=>{
        toast.error("Error while creating project")
      }
    })
     return true
   }

  return (
    <div className='flex items-center gap-12 h-full justify-center'>
      <img src='/undraw_github.svg' alt='github' className='h-56 w-auto'/>
    <div>
      <div>
        <h1>Link your github repository</h1>
        <p>Enter the url to link you repository</p>
      </div>
      <div className='h-4'>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
            {...register("projectName", {required: true})}
            required
            placeholder='Project Name'
            />
             <Input
            {...register("repoUrl", {required: true})}
            required
            type='url'
            placeholder='Github UrL'
            />
              <Input
            {...register("githubToken")}
          placeholder='Github Token (Optional)'
            />
            <div className='h-4'></div>
            <Button type='submit'
            disabled={createProject.isPending}
            >Create Project</Button>
          </form>
        </div>
      </div>
    </div>
    </div>
  )
}

export default CreatePage