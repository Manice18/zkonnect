"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/components/Common/Logo";
import { BadgeCheck, CircleUserRound, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathUrl = usePathname();

  const isGetStarted = pathUrl.includes("get-started");

  return (
    <div className="fixed left-0 top-0 flex h-full w-72 flex-col items-center bg-[#F7F7F7]">
      <div className="mt-4">
        <Logo classname="h-12 w-20" />
      </div>

      <div className="mt-32 flex flex-col items-center space-y-16">
        <div
          className={cn(
            "relative flex items-center space-x-4",
            pathUrl.includes("verification") && "font-medium text-black",
            isGetStarted && "text-black",
          )}
        >
          <div className="rounded-md bg-white p-2">
            <CircleUserRound size={19} />
          </div>
          <h6>Creator details</h6>
          <div className="absolute left-[2px] top-10 h-[70px] -translate-x-1/2 transform border-l-2 border-dotted border-gray-400" />
        </div>
        <div
          className={cn(
            "relative flex w-full items-center space-x-4",
            pathUrl.includes("verification")
              ? "font-medium text-black"
              : "text-[#808080]",
            isGetStarted && "text-black",
          )}
        >
          <div className="rounded-md bg-white p-2">
            <BadgeCheck size={19} />
          </div>
          <h6>Verification</h6>
          <div className="absolute left-[2px] top-10 h-[70px] -translate-x-1/2 transform border-l-2 border-dotted border-gray-400" />
        </div>
        <div
          className={cn(
            "relative flex w-full items-center space-x-4",
            pathUrl.includes("get-started")
              ? "font-medium text-black"
              : "text-[#808080]",
            isGetStarted && "text-black",
          )}
        >
          <div className="rounded-md bg-white p-2">
            <Rocket size={19} />
          </div>
          <h6>Get Started!</h6>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
