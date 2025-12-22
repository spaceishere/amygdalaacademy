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
import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Зөв имэйл хаяг оруулна уу"),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        form.reset();
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
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Буцах
        </Link>

        <h1 className="text-2xl font-bold mb-2 text-center text-foreground">
          Нууц үг сэргээх
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Бүртгэлтэй имэйл хаягаа оруулна уу
        </p>

        {success ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 p-6 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              <div className="text-center">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Имэйл илгээлээ!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Нууц үг сэргээх заавар бүхий имэйлийг илгээлээ. Имэйлээ
                  шалгаад дараагийн алхмуудыг дагана уу.
                </p>
              </div>
            </div>
            <Link href="/auth/login" className="block">
              <Button className="w-full" variant="outline">
                Нэвтрэх хуудас руу буцах
              </Button>
            </Link>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имэйл хаяг</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="bataa@gmail.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <div className="text-destructive text-sm">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сэргээх линк илгээх
              </Button>
            </form>
          </Form>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Нууц үгээ санаж байна уу?{" "}
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
