"use client";

import Link from "next/link";
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    href: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-6 lg:gap-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/85 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 transition-colors duration-100 ease-linear"
              asChild
              isActive={pathname === "/admin/courses/new"}
            >
              <Link href="/admin/courses/new">
                <IconCirclePlusFilled />
                <span>Quick Create</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={pathname === item.href}
              >
                <Link href={item.href}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
