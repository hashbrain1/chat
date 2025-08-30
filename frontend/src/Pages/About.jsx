import React from "react";
import InfoCard from "../Components/InfoCard";
import { CheckCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";

const About = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:p-20 py-10 px-5 bg-gray-300">
      {/* Mission */}
      <InfoCard title="Mission">
        <div className="flex flex-col gap-6">
          <p className="text-gray-600">
            Our mission is to decentralize AI. We provide a robust, open-source
            innovation stack that empowers developers, enterprises, and
            researchers worldwide to build ethical, scalable, and groundbreaking
            AI solutions, ensuring that advanced intelligence remains a shared,
            accessible resource.
          </p>
          <Button className="px-6 py-5 bg-green-500 hover:bg-green-600 text-black text-[12px] rounded-full w-fit font-normal">
            About us
          </Button>
        </div>
      </InfoCard>

      {/* Why ASI Alliance */}
      <InfoCard title="Why Hash?">
        <ul className="space-y-2 text-gray-600">
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
      <InfoCard title="Join us">
        <ul className="space-y-3 text-gray-600">
          {[
            "Hash Token ($FET)",
            "Chat Ai",
            "Start Building with Hash",
            "Grants",
            "Community Overview",
          ].map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-gray-500" /> {item}
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
};

export default About;
