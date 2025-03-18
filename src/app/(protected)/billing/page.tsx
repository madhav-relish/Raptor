"use client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import useRefetch from "@/hooks/use-refetch";
import { createCheckoutSession } from "@/lib/stripe";
import { api } from "@/trpc/react";
import { Info } from "lucide-react";
import React, { useState } from "react";

const BillingPage = () => {
  const { data: user } = api.project.myCredits.useQuery();
  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100]);
  const creditsToButAmount = creditsToBuy[0]!;
  const price = (creditsToButAmount / 50).toFixed(2);
  const refetch = useRefetch()
  return (
    <div>
      <h1>Billing</h1>
      <div className="h-2"></div>
      <p>You currently have {user?.credits} Raptor credits</p>
      <div className="h-2"></div>
      <div className="flex items-center gap-2">
        <Info className="size-4" />
        <p className="text-sm">
          Each credit allows you to index 1 file in a repository
        </p>
      </div>
      <p className="text-sm">
        {" "}
        E.g. If your project has 100 files, you will need 100 credits to index
        it
      </p>
      <div className="h-4"></div>
      <Slider
        defaultValue={[100]}
        max={1000}
        min={10}
        onValueChange={(value) => setCreditsToBuy(value)}
        value={creditsToBuy}
      />
      <div className="h-4"></div>
      <Button onClick={() => {createCheckoutSession(creditsToButAmount)
        refetch()
      }}>
        Buy {creditsToBuy} credits for ${price}
      </Button>
    </div>
  );
};

export default BillingPage;
