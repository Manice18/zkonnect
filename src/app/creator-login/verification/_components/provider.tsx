"use client";

import { useState } from "react";
import Image from "next/image";

import { toast } from "sonner";
import { Plus } from "lucide-react";

import fetchVerificationData from "@/lib/reclaim/reclaim";

import { QRDialog } from "./QRDialog";

const ProvidersComponent = () => {
  const [requestUrl, setRequestUrl] = useState<string>();
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
          socialType: "aadhaar",
          imageUrl: "twitter.svg",
        })
      }
    >
      <div className="flex items-center space-x-7">
        <Image
          src={`/assets/provider/twitter.svg`}
          alt="logo"
          className=""
          width={48}
          height={48}
        />
        <div>
          <p className="text-sm font-semibold text-black dark:text-white">
            X Followers
          </p>
          <span className="text-xs text-muted-foreground">
            Number of followers you have in X
          </span>
        </div>
      </div>

      <Plus className="ml-28" size={16} />

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
