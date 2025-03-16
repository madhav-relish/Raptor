"use client";
import useProject from "@/hooks/use-project";
import { aiSummariesCommit } from "@/lib/gemini";
import { pollCommits, summariseCommit } from "@/lib/github";
import { ExternalLink, GithubIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import CommitLog from "./commit-log";

const DashboardPage = () => {
  const { data: session } = useSession();
  const { project } = useProject();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <div className="w-fit rounded-md bg-primary px-4 py-3">
          <div className="flex items-center">
            <GithubIcon className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white">
                This project is linked to{" "}
                <Link
                  href={project?.githubUrl ?? " "}
                  target="_blank"
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {project?.githubUrl}
                  <ExternalLink className="ml-1 size-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="h-4"></div>
        <div className="flex items-center gap-4">
          Team Members Invite Button Active Button
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          Ask Question AI 
          MeetingCard
        </div>
        <div className="mt-8"></div>
      </div>
        <CommitLog/>
    </div>
  );
};

export default DashboardPage;
