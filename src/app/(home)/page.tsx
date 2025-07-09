"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function HomePage() {
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
    <main className="w-full h-screen max-w-7xl px-4 md:px-8 border">
      <Button>Hello World</Button>
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
    </main>
  );
}
