import Navbar from "@/components/Common/Navbar";

const CreatorLoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="h-screen bg-zkonnect-white-origin">{children}</main>
    </>
  );
};

export default CreatorLoginLayout;
