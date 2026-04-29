"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

type CollapseToggleProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function CollapseToggle({ collapsed, onToggle }: CollapseToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
      className="flex items-center justify-center rounded p-1.5 text-(--sidebar-fg-muted) hover:bg-white/10 hover:text-(--sidebar-fg) transition-colors"
    >
      {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
    </button>
  );
}
