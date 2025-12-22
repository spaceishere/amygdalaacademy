"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";

const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Нууц үг таарахгүй байна",
    path: ["confirmPassword"],
  });

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setError("Буруу эсвэл хүчингүй линк байна");
    }
  }, [token]);

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    if (!token) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(data.error || "Алдаа гарлаа");
      }
    } catch {
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex bg-background min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-md border border-border">
        <h1 className="text-2xl font-bold mb-2 text-center text-foreground">
          Шинэ нууц үг үүсгэх
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Шинэ нууц үгээ оруулна уу
        </p>

        {success ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 p-6 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              <div className="text-center">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Амжилттай!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Нууц үг амжилттай солигдлоо. Нэвтрэх хуудас руу шилжиж
                  байна...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Шинэ нууц үг</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Шинэ нууц үг"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нууц үг баталгаажуулах</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Нууц үг дахин оруулах"
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <div className="text-destructive text-sm">{error}</div>}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !token}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Нууц үг солих
              </Button>
            </form>
          </Form>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Нэвтрэх хуудас руу буцах
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex bg-background min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-md border border-border">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
