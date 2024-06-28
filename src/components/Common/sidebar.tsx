"use client";
import Logo from "@/components/Common/Logo";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 flex h-full w-60 flex-col items-center bg-[#F7F7F7]">
      <div className="mt-4">
        <Logo classname="h-12 w-20" />
      </div>

      <div className="mt-32 flex flex-col items-center space-y-16">
        <div className="relative flex items-center space-x-4">
          <Image
            src="/assets/creator-avatar.svg"
            alt="zkonnect-logo"
            width={50}
            height={50}
            className="h-10 w-10"
          />
          <h6 className="font- text-black">Creator details</h6>
          <div className="left-2px absolute top-12 h-16 -translate-x-1/2 transform border-l-2 border-dotted border-gray-400"></div>
        </div>
        <div className="relative flex items-center space-x-4">
          <Image
            src="/assets/verification-avatar.svg"
            alt="zkonnect-logo"
            width={50}
            height={50}
            className="h-10 w-10"
          />
          <h6 className="text-gray-800">Verification</h6>
          <div className="left-2px absolute top-12 h-16 -translate-x-1/2 transform border-l-2 border-dotted border-gray-400"></div>
        </div>
        <div className="relative flex items-center space-x-4">
          <Image
            src="/assets/get_started-avatar.svg"
            alt="zkonnect-logo"
            width={50}
            height={50}
            className="h-10 w-10"
          />
          <h6 className="text-gray-800">Get Started</h6>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
