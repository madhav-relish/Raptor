import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <div className="text-5xl">HEllo world</div>
      <Button>Click Me</Button>
    </HydrateClient>
  );
}
