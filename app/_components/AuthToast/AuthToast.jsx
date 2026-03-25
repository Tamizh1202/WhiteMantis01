"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("login_required") === "1") {
      toast.error("You'll need an account to access this page.", {
        duration: 4000,
        style: {
          fontFamily: "var(--lato)",
          fontSize: "14px",
        },
      });

      // Clean the param from the URL without adding a history entry
      const params = new URLSearchParams(searchParams.toString());
      params.delete("login_required");
      const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
      router.replace(newUrl);
    }
  }, [searchParams]);

  return null;
}
