import React from "react";

const Home = () => {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-r from-green-900 to-green-700 text-white px-4 relative w-full">
      {/* Logo Icon in Middle */}
      <div className="bg-green-300 text-green-900 font-bold text-3xl rounded-full px-4 py-2 mb-6">
        ∞
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        The Blockchain To <br /> House All Finance
      </h1>

      {/* Subtext */}
      <p className="max-w-2xl text-lg md:text-xl mb-8">
        Crypto is fragmented today, but it doesn’t need to be. <br />
        For the first time, build projects, create value, and exchange assets on
        the same hyper-performant chain.
      </p>

      {/* Buttons */}
      <div className="flex space-x-6">
        <button className="bg-green-300 text-black font-medium px-6 py-3 rounded-full hover:bg-green-400">
          Start Trading
        </button>
        <button className="border border-green-300 text-white font-medium px-6 py-3 rounded-full hover:bg-green-300 hover:text-black">
          Start Building
        </button>
      </div>
    </section>
  );
};

export default Home;
