"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useWallet } from "@solana/wallet-adapter-react";

import WalletConnectButton from "@/components/Wallet/wallet-connect-button";
import { getCreatorDataAction } from "@/actions";

export default function Home() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();

  const isCreatorVerified = async (pubKey: string) => {
    const { isVerified } = await getCreatorDataAction(pubKey);

    if (isVerified === true) {
      return router.push("/creator-dashboard");
    }
    return router.push("/creator-signup");
  };

  useEffect(() => {
    if (connected && publicKey) {
      isCreatorVerified(publicKey.toString());
    }
  }, [publicKey, connected]);
  return (
    <main>
      <section className="flex h-screen flex-col items-center justify-center space-y-8">
        <Image
          src="/assets/brand-icons/logo.svg"
          alt="zkonnect-logo"
          width={300}
          height={300}
          className="size-16"
        />
        <h1 className="text-center text-3xl font-black text-black">
          Welcome <br />
          to zKonnect
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          your web3 dapp for effortless event <br /> creation and participation!
        </p>

        <WalletConnectButton />
      </section>
    </main>
  );
}
