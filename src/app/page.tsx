import BottomSection from "@/components/home/bottom-section";
import MagicButton from "@/components/home/MagicButton";
import { TabsDemo } from "@/components/home/tabs-demo";
import { BackgroundLines } from "@/components/ui/background-lines";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { SparklesCore } from "@/components/ui/sparkles";
import { Spotlight } from "@/components/ui/spotlight";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <div className="relative flex h-full w-full flex-col overflow-x-hidden bg-[#020817] text-white">
        <BackgroundLines>
          <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-[#020817] text-3xl text-white">
             <div className="h-full w-full rounded-md flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
        AI-Powered Code Intelligence
        </h1>
        <h3 className="text-4xl mx-auto pt-4 text-center">Your Project's Knowledge Base, Powered by AI</h3>
        <p className="mt-4 font-normal text-xl text-neutral-300 max-w-lg text-center mx-auto">
        Ask questions about your codebase, get instant answers, and make development collaboration smarter.
        </p>
        <div className="w-full flex items-center justify-center mt-8">
        <MagicButton/>
        </div>
      </div>
    </div>
          </div>
        </BackgroundLines>
        <div className="w-full absolute inset-0 h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold dark:text-white">
                Unleash the power of <br />
                <span className="mt-1 text-4xl font-bold leading-none md:text-[6rem]">
                  Scroll Animations
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={`/full_app.png`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto h-full rounded-2xl object-cover object-left-top"
            draggable={false}
          />
        </ContainerScroll>
        <TabsDemo/>
        <BottomSection/>
      </div>
    </HydrateClient>
  );
}
