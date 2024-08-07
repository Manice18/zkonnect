const EventLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <main className="h-screen bg-zkonnect-white-origin">{children}</main>
    </div>
  );
};

export default EventLayout;
