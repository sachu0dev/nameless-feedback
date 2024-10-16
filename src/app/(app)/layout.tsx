import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full m-auto overflow-hidden">
      <Navbar />
      <main>{children}</main>
    </main>
  );
}
