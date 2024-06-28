import { Button } from "@/components/ui/button";
import Image from "next/image";
import { User } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="flex h-screen flex-col items-center justify-center space-y-8">
        <Image
          src="/assets/icons/logo.svg"
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

        <Link href="/creator-login">
          <Button
            variant="default"
            size="lg"
            className="flex items-center justify-between space-x-6"
          >
            <User size={16} />
            <span className="text-xs">Join as Creator</span>
          </Button>
        </Link>
      </section>
    </main>
  );
}
