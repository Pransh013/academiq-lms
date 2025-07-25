import { env } from "@/env/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserDisplayMeta(user: {
  name?: string;
  email?: string;
  image?: string;
}) {
  const getDisplayName = () => {
    if (user.name && user.name.length > 0) return user.name;
    if (user.email && user.email.length > 0) return user.email.split("@")[0];
    return "User";
  };

  const getAvatarImage = () => {
    if (user.image && user.image.length > 0) return user.image;
    if (user.email && user.email.length > 0)
      return `https://avatar.vercel.sh/${user.email}`;
    return undefined;
  };

  const getAvatarFallback = () => {
    if (user.name && user.name.length > 0) return user.name[0].toUpperCase();
    if (user.email && user.email.length > 0) return user.email[0].toUpperCase();
    return "U";
  };

  return {
    displayName: getDisplayName(),
    avatarImage: getAvatarImage(),
    avatarFallback: getAvatarFallback(),
  };
}

export function construcUrl(key: string) {
  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.fly.storage.tigris.dev/${key}`;
}

export function formatDuration(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs && mins) return `${hrs}h ${mins}min`;
  if (hrs) return `${hrs}h`;
  return `${mins}min`;
}
