import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const NavbarLogo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="https://assets.aceternity.com/logo-dark.png"
        alt="logo"
        width={36}
        height={36}
      />
      <span className={cn("font-bold text-2xl text-foreground", className)}>
        Academiq
      </span>
    </Link>
  );
};
