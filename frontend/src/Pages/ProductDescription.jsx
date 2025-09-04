import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const ProductDescription = () => {
  return (
    <div className="grid grid-cols-1  gap-6 sm:p-20 py-10 px-5  bg-black/85 text-white">
      <h1 className="text-3xl">Products</h1>
      <Card className="rounded-2xl shadow-md border border-green-300 sm:px-10 bg-black text-white">
        <CardContent className="sm:p-10 space-y-4 ">
          <h2 className="text-2xl  bg-green-600 w-fit px-5 py-1 text-center rounded-full">
            Featured
          </h2>
          {/* <h3 className="text-6xl">Mission </h3> */}
          <p >
            Hash Brain Is Like a Chat-Gpt Build On The Blockchain{" "}
                      <br className="hidden sm:block" />
          Fully Decentralized, Secure and Community Owned.
          <br className="hidden sm:block" />
          It's time to join the revolution
          </p>
          <div className="flex gap-5">
            <Button className="px-6 py-5 border-2 border-green-600 bg-transparent hover:bg-green-600  text-[12px] rounded-full w-fit font-normal">
              <Link
                to={
                  "https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x49AD6291d5E0EfAd94E204fFFe6BA3668C6ceE47"
                }
                target="_blank"
              >
                Start Trading
              </Link>
            </Button>
            <Button className="px-6 py-5 bg-transparent border-2 border-green-600 hover:bg-green-600 text-[12px] rounded-full w-fit font-normal">
             <Link to={"/chat"} target="_blank">
                        Chat Ai
                        </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDescription;
