import { celoMainnet } from "./blockchain-service"

// Token configurations for supported tokens (Celo network only)
export const supportedTokens = {
  [celoMainnet.id]: [
    {
      address: "0x67c10c397dd0ba9a6c3c783eb07abc25e31f34a5",
      name: "GoodDollar",
      symbol: "G$",
      icon: "https://raw.githubusercontent.com/GoodDollar/GoodContracts/master/contracts/artifacts/GoodDollar.png",
    },
    {
      address: "0x765de816845861e75a25fca122bb6898b8b1282a",
      name: "Celo Dollar",
      symbol: "cUSD",
      icon: "https://celo.org/static/media/celo-dollar.8f3c1b0d.svg",
    },
  ],
}

// GoodDollar token configuration
export const goodDollarToken = {
  address: "0x67c10c397dd0ba9a6c3c783eb07abc25e31f34a5",
  name: "GoodDollar",
  symbol: "G$",
  icon: "https://raw.githubusercontent.com/GoodDollar/GoodContracts/master/contracts/artifacts/GoodDollar.png",
}

// Celo Dollar token configuration
export const celoDollarToken = {
  address: "0x765de816845861e75a25fca122bb6898b8b1282a",
  name: "Celo Dollar",
  symbol: "cUSD",
  icon: "https://celo.org/static/media/celo-dollar.8f3c1b0d.svg",
} 