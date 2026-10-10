"use client";

import { useEffect } from "react";
import { warmUpBackend } from "@/lib/api";

export default function BackendKeepAlive() {
  useEffect(() => {
    // Proactively ping backend to wake up cloud server (Render free tier) immediately upon page load
    warmUpBackend();

    // Repeat lightweight heartbeat every 10 minutes while tab is open
    const interval = setInterval(() => {
      warmUpBackend();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
