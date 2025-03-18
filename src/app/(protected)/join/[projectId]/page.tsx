import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ projectId: string }>;
};

const JoinProject = async (props: Props) => {
  const { projectId } = await props.params;
  const session = await auth();

  if (!session) {
    <Alert variant={"destructive"}>
      <AlertTitle>Join Project</AlertTitle>
      <AlertDescription>Login to access the content</AlertDescription>
    </Alert>;
    return redirect("/signin");
  }
  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    <Alert variant={"destructive"}>
      <AlertTitle>Join Project</AlertTitle>
      <AlertDescription>
        Seems like the project doesn't exist! Check the link again
      </AlertDescription>
    </Alert>;
    redirect("/dashboard");
  }

  try {
    await db.userToProject.create({
      data: {
        userId: session.user.id,
        projectId,
      },
    });
  } catch (error) {
    console.error("Error while joining the project!", error);
  }
  return redirect("/dashboard");
  // return <div>JoinProject</div>;
};

export default JoinProject;
