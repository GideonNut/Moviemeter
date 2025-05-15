import { http, createConfig } from "wagmi"
import { celoAlfajores } from 'wagmi/chains'
import { farcasterFrame as miniAppConnector } from '@farcaster/frame-wagmi-connector'

// This is the configuration for the wagmi library, which is used for Ethereum and EVM-compatible blockchain interactions.
// It sets up the Celo Alfajores testnet as the default chain and configures the Farcaster Frame connector for wallet connections.
// The `createConfig` function is used to create a configuration object for the wagmi library.
// The `createConfig` function is called with the chains, transports, and connectors to create the final configuration object.
// The `http` transport is used to communicate with the blockchain nodes.
// The `miniAppConnector` is a custom connector for the Farcaster Frame wallet.
// The `celoAlfajores` chain is imported from the wagmi library and is used to set up the Celo Alfajores testnet.
// The `config` object is then exported for use in the application.
export const config = createConfig({
  chains: [celoAlfajores],
  transports: {
    [celoAlfajores.id]: http(),
  },
  connectors: [
    miniAppConnector()
  ]
})