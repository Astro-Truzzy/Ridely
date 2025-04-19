const Banner = () => {
  return (
    <section
      data-aos="zoom-out"
      className="mt-16 sm:mt-24 py-8 bg-[#175AFF] text-white mb-5"
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
  );
};

export default Banner;
