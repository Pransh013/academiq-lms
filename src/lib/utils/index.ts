import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
