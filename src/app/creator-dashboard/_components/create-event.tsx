"use-client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const CreateEvent = () => {
  return (
    <Card>
      <CardTitle className="m-4">Create Event</CardTitle>
      <CardContent className="flex flex-col items-center p-6">
        <Image
          src="/assets/dashboard/ai-icon.svg"
          width={100}
          height={100}
          alt="Creator Profile"
          className="h-30 w-30 rounded-full"
        />
        <p className="mb-4 mt-2 text-center text-sm text-gray-500">
          Achieve Effortless Challenge <br />
          Creation with AI
        </p>
      </CardContent>
    </Card>
  );
};

export default CreateEvent;
