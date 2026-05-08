"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-stone-100 px-4 py-4 shadow-lg sm:px-6">
      <div className="container-page flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Vi bruker informasjonskapsler (cookies) for å huske handlekurven din og forbedre opplevelsen på nettsiden.
        </p>
        <Button
          size="sm"
          className="shrink-0"
          onClick={accept}
        >
          Forstått
        </Button>
      </div>
    </div>
  );
}
