import React from "react";
import About from "./About";
import Investor from "./Investor";
import ProductDescription from "./ProductDescription";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Video Background */}
      <section className="relative h-[90svh] sm:h-screen flex flex-col items-center justify-center text-center text-white w-full overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover z-[-2]"
        >
          <source src="/Videos/bgvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Readability Overlay */}
        <div className="absolute inset-0 bg-black/40 sm:bg-black/30 z-[-1]" />

        {/* Main Heading (fluid type via clamp) */}
        <h1
          className="
            font-extrabold leading-tight mb-4
            text-[clamp(1.75rem,6vw,4.5rem)]
            drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]
          "
        >
          Real time intelligence
          <br className="hidden xs:block" />
          <span className="block">AI for everyone</span>
        </h1>

        {/* Subtext (fluid type + max width) */}
        <p
          className="
            mx-auto mb-8 max-w-[62ch]
            text-[clamp(0.95rem,2.2vw,1.25rem)]
            opacity-95
            drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]
          "
        >
          Hash Brain Is Like a Chat-Gpt Build On The Blockchain{" "}
          <br className="hidden sm:block" />
          Fully Decentralized, Secure and Community Owned.
        </p>

        {/* Buttons (stack on mobile, row on md+) */}
        <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 flex-nowrap mt-4">
          {/* Start Trading Button */}
          <Link
            to="https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x49AD6291d5E0EfAd94E204fFFe6BA3668C6ceE47"
            target="_blank"
            className="
      inline-flex items-center justify-center
      rounded-full font-semibold
      bg-green-300 text-black
      px-6 py-3 sm:px-8 sm:py-3.5
      text-[clamp(0.9rem,1.8vw,1.05rem)]
      hover:bg-green-400 hover:scale-105
      transition-all duration-200 ease-in-out
      shadow-md hover:shadow-lg
      whitespace-nowrap
    "
          >
            🚀 Start Trading
          </Link>

          {/* Chat AI Button */}
          <Link
            to="/chat"
            target="_blank"
            className="
      inline-flex items-center justify-center
      rounded-full font-semibold
      border border-green-300 text-white
      px-6 py-3 sm:px-8 sm:py-3.5
      text-[clamp(0.9rem,1.8vw,1.05rem)]
      hover:bg-green-300 hover:text-black hover:scale-105
      transition-all duration-200 ease-in-out
      shadow-md hover:shadow-lg
      bg-black/70
      whitespace-nowrap
    "
          >
            🤖 Chat AI
          </Link>
        </div>
      </section>

      {/* Other Sections */}
      <section>
        <Investor />
      </section>
      <section>
        <About />
      </section>
      <section>
        <ProductDescription />
      </section>
    </div>
  );
};

export default Home;
