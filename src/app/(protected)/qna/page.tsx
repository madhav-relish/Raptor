"use client";
import React from "react";
import { motion } from "framer-motion";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import AskQuestionCard from "../dashboard/ask-question-card";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { useTheme } from "next-themes"
import rehypeSanitize from "rehype-sanitize"

const QnAPage = () => {
  const { projectId } = useProject();
  const { data: questions } = api.project.getQuestions.useQuery({ projectId });
  const { theme } = useTheme()

  const renderQuestion = (question: any, id: string) => (
    <motion.div
      layoutId={`card-${question.id}-${id}`}
      className="p-4 flex flex-col   md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
    >
      <div className="flex gap-4 flex-col md:flex-row md:items-center md:flex-1">
      <motion.div layoutId={`image-container-${question.id}-${id}`} className="w-14 h-14">
        <motion.img
          layoutId={`image-${question.id}-${id}`}
          className="h-14 w-14 rounded-full"
          height={30}
          width={30}
          src={question.user.image ?? ""}
          alt="User avatar"
        />
      </motion.div>
        <div className="w-full">
          <motion.h3
            layoutId={`title-${question.id}-${id}`}
            className="font-medium text-neutral-800 dark:text-neutral-200"
          >
            {question.question}
          </motion.h3>
          <motion.p
            layoutId={`description-${question.id}-${id}`}
            className="text-neutral-600 dark:text-neutral-400 line-clamp-1"
          >
            {question.answer}
          </motion.p>
        </div>
      </div>
      <span className="text-xs text-gray-400 mt-4 md:mt-0">
        {question.createdAt.toLocaleDateString()}
      </span>
    </motion.div>
  );

  const renderExpandedQuestion = (question: any, id: string) => (
    <motion.div
      layoutId={`card-${question.id}-${id}`}
      className="w-full max-w-[80vw] h-full md:h-fit md:max-h-[80vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-auto p-6"
    >
       <motion.h3
      layoutId={`title-${question.id}-${id}`}
      className="text-2xl font-bold mb-4 flex items-center gap-2"
    >
      <motion.div layoutId={`image-container-${question.id}-${id}`} className="w-14 h-14">
        <motion.img
          layoutId={`image-${question.id}-${id}`}
          className="h-14 w-14 rounded-full"
          height={30}
          width={30}
          src={question.user.image ?? ""}
          alt="User avatar"
        />
      </motion.div>
      {question.question}
    </motion.h3>
    <div className=" h-[40vh] overflow-y-scroll">

    <MDEditor.Markdown
          className="!bg-transparent !text-primary !overflow-auto !prose dark:!prose-invert"
          source={question.answer}
          rehypePlugins={[[rehypeSanitize]]}
          components={{
            code: ({children, ...props}) => (
              <code {...props} className="!bg-neutral-100 dark:!bg-neutral-800 !text-primary">
                {children}
              </code>
            )
          }}
        />
        </div>
        <div className="h-4"></div>
      <CodeReferences
      height="40vh"
        filesReferences={question.filesReference as any[]}
      />
    </motion.div>
  );

  const isQuestion = (active: any): active is any => {
    return active && 'question' in active;
  };

  if(!questions || questions.length == 0){
    return (
      <div>
        All your saved questions for a project will be shown here!
      </div>
    )
  }

  return (
    <>
      <AskQuestionCard />
      <div className="h-4"></div>
      <h1 className="text-xl font-semibold">Saved Questions</h1>
      <div className="h-2"></div>
      
      <ExpandableCard
        items={questions ?? []}
        renderItem={renderQuestion}
        renderExpandedContent={renderExpandedQuestion}
        isActiveItem={isQuestion}
      />
    </>
  );
};

export default QnAPage;