"use client";

import { useState } from "react";
import Image from "next/image";

import { toast } from "sonner";
import { Check, Plus, X } from "lucide-react";

import fetchVerificationData from "@/lib/reclaim/reclaim";

import { QRDialog } from "./QRDialog";

type Verified = {
  states: "verified" | "unverified" | "ineligible";
};

type ResponseData = {
  verified: boolean;
  followers: string;
  requestUrl: string;
};

const ProvidersComponent = () => {
  const [requestUrl, setRequestUrl] = useState<string>();
  const [verfied, setVerified] = useState<Verified>({ states: "unverified" });
  const [providerName, setProviderName] = useState<string>("");
  const [providerImageUrl, setProviderImageUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const handleVerification = async ({
    socialType,
    imageUrl,
  }: {
    socialType: string;
    imageUrl: string;
  }) => {
    if (!isOpen) {
      setIsOpen(true);
      setProviderName(socialType);
      setProviderImageUrl(imageUrl);
      await fetchVerificationData(
        setRequestUrl,
        socialType,
        (eventSourceInstance) => {
          setEventSource(eventSourceInstance);
        },
      )
        .then((data) => {
          const verifiedData = data as { verified: boolean };
          verifiedData.verified && setIsOpen(false);
          toast.success("Verification successful");
          const followers = data as ResponseData;
          if (parseInt(followers.followers.replace(/,/g, ""), 10) > 1000) {
            setVerified({ states: "verified" });
          } else {
            setVerified({ states: "ineligible" });
          }
        })
        .catch(() => {
          toast.error("Verification failed");
        });
    }
  };

  const closeDialog = () => {
    if (eventSource) {
      toast.info("Canceled verification request");
      eventSource.close();
      setEventSource(null);
    }
    setIsOpen(false);
  };

  return (
    <div
      className="flex h-[75px] cursor-pointer items-center justify-between rounded-lg border px-3 py-3 outline-zkonnect-gray backdrop-blur-sm backdrop-filter sm:px-6"
      onClick={() =>
        handleVerification({
          socialType: "linkedin",
          imageUrl: "linkedin.svg",
        })
      }
    >
      <div className="flex items-center space-x-7">
        <Image
          src={`/assets/provider/linkedin.svg`}
          alt="logo"
          className=""
          width={48}
          height={48}
        />
        <div>
          <p className="text-sm font-semibold text-black dark:text-white">
            LinkedIn Followers
          </p>
          <span className="text-xs text-muted-foreground">
            Number of followers you have in LinkedIn
          </span>
        </div>
      </div>
      {verfied.states === "unverified" ? (
        <Plus className="ml-28" size={18} />
      ) : verfied.states === "verified" ? (
        <Check className="ml-28 text-green-500" size={18} />
      ) : (
        <X className="ml-28 text-red-500" size={18} />
      )}

      {isOpen && (
        <QRDialog
          requestUrl={requestUrl}
          providerName={providerName}
          isOpen={isOpen}
          providerImage={providerImageUrl}
          setIsOpen={closeDialog}
        />
      )}
    </div>
  );
};

export default ProvidersComponent;
