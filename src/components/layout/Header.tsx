"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const NAV = [
  { href: "/", label: "Forsiden" },
  { href: "/bestill", label: "Bestill" },
  { href: "/reserver", label: "Reserver bord" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-16 sm:h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="Milano Bardufoss"
            width={140}
            height={48}
            priority
            className="h-9 sm:h-11 w-auto"
          />
          <span className="sr-only">Milano Bardufoss</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/80 hover:text-secondary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="lg" className="hidden sm:inline-flex">
            <Link href="/bestill">Bestill nå</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-11 w-11 motion-safe:active:scale-90 motion-safe:transition-transform"
                aria-label="Åpne meny"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background">
              <SheetTitle className="sr-only">Meny</SheetTitle>
              <div className="flex flex-col gap-1 p-6 pt-12">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3.5 min-h-12 text-lg font-medium hover:bg-muted active:bg-muted/80 transition-colors flex items-center"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button asChild size="lg" className="mt-4">
                  <Link href="/bestill" onClick={() => setOpen(false)}>
                    Bestill nå
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
