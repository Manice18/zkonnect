"use-client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const Profile = () => {
  return (
    <Card>
      <CardTitle className="m-4">Profile</CardTitle>
      <CardContent className="mt-6 flex flex-col items-center p-6">
        <Image
          src="/assets/dashboard/creator-profile.svg"
          width={120}
          height={120}
          alt="Creator Profile"
          className="rounded-full"
        />
        <h2 className="mt-4 text-xl font-semibold">Michael Angelio</h2>
        <p className="text-sm text-gray-500">Creator</p>
      </CardContent>
    </Card>
  );
};

export default Profile;
