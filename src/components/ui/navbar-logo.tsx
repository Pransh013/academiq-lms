import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

export const NavbarLogo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={cn(
        "relative z-20 mr-4 flex items-center space-x-2 py-1 text-2xl font-bold text-foreground",
        className
      )}
    >
      <Image
        src="https://assets.aceternity.com/logo-dark.png"
        alt="logo"
        width={34}
        height={34}
      />
      <span>Academiq</span>
    </Link>
  );
};
