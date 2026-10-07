"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/app/login/page";

export default function AccountPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return <LoginPage />;
}
