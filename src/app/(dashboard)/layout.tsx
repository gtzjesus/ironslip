import BottomNav from '../components/dashboard/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Scrollable Area for Content */}
      <main className="pb-24">{children}</main>

      {/* Persistent Navigation */}
      <BottomNav />
    </div>
  );
}
