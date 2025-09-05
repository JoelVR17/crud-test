"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { LoginSchema, SignUpSchema } from "./schemas/auth.schema";

type FormValues = z.infer<typeof SignUpSchema | typeof LoginSchema>;

export function AuthForm({
  mode,
  onSubmit,
}: {
  mode: "login" | "signup";
  onSubmit: (values: FormValues) => Promise<void>;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(mode === "signup" ? SignUpSchema : LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-full max-w-sm"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">
            {mode === "signup" ? "Create account" : "Login"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Use your email and password
          </p>
        </div>
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@domain.com" {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.email?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.password?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Loading...
            </>
          ) : mode === "signup" ? (
            "Create account"
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
