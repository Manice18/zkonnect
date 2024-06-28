import Navbar from "@/components/Common/Navbar";
import Sidebar from "@/components/Common/sidebar";

const CreatorLoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-screen bg-zkonnect-white-origin">{children}</main>
      <Sidebar />
    </div>
  );
};

export default CreatorLoginLayout;
