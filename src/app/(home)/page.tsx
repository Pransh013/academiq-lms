"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useSignout } from "@/lib/hooks/useSignout";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { signOut } = useSignout();
  return (
    <>
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
    </>
  );
}
