"use client"

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "../auth-client";

export function useSignout() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out successfully");
        },
        onError: () => {
          toast.error("Something went wrong while signing out.");
        },
      },
    });
  }

  return { signOut };
}
