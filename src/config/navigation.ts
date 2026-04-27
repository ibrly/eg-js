import {
  Activity,
  Boxes,
  FileText,
  FolderKanban,
  Globe,
  Mail,
  Palette,
  Plug,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavLeaf = {
  kind: "leaf";
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavBranch = {
  kind: "branch";
  id: string;
  label: string;
  icon: LucideIcon;
  children: NavLeaf[];
};

export type NavItem = NavLeaf | NavBranch;

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export const NAVIGATION: readonly NavGroup[] = [
  {
    id: "contacts",
    label: "CONTACTS",
    items: [
      { kind: "leaf", id: "projects", label: "Projects", href: "/projects", icon: FolderKanban },
      { kind: "leaf", id: "profiles", label: "Profiles", href: "/profiles", icon: UserCircle },
      { kind: "leaf", id: "users", label: "Users", href: "/users", icon: Users },
    ],
  },
  {
    id: "integrations-setup",
    label: "INTEGRATIONS & SETUP",
    items: [
      {
        kind: "branch",
        id: "platform-integrations",
        label: "Platform Integrations",
        icon: Plug,
        children: [
          { kind: "leaf", id: "email-sessions", label: "Email Sessions", href: "/integrations/email-sessions", icon: Mail },
          { kind: "leaf", id: "web-sessions", label: "Web Sessions", href: "/integrations/web-sessions", icon: Globe },
        ],
      },
      { kind: "leaf", id: "web-sessions-top", label: "Web Sessions", href: "/web-sessions", icon: Activity },
    ],
  },
  {
    id: "account-security",
    label: "ACCOUNT & SECURITY",
    items: [
      { kind: "leaf", id: "compliance", label: "Compliance (GDPR)", href: "/compliance", icon: ShieldCheck },
      { kind: "leaf", id: "documents", label: "Documents", href: "/documents", icon: FileText },
      { kind: "leaf", id: "integrations", label: "Integrations", href: "/integrations", icon: Boxes },
      { kind: "leaf", id: "currency-branding", label: "Currency Branding", href: "/currency-branding", icon: Palette },
      { kind: "leaf", id: "administration", label: "Administration", href: "/administration", icon: Settings },
    ],
  },
];
