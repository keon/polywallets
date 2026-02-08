"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, lightTheme, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ThemeProvider, useTheme } from "next-themes";
import { config } from "@/lib/wagmi";
import { useState, useEffect } from "react";

function RainbowKitWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <RainbowKitProvider
      theme={
        isDark
          ? darkTheme({
              accentColor: "#00C805",
              borderRadius: "small",
            })
          : lightTheme({
              accentColor: "#00C805",
              borderRadius: "small",
            })
      }
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitWrapper>
            {children}
          </RainbowKitWrapper>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
