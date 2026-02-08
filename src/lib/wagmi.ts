"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Polywallets",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "dc2c403ad55da7f251854f73f17fda91",
  chains: [polygon],
  ssr: true,
});
