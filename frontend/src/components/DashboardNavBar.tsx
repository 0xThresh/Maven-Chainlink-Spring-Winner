import { useAccount, useConnect, useEnsName } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected'

const DashboardNavBar = () => {
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  return (
    <div className=' border-b-2 border-slate-800 flex px-3 items-center justify-between
    '>
      <img src="/assets/logo.svg" alt="" className="h-16 w-16" />
      <button className={`bg-slate-800 text-white py-2 px-5 en rounded-full overflow-hidden ${address && !ensName ? "w-36 truncate justify-items-start" : ""}`} onClick={() => connect()}>{`${isConnected ? ensName ?? address : "Connect"}`}</button>
    </div>
  )
}

export default DashboardNavBar