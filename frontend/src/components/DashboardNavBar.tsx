import Image from "next/image";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const DashboardNavBar = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const truncatedAddress = `${address?.slice(0,5)}...${address?.slice(address.length - 5)}`;

  return (
    <div className=" border-b-2 border-slate-800 flex px-3 items-center justify-between
    ">
      <Image height={50} width={50} src="/assets/logo.svg" alt="" className="h-16 w-16" />
      <button className={"bg-slate-800 text-white py-2 px-5 en rounded-full w-36 justify-items-start"} onClick={() => connect()}>{`${isConnected ? truncatedAddress : "Connect"}`}</button>
    </div>
  );
};

export default DashboardNavBar;