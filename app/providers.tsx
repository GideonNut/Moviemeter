"use client";

import type React from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MovieProvider } from "@/lib/state/MovieContext";
import { config } from "@/lib/wagmi-config";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MovieProvider>{children}</MovieProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
