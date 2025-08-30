import React from "react";
import About from "./About";
import Investor from "./Investor";
import ProductDescription from "./ProductDescription";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col">
      <section className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-r from-green-900 to-green-700 text-white px-4 relative w-full">
        {/* Logo Icon in Middle */}
        <div className=" rounded-full px-4 py-2 mb-6">
          <img
            src="/Images/logo.png"
            alt=""
            className="[clip-path:circle(50%_at_50%_50%)] w-20 h-20"
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-8xl font-bold mb-6">
          HASH BRAIN <br />
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl text-lg md:text-xl mb-8">
          World’s first decentralized AI network merges blockchain and
          intelligence, empowering communities with secure, transparent, and
          fair collaboration while removing centralized control from innovation.
        </p>

        {/* Buttons */}
        <div className="flex space-x-6">
          <button className="bg-green-300 text-black font-medium px-6 py-3 rounded-full hover:bg-green-400">
            <Link
              to={
                "https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x49AD6291d5E0EfAd94E204fFFe6BA3668C6ceE47"
              }
              target="_blank"
            >
              Start Trading
            </Link>
          </button>
          <button className="border border-green-300 text-white font-medium px-6 py-3 rounded-full hover:bg-green-300 hover:text-black">
            <Link to={"/chat"} target="_blank">
            Chat Ai
            </Link>
          </button>
        </div>
      </section>
      <section>
        <About />
      </section>
      <section>
        <Investor />
      </section>
      <section>
        <ProductDescription />
      </section>
    </div>
  );
};

export default Home;
