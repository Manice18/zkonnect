import Chatbot from "@/app/creator-dashboard/_components/chatbot";
import Navbar from "@/app/creator-dashboard/_components/navbar";

const CreatorLoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-screen bg-zkonnect-white-origin">{children}</main>
      {/* <Chatbot /> */}
    </div>
  );
};

export default CreatorLoginLayout;
