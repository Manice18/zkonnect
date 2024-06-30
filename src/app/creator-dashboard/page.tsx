// import Profile from "./_components/profile";
import Events from "./_components/events";
import DialogflowMessenger from "./_components/DialogflowMessenger";

const Page = () => {
  return (
    <div>
      <h1 className="ms-8 mt-24 flex text-2xl font-bold text-black">
        Dashboard
      </h1>
      <Profile />
      <DialogflowMessenger />
      {/* <Events /> */}
    </div>
  );
};

export default Page;
