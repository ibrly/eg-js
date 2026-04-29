"use client";

import { useSyncExternalStore } from "react";
import type { NavGroup } from "@/config/navigation";
import { cn } from "@/lib/cn";
import { CollapseToggle } from "./collapse-toggle";

const STORAGE_KEY = "eg:nav-collapsed";
const CHANGE_EVENT = "eg:nav-collapsed-change";

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

function persist(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {}
}

type SidebarProps = {
  groups: readonly NavGroup[];
};

export function Sidebar({ groups: _groups }: SidebarProps) {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function handleToggle() {
    persist(!collapsed);
  }

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex h-full flex-col shrink-0 border-r transition-[width] duration-200",
        "bg-(--sidebar-bg) text-(--sidebar-fg) border-(--sidebar-border)",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-(--sidebar-border)",
          collapsed ? "justify-center px-0" : "justify-between px-4",
        )}
      >
        {!collapsed && (
          <span className="truncate text-sm font-semibold">AzLink</span>
        )}
        <CollapseToggle collapsed={collapsed} onToggle={handleToggle} />
      </div>

      {/* Nav tree — SCRUM-8 */}
      <div className="flex-1 overflow-y-auto py-2" />

      {/* Onboarding card — SCRUM-9 */}
      <div className="px-2 py-2" />

      {/* Profile chip — SCRUM-9 */}
      <div className="px-2 pb-3" />
    </nav>
  );
}
