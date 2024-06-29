"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const [collectionAddress, setCollectionAddress] = useState<string>("");
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-2xl rounded-lg bg-[#1A1A1A] p-8">
        <h1 className="mb-6 text-2xl font-bold text-white">
          Create Token Gated Room
        </h1>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Enter Collection Address"
            onChange={(e) => setCollectionAddress(e.target.value)}
          />
          <Button
            className="bg-slate-600 hover:bg-slate-500"
            onClick={async () => {
              const apiResponse = await fetch(
                `api/createRoom?collectionAddress=${collectionAddress}`,
              );
              const { roomId } = await apiResponse.json();
              router.push(`/meet/${roomId}`);
            }}
          >
            Submit
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Page;
