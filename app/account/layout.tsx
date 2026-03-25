import React from "react";
import Breadcrumb from "./_components/Breadcrumb/Breadcrumb";
import Sidebar from "./_components/Sidebar/Sidebar";
import styles from "./layout.module.css";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/?login_required=1");
  }

  return (
    <div className={styles.accountRoot}>
      {/* <Breadcrumb /> */}
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
