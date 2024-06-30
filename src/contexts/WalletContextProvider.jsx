"use client";

import { useMemo } from "react";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  AlphaWalletAdapter,
  AvanaWalletAdapter,
  BitpieWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  CoinhubWalletAdapter,
  FractalWalletAdapter,
  HuobiWalletAdapter,
  HyperPayWalletAdapter,
  KeystoneWalletAdapter,
  KrystalWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  NekoWalletAdapter,
  NightlyWalletAdapter,
  NufiWalletAdapter,
  OntoWalletAdapter,
  ParticleAdapter,
  SafePalWalletAdapter,
  SaifuWalletAdapter,
  SalmonWalletAdapter,
  SkyWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
  SpotWalletAdapter,
  TokenaryWalletAdapter,
  TokenPocketWalletAdapter,
  TorusWalletAdapter,
  TrustWalletAdapter,
  WalletConnectWalletAdapter,
  XDEFIWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletContextProvider = ({ children }) => {
  const endpoint = useMemo(
    () =>
      "https://mainnet.helius-rpc.com/?api-key=f1ef8b37-29b4-4b4b-9ca9-0ddf429d4e28",
    [],
  );
  const wallets = [
    new AlphaWalletAdapter(),
    new AvanaWalletAdapter(),
    new BitpieWalletAdapter(),
    new CloverWalletAdapter(),
    new Coin98WalletAdapter(),
    new CoinbaseWalletAdapter(),
    new CoinhubWalletAdapter(),
    new FractalWalletAdapter(),
    new HuobiWalletAdapter(),
    new HyperPayWalletAdapter(),
    new KeystoneWalletAdapter(),
    new KrystalWalletAdapter(),
    new LedgerWalletAdapter(),
    new MathWalletAdapter(),
    new NekoWalletAdapter(),
    new NightlyWalletAdapter(),
    new NufiWalletAdapter(),
    new OntoWalletAdapter(),
    new ParticleAdapter(),
    new SafePalWalletAdapter(),
    new SaifuWalletAdapter(),
    new SalmonWalletAdapter(),
    new SkyWalletAdapter(),
    new SolflareWalletAdapter(),
    new SolongWalletAdapter(),
    new SpotWalletAdapter(),
    new TokenaryWalletAdapter(),
    new TokenPocketWalletAdapter(),
    new TorusWalletAdapter(),
    new TrustWalletAdapter(),
    new WalletConnectWalletAdapter(),
    new XDEFIWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
