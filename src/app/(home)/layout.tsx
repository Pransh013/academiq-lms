import { Footer } from "./_components/footer";
import { NavbarMain } from "./_components/navbar";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarMain />
      <div className="flex justify-center">{children}</div>
      <Footer />
    </div>
  );
}
