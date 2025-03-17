import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import React, { useState } from "react";
import { askQuestion } from "./actions";
import { readStreamableValue } from "ai/rsc";
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [filesReferences, setFileReferences] = useState<{fileName: string; sourceCode: string; summary: string}[]>([])
  const [answer, setAnswer] = useState("") 
  const savedAnswers = api.project.savedAnswer.useMutation()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer('')
    setFileReferences([])
    e.preventDefault();
    if(!project?.id) return
    setOpen(true)
    
    const {output, filesReferences} = await askQuestion(question, project.id)
    setLoading(true)
    setFileReferences(filesReferences)

    for await (const delta of readStreamableValue(output)){
      if(delta){
        setAnswer(ans => ans + delta)
      }
    }
    setLoading(false)

  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80vw]">
          <DialogHeader>
            <div className="flex items-center gap-2">
            <DialogTitle>Raptor</DialogTitle>
            <Button disabled={savedAnswers.isPending} type="button" onClick={()=>{
             savedAnswers.mutate({
              projectId: project!.id,
              question,
              answer,
              filesReferences
             },{
              onSuccess: ()=>{
                toast.success('Answer Saved!')
              },
              onError: ()=>{
                toast.error('Failed to save answer!')
              }
             })
            }
              }>
              Save Answer
            </Button>
            </div>
          </DialogHeader>
          <MDEditor.Markdown source={answer} 
          className="max-w-[70vh] !h-full max-h-[40vh] overflow-scroll"/>
        <CodeReferences filesReferences={filesReferences}/>
          <Button type="button" onClick={()=>setOpen(false)}>
            Close
          </Button>
          {filesReferences.map(file => {
            return <span>{file.fileName}</span>
          })}
        </DialogContent>
      </Dialog>
      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="which file should I wdit to change the home page?"
            />
            <div className="h-4"></div>
            <Button type="submit" disabled={loading}>Ask Raptor!</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
