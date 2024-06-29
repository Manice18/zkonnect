import { MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import ProvidersComponent from "./_components/provider";
import Link from "next/link";

const Page = () => {
  return (
    <section className="flex h-screen flex-col items-center pt-48">
      <div className="flex min-h-[400px] min-w-[800px] flex-col items-center justify-between">
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
        <Link href="/dashboard" className="self-end">
          <Button className="space-x-9 px-7 py-5 text-sm">
            <span>Continue</span>
            <MoveRight size={20} />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Page;
