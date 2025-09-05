"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface VerifyEmailCardProps {
  email: string;
}

export function VerifyEmailCard({ email }: VerifyEmailCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-8 w-8 text-primary-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
        <CardDescription className="text-base">
          We've sent a verification link to{" "}
          <span className="font-semibold text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-primary-50 p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-primary-800">
              <p className="font-medium">Next steps:</p>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>Check your email inbox</li>
                <li>Click the verification link</li>
                <li>Return here to sign in</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Didn't receive the email? Check your spam folder or</p>
          <Button variant="link" className="p-0 h-auto text-primary-600">
            resend verification email
          </Button>
        </div>

        <div className="pt-4 border-t">
          <Link href="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
