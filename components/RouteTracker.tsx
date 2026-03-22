"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const LAST_VISITED_KEY = "hety_last_visited";

export default function RouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/account")) return;
    window.localStorage.setItem(LAST_VISITED_KEY, pathname);
  }, [pathname]);

  return null;
}
