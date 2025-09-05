"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="cursor-pointer"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}
