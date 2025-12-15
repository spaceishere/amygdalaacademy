"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
}

export function Logo({ variant = "full", className }: LogoProps) {
  const { theme, systemTheme } = useTheme();
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const isDark = resolvedTheme === "dark";

  const src =
    variant === "icon"
      ? "/amygdala_icon.svg"
      : isDark
      ? "/amygdala_logo_dark.svg"
      : "/amygdala_logo_light.svg";

  const alt = variant === "icon" ? "Amygdala Icon" : "Amygdala Academy";

  return (
    <Link href="/" className={className} aria-label={alt}>
      <Image
        src={src}
        alt={alt}
        width={variant === "icon" ? 32 : 140}
        height={32}
        priority
      />
    </Link>
  );
}
