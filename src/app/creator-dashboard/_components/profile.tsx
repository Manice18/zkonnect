"use client";
import Image from "next/image";

const Profile = () => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-md bg-white p-4 shadow-md">
        <div className="mb-4 flex items-center justify-center">
          <Image
            src=""
            alt="Michael Angelio"
            className="h-20 w-20 rounded-full"
          />
        </div>
        <h2 className="mb-2 text-lg font-bold">Michael Angelio</h2>
        <p className="text-gray-500">Creator</p>
      </div>
    </div>
  );
};

export default Profile;
