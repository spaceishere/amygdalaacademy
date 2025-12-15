"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/schemas";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";
import { registerUser } from "@/actions/auth"; // Need to create this action

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const passwordValue = form.watch("password") || "";
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);
  const hasMinLength = passwordValue.length >= 6;

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    setIsLoading(true);
    setError("");

    try {
      const res = await registerUser(values);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/auth/login");
      }
    } catch {
      setError("Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex bg-background min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-md border border-border">
        <h1 className="text-2xl font-bold mb-6 text-center text-foreground">
          Бүртгүүлэх
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Нэр</FormLabel>
                  <FormControl>
                    <Input placeholder="Бат" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имэйл</FormLabel>
                  <FormControl>
                    <Input placeholder="bataa@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Нууц үг</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      {hasUppercase ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={
                          hasUppercase
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }
                      >
                        Том үсэг /A, B, C .../
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasLowercase ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={
                          hasLowercase
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }
                      >
                        Жижиг үсэг /a, b, c .../
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasSpecial ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={
                          hasSpecial
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }
                      >
                        Тусгай тэмдэгт /@, #, $ .../
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasMinLength ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={
                          hasMinLength
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }
                      >
                        6-с дээш оронтой
                      </span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-destructive text-sm">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Бүртгүүлэх
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {"Бүртгэлтэй бол энд дарна уу. "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Нэвтрэх
          </Link>
        </p>
      </div>
    </div>
  );
}
