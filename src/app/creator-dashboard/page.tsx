import { constructMetaData } from "@/lib/metadata";
import Events from "./_components/events";
import Charts from "./_components/charts";
import Profile from "./_components/profile";
import CreateEvent from "./_components/create-event";

export const metadata = constructMetaData({
  title: "Dashboard | zKonnect",
  description: "Creator Dashboard of zKonnect",
});

const CreatorDashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="mb-6 ms-8 mt-24 flex text-2xl font-bold text-black">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Profile />
            <CreateEvent />
          </div>
          <div className="mt-4">
            <Charts />
          </div>
        </div>
        <div className="lg:col-span-1">
          <Events />
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboardPage;
