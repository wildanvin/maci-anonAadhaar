"use client";

import { useEffect } from "react";
import Image from "next/image";
import RegisterWithAadhaarProof from "./_components/RegisterWithAadhaarProof";
// import AadhaarProofButton from "./_components/AadhaarProofButton";
// import RegisterButton from "./_components/RegisterButton";
import { AnonAadhaarProof, LogInWithAnonAadhaar, useAnonAadhaar, useProver } from "@anon-aadhaar/react";
import type { NextPage } from "next";
import HeroImage from "~~/assets/private_voting.png";
import { useAuthUserOnly } from "~~/hooks/useAuthUserOnly";

const Home: NextPage = () => {
  useAuthUserOnly({ inverted: true });
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      console.log(anonAadhaar.status);
    }
  }, [anonAadhaar]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-4xl font-bold text-center">Private Voting Starter Kit with MACI & AnonAadhaar</h1>

          <div className="flex flex-col-reverse md:flex-row justify-center items-center mt-10 sm:w-2/3 mx-auto gap-x-10 gap-y-5 mb-10">
            <div className="flex-1">
              <p className="text-lg mt-5 text-justify">
                This starter kit is designed to help you get started with private voting using the Minimal
                Anti-Collusion Infrastructure (MACI) and AnonAadhaar. It is still in the hacking phase, but you get the
                idea.
              </p>
              <div className="text-center">
                {/* <RegisterButton /> */}
                {/* <AadhaarProofButton /> */}
                <LogInWithAnonAadhaar nullifierSeed={1356901} />
                {/* Render the proof if generated and valid */}
                {anonAadhaar.status === "logged-in" && (
                  <>
                    <p>✅ Proof is valid</p>
                    <p>Welcome anon!</p>
                    <p>With you AnonAadhaar proof you can Login and Register with MACI to vote</p>
                    <RegisterWithAadhaarProof />
                    {latestProof && <AnonAadhaarProof code={JSON.stringify(latestProof, null, 2)} />}
                  </>
                )}
              </div>
            </div>
            <div className="flex-1">
              <Image src={HeroImage} alt="MACI" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
