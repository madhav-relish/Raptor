import { SparklesCore } from "../ui/sparkles";
import MagicButton from "./MagicButton";

const BottomSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="py-36 flex flex-col items-center relative h-screen bg-transpaent">
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

      <div className="flex flex-col px-4 sm:px-8 md:max-w-2xl mx-auto mb-20 items-center">
        <div className="text-center mb-10 max-w-md md:max-w-lg">
          <h2 className="text-5xl font-bold mb-3.5 text-balance">
          Transform Your Development Workflow
          </h2>
          <p>
          Stop wasting time searching through documentation. Let Raptor.ai understand your codebase and provide instant answers.
          </p>
        </div>
        {/* <CTAButtons /> */}
        <MagicButton/>
      </div>

      <div className="absolute bottom-4 w-full flex justify-center items-center">
        {/* <p className="text-primary-foreground">&copy; Raptor {currentYear}</p> */}
      </div>
    </div>
  );
};

export default BottomSection;