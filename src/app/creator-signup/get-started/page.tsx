import Link from "next/link";

import { MoveRight } from "lucide-react";
import Image from "next/image";

import { constructMetaData } from "@/lib/metadata";
import { Button } from "@/components/ui/button";

export const metadata = constructMetaData({
  title: "Creator Verification | zKonnect",
  description: "This is the creator verification of zKonnect",
});

const getStartedPage = () => {
  return (
    <section className="flex h-screen flex-col items-center pt-20">
      <div className="flex min-h-[400px] min-w-[800px] flex-col items-center justify-between">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-center text-3xl font-bold text-black">
            Welcome, Creator <br />
            Let's Make Magic Happen! ✨
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            We're thrilled to have you here, Let's get started on <br />{" "}
            creating something amazing!{" ;)"}
          </p>
          <Image
            src="/assets/get-started_bg.svg"
            alt="get-stareted bg"
            width={338}
            height={338}
          />
          <Link href="/dashboard" className="items-center justify-between">
            <Button className="space-x-9 px-7 py-7 text-sm">
              <span>Get Started</span>
              <MoveRight size={30} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default getStartedPage;
