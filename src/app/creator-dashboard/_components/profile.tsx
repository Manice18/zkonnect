import Image from "next/image";

const Profile = () => {
  return (
    <div className="mt-4 grid grid-cols-6 gap-4 md:grid-cols-5">
      <div className="ms-6 mt-2 rounded-md bg-white p-6 shadow-md">
        <div className="mb-5 flex items-center justify-center">
          <Image
            src="/assets/brand-icons/logo.svg"
            width={60}
            height={60}
            alt="Michael Angelio"
            className="h-20 w-20 rounded-full"
          />
        </div>
        <h2 className="mb-2 text-lg font-bold">Michael Angelio</h2>
        <p className="text-gray-500">Creator</p>
      </div>
      <div className="ms-6 mt-2 rounded-md bg-white p-6 shadow-md">
        <div className="mb-5 flex items-center justify-center">
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
