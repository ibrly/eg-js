"use client";

import { NAVIGATION } from "@/config/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-row overflow-hidden">
      <Sidebar groups={NAVIGATION} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
