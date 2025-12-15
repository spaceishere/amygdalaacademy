"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Гарах
    </Button>
  );
}
