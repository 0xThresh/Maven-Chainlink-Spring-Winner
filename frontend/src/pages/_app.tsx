import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
 
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()],
)

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

export default function App({ Component, pageProps }: AppProps) {
  return(
  <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
  </WagmiConfig>);
}
