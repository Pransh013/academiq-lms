import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex flex-col items-center justify-center gap-6 min-h-svh">
      <Button asChild className="absolute top-4 left-4" variant="outline">
        <Link href="/">
          <ArrowLeft /> Back to home
        </Link>
      </Button>
      <div className="flex justify-center items-center gap-3">
        <div className="size-10 bg-gradient-to-r from-orange-800 to-orange-500 rounded-lg flex items-center justify-center">
          <GraduationCap className="size-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent">
          Academiq-LMS
        </h1>
      </div>
      <div className="w-full max-w-sm space-y-2">
        {children}
        <p className="text-xs text-center max-w-5/6 mx-auto text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <span className="font-medium underline">Terms of Service</span> and{" "}
          <span className="font-medium underline">Privacy Policy.</span>
        </p>
      </div>
    </main>
  );
}
