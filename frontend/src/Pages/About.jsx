import React from "react";
import InfoCard from "../Components/InfoCard";
import { CheckCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:p-20 py-10 px-5">
      {/* Mission */}
      <InfoCard title="Mission">
        <div className="flex flex-col gap-6 ">
          <p>
            Hash Brain AI empowers the world with decentralized intelligence by
            merging blockchain transparency and real-time AI. Our mission is to
            deliver affordable, secure, and community-owned intelligence that
            transforms decision-making, connects crypto with AI, and ensures
            freedom from central control—making advanced knowledge accessible to
            everyone, everywhere.
          </p>
          <Link to={"/whitepaper"} target="_blank" className="px-4 py-5 bg-green-500 hover:bg-green-600 text-black text-[12px] rounded-full w-fit font-normal">
            About us
          </Link>
        </div>
      </InfoCard>

      {/* Why ASI Alliance */}
      <InfoCard title="Why Hash?">
        <ul className="space-y-2 ">
          {[
            "Decentralized Control",
            "Open Ecosystem",
            "Privacy First",
            "Transparent & Open Source",
            "Aligned Incentives",
            "Modular Infrastructure",
          ].map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {item}
            </li>
          ))}
        </ul>
      </InfoCard>

      {/* Join Us */}
      <InfoCard title="How it works">
        <ul className="space-y-3">
          {["CONNECT WALLET", "ASK", "GET OUTPUT"].map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" /> {item}
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
};

export default About;
