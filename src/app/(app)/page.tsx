import HomePageButtons from "@/components/HomePageButtons";
import Particles from "@/components/ui/particles";

function Page() {
  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        refresh
      />
      <div className="flex justify-center items-center w-[80%] mb-8">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
          Nameless Feedback <br /> Where Honest, Anonymous Voices Drive Real
          Change
        </span>
      </div>
      <p className="text-center text-lg  dark:text-white/60">
        Unlock Genuine Feedback - Empower Your Audience to Share Anonymously.
      </p>
      <HomePageButtons />
    </div>
  );
}

export default Page;
