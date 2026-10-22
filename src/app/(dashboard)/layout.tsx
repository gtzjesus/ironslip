import BottomNav from '../../components/common/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100dvh] w-full bg-black flex flex-col relative overflow-hidden">
      {/* El main ahora permite que sus hijos manejen el scroll fluidamente */}
      <main className="flex-1 w-full relative flex flex-col min-h-0 overflow-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}