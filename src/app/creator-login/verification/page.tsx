import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProvidersComponent from "./_components/provider";

const Page = () => {
  return (
    <section className="flex h-screen flex-col items-center pt-48">
      <div className="flex min-h-[400px] min-w-[800px] flex-col items-center space-y-8">
        <h1 className="text-center text-3xl font-bold text-black">
          Connect with your X account <br />
          to authenticate yourself
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Note: Your account will be verified only if your social <br />{" "}
          follower count is 10K+
        </p>
        <ProvidersComponent />
        <Button className="space-x-9 self-end px-7 py-5 text-sm">
          <span>Continue</span>
          <MoveRight size={20} />
        </Button>
      </div>
    </section>
  );
};

export default Page;
