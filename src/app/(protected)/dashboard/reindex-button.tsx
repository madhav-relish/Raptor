"use client";

import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { RefreshCw } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const ReindexButton = () => {
  const { projectId } = useProject();
  const refetch = useRefetch();
  const reindex = api.project.reindexProject.useMutation();

  const handleReindex = () => {
    if (!projectId) return;
    const confirm = window.confirm(
      "Re-indexing will scan the repository and update all code context & embeddings. Continue?"
    );
    if (!confirm) return;

    reindex.mutate(
      { projectId },
      {
        onSuccess: () => {
          toast.success("Re-indexing started in background!");
          refetch();
        },
        onError: (err) => {
          toast.error(`Re-indexing failed: ${err.message}`);
        },
      }
    );
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReindex}
      disabled={reindex.isPending}
      className="flex items-center gap-2"
    >
      <RefreshCw className={`size-4 ${reindex.isPending ? "animate-spin" : ""}`} />
      {reindex.isPending ? "Indexing Codebase..." : "Re-index Codebase"}
    </Button>
  );
};

export default ReindexButton;
