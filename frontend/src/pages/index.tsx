import ScreenWrapper from '@/components/ScreenWrapper'
import Router from 'next/router'
import { useWalletLogin } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function Home() {

  const { isConnected } = useAccount()

  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin();

  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const signin = async(userType:string) => {
    if(userType=='user') {
      if (isConnected) {
        await disconnectAsync();
      }
  
      const { connector } = await connectAsync();
  
      if (connector instanceof InjectedConnector) {
        const signer = await connector.getSigner()
        await login(signer)
        Router.push('/user/signin')
      }
    } else {
      Router.push('/agency/signin')
    }
  }

  return (
    <ScreenWrapper>
      <div className='w-11/12 mt-12 sm:w-9/12 md:w-6/12 lg:w-3/12 lg:mt-0 flex flex-col items-center md:flex-row justify-between'>
        <span className='flex items-center justify-center py-2 px-4 mb-4 md:mb-0 w-60 md:w-40 text-lg rounded-[26px] bg-slate-800 text-white hover:text-slate-800 hover:bg-white hover:border-[1px] hover:border-slate-800'>
          <button className='h-full w-full' onClick={() => signin('agency')}>
            Agency login
          </button>
        </span>
        <span className='flex items-center justify-center py-2 px-4 w-60 md:w-40 text-lg rounded-[26px] border-[1px] border-slate-800 bg-[#E9E8E4] hover:bg-slate-800 hover:text-white'>
          <button className='h-full w-full' onClick={() => signin('user')}>
            User login
          </button>
        </span>  
      </div>
    </ScreenWrapper>
  );
}


