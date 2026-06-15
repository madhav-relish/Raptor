"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { GithubIcon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";


const SigninComponent = () => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session && session.status === "authenticated") {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (session && session.status === "authenticated") {
    return <div>Redirecting...</div>;
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 p-2">
        {/* <Button onClick={()=>signIn("discord")} variant={"ghost"}>
          {" "}Zz
          <Icons.discord color="blue" /> Signin with Discord{" "}
        </Button> */}

        <Button onClick={()=>signIn("github")} variant={"ghost"}>
          {" "}
          <GithubIcon size={40}/> Signin with Github{" "}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SigninComponent;
