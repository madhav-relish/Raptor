"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { lucario } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  filesReferences: { fileName: string; sourceCode: string; summary: string }[];
  height?: string
};

const CodeReferences = ({ filesReferences, height }: Props) => {
  const [tab, setTab] = useState(filesReferences[0]?.fileName);
  return (
    <div className={cn(height ? `h-[${height}]` : 'max-h-[70vh]')}>
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex gap-2 overflow-y-scroll w-full max-w-[75vw] rounded-md bg-gray-200 p-1">
          {filesReferences.map((file) => (
            <button
            onClick={()=>setTab(file.fileName)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
                {
                  "bg-primary text-primary-foreground": tab === file.fileName,
                },
              )}
            >
              {file.fileName}
            </button>
          ))}
        </div>

        {filesReferences.map((file) => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="max-h-[40vh] max-w-8xl overflow-auto rounded-md"
          >
            <SyntaxHighlighter language="typescript" style={lucario}>
              {file.sourceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CodeReferences;
