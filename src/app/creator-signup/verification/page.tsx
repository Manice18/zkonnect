import Link from "next/link";

import { MoveRight } from "lucide-react";

import { constructMetaData } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import ProvidersComponent from "./_components/provider";

export const metadata = constructMetaData({
  title: "Creator Verification | zKonnect",
  description: "This is the creator verification of zKonnect",
});

const VerificationPage = () => {
  return (
    <section className="flex h-screen flex-col items-center pt-48">
      <div className="relative flex min-h-[400px] min-w-[800px] flex-col items-center justify-between">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-center text-3xl font-bold text-black">
            Connect with your LinkedIn <br />
            account to authenticate yourself
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Note: Your account will be verified only if your social <br />{" "}
            follower count is 10K+
          </p>
          <ProvidersComponent />
        </div>
      </div>
    </section>
  );
};

export default VerificationPage;
