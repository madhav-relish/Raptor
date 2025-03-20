"use client";
import useProject from "@/hooks/use-project";
import { ExternalLink, GithubIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import MeetingCard from "./meeting-card";
import ArchiveButton from "./archive-button";
import TeamMembers from "./team-members";
import dynamic from "next/dynamic";
const InviteButton = dynamic(()=>import('./invite-button'), {ssr: false})

const DashboardPage = () => {
  const { data: session } = useSession();
  const { project, projectId } = useProject();

  if (!session) {
    return <div>Loading...</div>;
  }

  if (!projectId || projectId === "") {
    return (
      <div className="flex h-[50vh] items-center justify-center text-lg font-semibold">
        Select a project from the Sidemenu or Click on Create Project!
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <div className="w-fit rounded-md bg-primary px-4 py-3">
          <div className="flex items-center">
            <GithubIcon className="size-5 text-primary-foreground" />
            <div className="ml-2">
              <p className="text-sm font-medium text-primary-foreground">
                This project is linked to{" "}
                <Link
                  href={project?.githubUrl ?? " "}
                  target="_blank"
                  className="inline-flex items-center text-primary-foreground/80 hover:underline"
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
          <TeamMembers/>
          <InviteButton/>
          <ArchiveButton />
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <AskQuestionCard />
          <MeetingCard />
        </div>
        <div className="mt-8"></div>
      </div>
      <CommitLog />
    </div>
  );
};

export default DashboardPage;
