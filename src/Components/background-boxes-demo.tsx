"use client";
import { Boxes } from "./UI/background-boxes";

export default function BackgroundBoxesDemo() {
  return (
    <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center mt-[4rem]">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />
      <section
        data-aos="zoom-out"
        className="mt-16 sm:mt-24 py-8  text-white mb-5"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <p className="text-base sm:text-lg md:text-xl max-w-2xl">
              People who use <span className="font-semibold">RIDELY</span> for
              their shipping save an average of{" "}
              <span className="font-bold">32%</span> on their shipments compared
              to other shipping companies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
