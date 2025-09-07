import React from "react";
import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  bsc,
  sepolia,
} from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

const config = getDefaultConfig({
  appName: "Hash Brain",
  projectId: import.meta.env.VITE_WC_PROJECT_ID || "",
  chains: [mainnet, polygon, arbitrum, optimism, base, bsc, sepolia],
  ssr: false,
  autoConnect: true, // reconnect after refresh
});

const queryClient = new QueryClient();

export default function WalletProvider({ children }) {
  // Theme the RainbowKit connect pill to black/white so it matches your navbar
  const themed = (() => {
    const base = darkTheme({
      accentColor: "#000000",
      accentColorForeground: "#ffffff",
      borderRadius: "large",
      overlayBlur: "small",
    });
    return {
      ...base,
      colors: {
        ...base.colors,
        connectButtonBackground: "#000000",
        connectButtonInnerBackground: "#000000",
        connectButtonText: "#ffffff",
      },
      radii: {
        ...base.radii,
        connectButton: "0.75rem", // rounded-xl
      },
    };
  })();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={themed}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
