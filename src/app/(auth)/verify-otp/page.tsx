"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { verifyOtpSchema } from "@/lib/schemas";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [isOtpPending, startOtpTransition] = useTransition();
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email");

  useEffect(() => {
    if (!email) {
      router.replace("/sign-in");
    }
  }, [email, router]);

  if (!email) return null;

  function verifyOtp() {
    const result = verifyOtpSchema.safeParse({ email, otp });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    startOtpTransition(async () => {
      await authClient.signIn.emailOtp({
        email: result.data.email,
        otp: result.data.otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified successfully");
            router.replace("/");
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Please enter the OTP</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification code to{" "}
          <span className="font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="mx-auto space-y-4">
        <div className="space-y-1">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-center text-sm">Enter your one-time password.</p>
        </div>
        <Button
          className="w-full cursor-pointer"
          onClick={verifyOtp}
          disabled={isOtpPending || otp.length < 6}
        >
          {isOtpPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Send className="mr-2" />
              Verify OTP
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
