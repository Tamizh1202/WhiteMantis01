"use client";
import React from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutButtonClient() {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();

      // Final Redirect
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  return (
    <button onClick={handleLogout} style={{ marginLeft: 8 }}>
      Logout
    </button>
  );
}
