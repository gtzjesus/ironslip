import BottomNav from '../components/common/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden bg-black flex flex-col">
      {/* If you have a global Nav, it goes here */}
      <main className="flex-grow overflow-hidden">{children}</main>
      <BottomNav />
    </div>
  );
}
