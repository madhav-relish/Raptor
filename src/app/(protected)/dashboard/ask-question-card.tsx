import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import React, { useState } from "react";
import { askQuestion } from "./actions";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";
import { Save } from "lucide-react";
import rehypeSanitize from "rehype-sanitize";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filesReferences, setFileReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = useState("");
  const savedAnswers = api.project.savedAnswer.useMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer("");
    setFileReferences([]);
    e.preventDefault();
    if (!project?.id) return;
    setOpen(true);

    setLoading(true);
    const { output, filesReferences } = await askQuestion(question, project.id);
    setFileReferences(filesReferences);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }
    setLoading(false);
  };

  const refetch = useRefetch();
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[90vh] flex-col overflow-hidden sm:max-w-[90vw]">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <DialogTitle>Raptor</DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex flex-1 flex-col gap-4 overflow-hidden">
            <div className="min-h-0 flex-1 overflow-auto">
              <MDEditor.Markdown
                source={answer}
                className="rounded p-2"
                // rehypePlugins={[[rehypeSanitize]]}
                components={{
                  code: ({ children, ...props }) => (
                    <code
                      {...props}
                      className="!bg-neutral-100 !text-primary dark:!bg-neutral-800"
                    >
                      {children}
                    </code>
                  ),
                }}
              />
            </div>

            <CodeReferences filesReferences={filesReferences} />
          </div>

          <DialogFooter className="mt-4 flex flex-shrink-0 items-center justify-end gap-2">
            <Button
              disabled={savedAnswers.isPending}
              type="button"
              onClick={() => {
                savedAnswers.mutate(
                  {
                    projectId: project!.id,
                    question,
                    answer,
                    filesReferences,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Answer Saved!");
                      refetch();
                    },
                    onError: () => {
                      toast.error("Failed to save answer!");
                    },
                  },
                );
              }}
            >
              <Save className="size-4" /> Save Answer
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
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
            <Button type="submit" disabled={loading}>
              Ask Raptor!
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
