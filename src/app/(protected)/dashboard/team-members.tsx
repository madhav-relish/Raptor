"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import React from "react";

const TeamMembers = () => {
  const { projectId } = useProject();
  const { data: members } = api.project.getTeamMembers.useQuery({ projectId });
  return (
    <div className="flex gap-0">
      {members?.map((member) => (
        <Avatar key={member.id}>
            <Tooltip>
            <TooltipTrigger>

          <AvatarImage src={`${member.user.image}`} />
          <AvatarFallback>{member.user.name?.[0]?.toUpperCase()}</AvatarFallback>
            </TooltipTrigger>
            <TooltipContent>{member.user.name}</TooltipContent>
            </Tooltip>
        </Avatar>
      ))}
    </div>
  );
};

export default TeamMembers;
