
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { polygonMumbai, mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { LensProvider, LensConfig, development } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { RecoilRoot } from "recoil";

const { provider, webSocketProvider } = configureChains([polygonMumbai, polygon, mainnet], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: development,
};

export default function App({ Component, pageProps }: AppProps) {

  return(
    <>
      <WagmiConfig client={client}>
        <LensProvider config={lensConfig}>
          <RecoilRoot>
            {/*@ts-ignore*/}
            <Component {...pageProps} />
          </RecoilRoot>
        </LensProvider>
      </WagmiConfig>;
    </>
  );
}

