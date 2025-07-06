import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { SigninForm } from "./_components/signin-form";

export default async function SigninPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) return redirect("/");

  return <SigninForm />;
}
