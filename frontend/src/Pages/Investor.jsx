import React from "react";

const Investor = () => {
  const logos = [
    { src: "/Images/fetch.png", alt: "Fetch.ai" },
    { src: "/Images/singularity.png", alt: "SingularityNET" },
    { src: "/Images/polygon.png", alt: "Polygon" },
    { src: "/Images/deepbrain.png", alt: "DeepBrain Chain" },
  ];

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Title */}
        <p className="text-center font-semibold text-base sm:text-lg md:text-xl">
          Integration from the companies
        </p>

        {/* Logos grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 place-items-center">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="w-full max-w-[180px] h-10 sm:h-12 md:h-14 lg:h-16 flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                title={logo.alt}
                loading="lazy"
                className="max-h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Investor;
