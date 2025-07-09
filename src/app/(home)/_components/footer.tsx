import Link from "next/link";
import { Github, Mail, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NavbarLogo } from "@/components/ui/resizable-navbar";

const socialLinks = [
  {
    href: "https://x.com",
    label: "Twitter",
    icon: Twitter,
    external: true,
  },
  {
    href: "https://github.com",
    label: "GitHub",
    icon: Github,
    external: true,
  },
  {
    href: "mailto:contact@academiq.com",
    label: "Email",
    icon: Mail,
    external: false,
  },
];

const productLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/api", label: "API" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const supportLinks = [
  { href: "/help", label: "Help Center" },
  { href: "/status", label: "Status" },
  { href: "/security", label: "Security" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 pt-8 pb-2">
        <div className="flex justify-between flex-wrap gap-3">
          <div className="space-y-4">
            <NavbarLogo />
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering education through innovative learning management
              solutions.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map(({ href, label, icon: Icon, external }) => (
                <Button key={label} variant="outline" size="icon" asChild>
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Academiq LMS. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 sm:space-x-6 text-[13px] sm:text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
