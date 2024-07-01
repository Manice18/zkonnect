import { constructMetaData } from "@/lib/metadata";
import Events from "./_components/events";

export const metadata = constructMetaData({
  title: "Creator Dashboad | zKonnect",
  description: "This is the Creator Dashboad Page of zKonnect",
});

const CreatorDashboardPage = () => {
  return (
    <div>
      <h1 className="ms-8 mt-24 flex text-2xl font-bold text-black">
        Dashboard
      </h1>
      <Events />
    </div>
  );
};

export default CreatorDashboardPage;
