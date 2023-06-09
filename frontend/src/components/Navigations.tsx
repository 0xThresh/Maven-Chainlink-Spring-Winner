import { profileHandlesState, selectedHandleState } from "@/store";
import { formatPicture } from "@/utils";
import { useProfile } from "@lens-protocol/react-web";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useContractRead } from "wagmi";
import { MAVEN_CONTRACT_ADDRESS } from "@/utils";
import { useActiveWallet } from "@lens-protocol/react-web";
import mavenAbi from "@/artifacts/contracts/Maven.sol/Maven.json";
import Image from "next/image";

type NavigationBoardProps = {
  dashboardName: string
  profileName:string 
  connected: boolean
}

const Navigations = ({isUserDashboard}:{isUserDashboard?:boolean}) => {

  const [leftArrowDisbaled, setLeftArrowDisabled] = useState(false);
  const [rightArrowDisbaled, setRightArrowDisabled] = useState(false);
  const {data:wallet} = useActiveWallet();

  const [handleIndex, setHandleIndex] = useRecoilState(selectedHandleState);
  const handles = useRecoilValue(profileHandlesState);


  const { data:profile } = useProfile({handle:handles[handleIndex] || "zzzzzz.test"});

  const { data:agencyName, isError, isLoading } = useContractRead({
    address: MAVEN_CONTRACT_ADDRESS,
    abi: mavenAbi.abi,
    functionName: "checkAgency",
    args:[wallet?.address]
  });

  const moveToPreviousHandle = () => {
    setRightArrowDisabled(false);
    if(handleIndex <= 0) {
      return setLeftArrowDisabled(true);
    }
    setHandleIndex(handleIndex-1);

  };

  const moveToNextHandle = () => {
    setLeftArrowDisabled(false);
    if(handleIndex >= handles.length-1) {
      return setRightArrowDisabled(true);
    }
    setHandleIndex(handleIndex+1);
  };

  return (
    <>
      <NavigationBoard dashboardName={isUserDashboard ? "User" : "Agency"} profileName={isUserDashboard ? profile?.handle! : String(agencyName)} connected={ isUserDashboard ? profile?.ownedByMe ? true : false : agencyName?true:false}/>
      <div className="w-full h-10 sm:h-14 flex items-center justify-center sm:justify-start bg-neutralGray rounded-lg border-2 border-gray-600">
        <div className="h-full flex items-center mx-10 sm:mx-16">
          {
            profile?.picture?.__typename === "MediaSet" && (
              <Image height={50} width={50}
                alt={profile.handle}
                className="h-8 w-8 sm:h-10 sm:w-10 mr-3 sm:mr-6 rounded-full"
                src={formatPicture(profile.picture)}
              />
            )
          }
          <h2 className="w-24">{profile?.handle}</h2>  
        </div>
        <div className="flex">
          {!leftArrowDisbaled && <button onClick={moveToPreviousHandle}><Image height={50} width={50} src="/assets/arrowLeft.svg" className="h-3 w-3 sm:h-5 sm:w-5 mr-1 sm:mr-3" alt="" /></button>}
          {!rightArrowDisbaled && <button onClick={moveToNextHandle}><Image height={50} width={50} src="/assets/arrowRight.svg" className={`h-3 w-3 sm:h-5 sm:w-5 ${leftArrowDisbaled ? "ml-11":"ml-3"}`} alt="" /></button>}
        </div>
      </div>
    </>
  );
};

const NavigationBoard = ({dashboardName, profileName, connected}:NavigationBoardProps) => {
  return (
    <div className="w-full hidden h-14 sm:flex items-center bg-neutralGray rounded-lg border-2 my-4 border-gray-600">
      <div className="w-8/12  h-full flex items-center justify-between">
        <div className="h-full flex items-center mx-12">
          <Image height={50} width={50} className="h-5 w-5 mr-4 rounded-full" src="/assets/homeIcon.svg" alt=""/>
          <h2>{dashboardName} Dashboard</h2>  
        </div>
        <div className="flex items-center">
          <div className="mr-3 bg-gray-800 text-white py-1 px-4">In Progress</div>
          <div className="mr-3">Completed</div>
          <div>All</div>
        </div>
        
      </div>
        
      <div className="flex justify-end w-4/12 mr-16">
        <span className="mr-4">{profileName}</span>
        <button className="text-sm text-gray-500"><i>{connected ? "Connected" : "Not connected"}</i></button>
      </div>
    </div>
  );
};

export default Navigations;