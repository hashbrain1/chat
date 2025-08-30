import React from "react";

const Investor = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:space-x-10 py-10 text-center">
      {/* Text */}
      <p className="text-lg font-semibold md:mr-4">
        A collaboration between
      </p>

      {/* Logos */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <img src="/Images/fetchai.png" alt="Fetch.ai" className="h-8 sm:h-10" />
        <img
          src="/Images/singularitynet.png"
          alt="SingularityNET"
          className="h-8 sm:h-10"
        />
        <img src="/Images/ocean.png" alt="Ocean" className="h-8 sm:h-10" />
        <img src="/Images/cudos.png" alt="Cudos" className="h-8 sm:h-10" />
      </div>
    </div>
  );
};

export default Investor;
