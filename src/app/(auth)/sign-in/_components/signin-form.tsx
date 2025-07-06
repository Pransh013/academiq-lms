"use client";

import { useTransition } from "react";
import { GithubIcon, Loader, Mail } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function SigninForm() {
  const [isPending, startTransition] = useTransition();

  async function signinWithGitHub() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in successfully");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription className="">
          Sign in to continue your learning journey
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          onClick={signinWithGitHub}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <GithubIcon />
              Continue with GitHub
            </>
          )}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <Button className="w-full cursor-pointer">
            <Mail className="mr-2" />
            Continue with Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
