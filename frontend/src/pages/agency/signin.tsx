import ScreenWrapper from "@/components/ScreenWrapper";
import Router from "next/router";
import { FormEvent, useEffect } from "react";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import mavenAbi from "@/artifacts/contracts/Maven.sol/Maven.json";
import { MAVEN_CONTRACT_ADDRESS } from "@/utils";
import { useActiveWallet } from "@lens-protocol/react-web";
import { hexDataSlice } from "ethers/lib/utils.js";
import Image from "next/image";

const Signin = () => {

  const {data:wallet} = useActiveWallet();

  const { data, isError, isLoading } = useContractRead({
    address: MAVEN_CONTRACT_ADDRESS,
    abi: mavenAbi.abi,
    functionName: "checkAgency",
    args:[wallet?.address]
  });


  //Just in case you want to whitelist an address
  /*const { config } = usePrepareContractWrite({
    address:MAVEN_CONTRACT_ADDRESS,
    abi: mavenAbi.abi,
    functionName: 'allowAgencyAddress',
    args:[wallet?.address, 'Kim agency']
  })

  const { isSuccess, write } = useContractWrite(config)*/

  const signin = (e:FormEvent) => {
    e.preventDefault();
    if(data) {
      Router.push("/agency/dashboard");
    }
  };

  return (
    <ScreenWrapper>
      <form onSubmit={signin} className="flex flex-col items-center animate-height-agency-form overflow-hidden">
        <Image height={50} width={50} src="/assets/imageplaceholder.svg" alt="placeholder image" className="h-24 mb-2" />

        <label htmlFor="profile" className="w-[100px] btn-primary py-1 rounded-md text-sm cursor-pointer">Upload</label>
        <input type="file" id="profile" hidden />
        <h2 className="text-2xl my-8 font-bold">{String(data)}</h2>
        <fieldset className="mt-6">
          <legend className="ml-3 translate-y-2 bg-bgColor px-1">Primary Language</legend>
          <select defaultValue={"English"} className="w-[300px] h-10 outline-none border-[1px] border-black pl-2 bg-bgColor">
            <option value="French">FRENCH</option>
            <option value="English">ENGLISH</option>
            <option value="Spanish">SPANISH</option>
          </select>
        </fieldset>
        
        <button type="submit" className="btn-primary h-10 w-[300px] mt-8">Submit</button>
      </form>
    </ScreenWrapper>
  );
};

export default Signin;