"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { Info } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const createProject = api.project.createProject.useMutation();
  const { register, handleSubmit, reset } = useForm<FormInput>();
 const checkCredits = api.project.checkCredits.useMutation()
  const refetch = useRefetch();

  function onSubmit(data: FormInput) {
    if(!!checkCredits.data){

      createProject.mutate(
        {
          githubUrl: data.repoUrl,
          name: data.projectName,
          githubToken: data.githubToken,
        },
        {
          onSuccess: () => {
            toast.success("Project created successfully");
            refetch();
            reset();
          },
          onError: () => {
            toast.error("Error while creating project");
          },
        },
      );
    } else{
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken
      })
    }
  }

  const hasEnoughCredits = checkCredits?.data?.userCredits ? checkCredits.data.fileCount <= checkCredits.data.userCredits : true

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img src="/undraw_github.svg" alt="github" className="h-56 w-auto" />
      <div>
        <div>
          <h1>Link your github repository</h1>
          <p>Enter the url to link your repository</p>
        </div>
        <div className="h-4">
          <div>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
              <Input
                {...register("projectName", { required: true })}
                required
                placeholder="Project Name"
              />
              <Input
                {...register("repoUrl", { required: true })}
                required
                type="url"
                placeholder="Github UrL"
              />
              <Input
                {...register("githubToken")}
                placeholder="Github Token (Optional)"
              />
              {!!checkCredits.data && (
                <>  
                <div className="mt-4 bg-orange-50 px-4 py-2 rounded-md border border-orange-200 text-orange-700">
                  <div className="flex items-center gap-2">
                    <Info className="size-4"/>
                    <p className="text-sm ">
                  You will be charged <strong>{checkCredits.data?.fileCount}</strong> credits
                    </p>
                  </div>
                    <p className="text-sm text-blue-600 ml-6">
                  You have <strong>{checkCredits.data?.userCredits}</strong> credits remaining
                    </p>
                   {checkCredits.data?.fileCount == 0 && <p className="text-sm text-blue-600 ml-6">
                  Make sure your repository exists and has some files!
                    </p>}
                </div>
                
                </>
              )}
              <div className="h-4"></div>

              <Button type="submit" disabled={createProject.isPending || !!checkCredits.isPending || !hasEnoughCredits || checkCredits.data?.fileCount == 0}>
             {!!checkCredits.data ? "Create Project" : "Check Credits"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
