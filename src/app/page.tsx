"use client";

import { getAuth } from "@/utils/get-auth";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "flowbite";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const user = getAuth();
    if (!user) router.push("/auth");
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1>Welcome Page</h1>
    </div>
  );
}
