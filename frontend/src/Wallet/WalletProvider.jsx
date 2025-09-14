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

// Build wagmi config with RainbowKit helper (no providers/public in v2)
const config = getDefaultConfig({
  appName: "Hash Brain",
  projectId: import.meta.env.VITE_WC_PROJECT_ID || "", // WalletConnect projectId
  chains: [mainnet, polygon, arbitrum, optimism, base, bsc, sepolia],
  ssr: false,
  autoConnect: true, // ✅ DO NOT auto-reconnect on load
});

const queryClient = new QueryClient();

export default function WalletProvider({ children }) {
  const themed = darkTheme({
    accentColor: "#000000",
    accentColorForeground: "#ffffff",
    borderRadius: "large",
    overlayBlur: "small",
  });

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
