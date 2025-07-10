import { Footer } from "./_components/footer";
import { NavbarMain } from "./_components/navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavbarMain />
      <main className="container mx-auto px-4 md:px-8 border min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}
