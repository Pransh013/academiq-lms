import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NavbarLogo } from "@/components/ui/navbar-logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex flex-col items-center justify-center gap-6 min-h-svh">
      <Button asChild className="absolute top-4 left-4" variant="outline">
        <Link href="/">
          <ArrowLeft /> Back to Home
        </Link>
      </Button>
      <NavbarLogo className="text-3xl" />
      <div className="w-full max-w-sm space-y-2">
        {children}
        <p className="text-xs text-center max-w-5/6 mx-auto text-muted-foreground *:[span]:font-medium *:[span]:cursor-pointer *:[span]:hover:text-foreground *:[span]:underline *:[span]:underline-offset-4">
          By clicking continue, you agree to our <span>Terms of Service</span>{" "}
          and <span>Privacy Policy.</span>
        </p>
      </div>
    </main>
  );
}
