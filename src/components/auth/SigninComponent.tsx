"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { GithubIcon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";


const SigninComponent = () => {
  const session = useSession()
  const router = useRouter()

  if(session && session.status==="authenticated"){return router.push('/dashboard')}

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 p-2">
        <Button onClick={()=>signIn("github")} variant={"ghost"}>
          {" "}
          <GithubIcon size={40}/> Signin with Github{" "}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SigninComponent;
