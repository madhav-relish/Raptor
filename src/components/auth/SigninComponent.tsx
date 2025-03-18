"use client";

import React from "react";
import Icons from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signIn } from "next-auth/react";


const SigninComponent = () => {
  const handleSignin = async () => {
    try {
      await signIn("discord");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-2 p-2">
        <Button onClick={handleSignin} variant={"ghost"}>
          {" "}
          <Icons.discord color="blue" /> Signin with Discord{" "}
        </Button>
        <br/>
        <Button onClick={()=>signIn("github")} variant={"ghost"}>
          {" "}
          <Icons.discord color="blue" /> Signin with Github{" "}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SigninComponent;
