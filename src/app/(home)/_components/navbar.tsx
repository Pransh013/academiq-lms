"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./resizable-navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { NavbarLogo } from "@/components/ui/navbar-logo";
import { UserDropdown } from "./user-dropdown";

export function NavbarMain() {
  const { data: session, isPending } = authClient.useSession();
  const navItems = [
    { name: "Features", link: "/features" },
    { name: "Pricing", link: "/pricing" },
    { name: "Contact", link: "/contact" },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full h-24">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-3 relative">
            <ThemeToggle />
            {isPending ? (
              <Skeleton className="size-9 rounded-full" />
            ) : session?.session ? (
              <UserDropdown
                email={session.user.email}
                name={session.user.name}
                image={session.user.image ?? undefined}
              />
            ) : (
              <Button
                variant="ghost"
                className="cursor-pointer hover:-translate-y-0.5 transition duration-200 hover:bg-transparent dark:hover:bg-transparent"
                asChild
                disabled={isPending}
              >
                <Link href="/sign-in">Login</Link>
              </Button>
            )}
            <Button
              className="bg-primary text-primary-foreground cursor-pointer hover:-translate-y-0.5 transition duration-200"
              asChild
              disabled={isPending}
            >
              <Link href={session?.session ? "/dashboard" : "/sign-in"}>
                Get Started
              </Link>
            </Button>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>
          <MobileNavMenu isOpen={isMobileMenuOpen} className="">
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex flex-col gap-4">
              {isPending ? (
                <Skeleton className="size-9 rounded-full" />
              ) : session?.session ? (
                <Avatar>
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback>{session.user.name[0] ?? "U"}</AvatarFallback>
                </Avatar>
              ) : (
                <Button
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="ghost"
                  className="cursor-pointer hover:-translate-y-0.5 transition duration-200 hover:bg-transparent dark:hover:bg-transparent"
                  asChild
                  disabled={isPending}
                >
                  <Link href="/sign-in">Login</Link>
                </Button>
              )}
              <Button
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-primary text-primary-foreground cursor-pointer hover:-translate-y-0.5 transition duration-200"
                asChild
                disabled={isPending}
              >
                <Link href={session?.session ? "/dashboard" : "/sign-in"}>
                  Get Started
                </Link>
              </Button>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
