"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { getUserDisplayMeta } from "@/lib/utils";
import { useSignout } from "@/lib/hooks/useSignout";
import { UserDropdownProps } from "@/lib/types";

function UserAvatarInfo({ name, email, image }: UserDropdownProps) {
  const { displayName, avatarImage, avatarFallback } = getUserDisplayMeta({
    name,
    email,
    image,
  });
  return (
    <>
      <Avatar className="size-9 rounded-lg">
        <AvatarImage src={avatarImage} alt={displayName} />
        <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{displayName}</span>
        <span className="text-muted-foreground truncate text-xs">{email}</span>
      </div>
    </>
  );
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session, isPending } = authClient.useSession();
  const { signOut } = useSignout();

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="size-9 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-36" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatarInfo
                name={session?.user.name ?? ""}
                email={session?.user.email ?? ""}
                image={session?.user.image ?? undefined}
              />
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatarInfo
                  name={session?.user.name ?? ""}
                  email={session?.user.email ?? ""}
                  image={session?.user.image ?? undefined}
                />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive">
              <IconLogout className="text-destructiv"/>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
