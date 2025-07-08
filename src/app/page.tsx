"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out successfully");
        },
      },
    });
  }
  return (
    <div>
      <Button>Hello World</Button>
      <ThemeToggle/>
      {session ? (
        <p>
          {session.user.name}
          <Button onClick={signOut}>Logout</Button>
        </p>
      ) : (
        <Button
          onClick={() => {
            router.push("/sign-in");
          }}
        >
          Sign-in
        </Button>
      )}
    </div>
  );
}
