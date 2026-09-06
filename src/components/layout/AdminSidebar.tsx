import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  Zap,
  LogOut,
  Percent,
  LayoutGrid,
  Calendar,
  Users,
  Receipt,
  FolderCheck,
  X,
  Mail,
  Phone,
  MessageCircle,
  Handshake,
  Route,
  Landmark,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import type { UserRole } from "../../services/auth";
import { LOGO_WHITE_PATH } from "../../lib/branding";
import { useTranslation } from "react-i18next";

interface NavItem {
  id: string;
  labelKey: string;
  icon: React.ElementType;
  path: string;
  tab?: string; // Tab-ID für /admin Seite
}

function getNavForRole(role: UserRole, t: (key: string) => string): NavItem[] {
  const nav: Record<UserRole, NavItem[]> = {
    owner: [
      {
        id: "dashboard",
        labelKey: t("adminDashboard.sidebar.nav.dashboard"),
        icon: LayoutDashboard,
        path: "/admin",
        tab: "dashboard",
      },
      {
        id: "pipeline",
        labelKey: t("adminDashboard.sidebar.nav.pipeline"),
        icon: BarChart3,
        path: "/admin",
        tab: "pipeline",
      },
      {
        id: "projects",
        labelKey: t("adminDashboard.sidebar.nav.projects"),
        icon: LayoutGrid,
        path: "/admin",
        tab: "projects",
      },
      {
        id: "calendar",
        labelKey: t("adminDashboard.sidebar.nav.calendar"),
        icon: Calendar,
        path: "/admin/calendar",
      },
      {
        id: "completed",
        labelKey: t("adminDashboard.sidebar.nav.completed"),
        icon: FolderCheck,
        path: "/admin/completed",
      },
      {
        id: "discounts",
        labelKey: t("adminDashboard.sidebar.nav.discounts"),
        icon: Percent,
        path: "/admin",
        tab: "discounts",
      },
      {
        id: "reports",
        labelKey: t("adminDashboard.sidebar.nav.reports"),
        icon: FileText,
        path: "/admin",
        tab: "reports",
      },
      {
        id: "team",
        labelKey: t("adminDashboard.sidebar.nav.team"),
        icon: Users,
        path: "/admin/team",
      },
    ],
    super_employee: [
      {
        id: "dashboard",
        labelKey: t("adminDashboard.sidebar.nav.dashboard"),
        icon: LayoutDashboard,
        path: "/admin",
        tab: "dashboard",
      },
      {
        id: "pipeline",
        labelKey: t("adminDashboard.sidebar.nav.pipeline"),
        icon: BarChart3,
        path: "/admin",
        tab: "pipeline",
      },
      {
        id: "projects",
        labelKey: t("adminDashboard.sidebar.nav.projects"),
        icon: LayoutGrid,
        path: "/admin",
        tab: "projects",
      },
      {
        id: "calendar",
        labelKey: t("adminDashboard.sidebar.nav.calendar"),
        icon: Calendar,
        path: "/admin/calendar",
      },
    ],
    vertrieb: [
      {
        id: "dashboard",
        labelKey: t("adminDashboard.sidebar.nav.dashboard"),
        icon: LayoutDashboard,
        path: "/admin",
        tab: "dashboard",
      },
      {
        id: "pipeline",
        labelKey: t("adminDashboard.sidebar.nav.pipeline"),
        icon: BarChart3,
        path: "/admin",
        tab: "pipeline",
      },
      {
        id: "projects",
        labelKey: t("adminDashboard.sidebar.nav.projects"),
        icon: LayoutGrid,
        path: "/admin",
        tab: "projects",
      },
      {
        id: "calendar",
        labelKey: t("adminDashboard.sidebar.nav.calendar"),
        icon: Calendar,
        path: "/admin/calendar",
      },
    ],
    projektleiter: [
      {
        id: "dashboard",
        labelKey: t("adminDashboard.sidebar.nav.dashboard"),
        icon: LayoutDashboard,
        path: "/admin",
        tab: "dashboard",
      },
      {
        id: "projects",
        labelKey: t("adminDashboard.sidebar.nav.projects"),
        icon: LayoutGrid,
        path: "/admin",
        tab: "projects",
      },
      {
        id: "calendar",
        labelKey: t("adminDashboard.sidebar.nav.calendar"),
        icon: Calendar,
        path: "/admin/calendar",
      },
    ],
    monteur: [
      {
        id: "dashboard",
        labelKey: t("adminDashboard.sidebar.nav.dashboard"),
        icon: LayoutDashboard,
        path: "/admin",
        tab: "dashboard",
      },
      {
        id: "projects",
        labelKey: t("adminDashboard.sidebar.nav.projects"),
        icon: LayoutGrid,
        path: "/admin",
        tab: "projects",
      },
      {
        id: "calendar",
        labelKey: t("adminDashboard.sidebar.nav.calendar"),
        icon: Calendar,
        path: "/admin/calendar",
      },
    ],
    backoffice: [
      {
        id: "dashboard",
        labelKey: t("adminDashboard.sidebar.nav.dashboard"),
        icon: LayoutDashboard,
        path: "/admin",
        tab: "dashboard",
      },
      {
        id: "pipeline",
        labelKey: t("adminDashboard.sidebar.nav.pipeline"),
        icon: BarChart3,
        path: "/admin",
        tab: "pipeline",
      },
      {
        id: "projects",
        labelKey: t("adminDashboard.sidebar.nav.projects"),
        icon: LayoutGrid,
        path: "/admin",
        tab: "projects",
      },
      {
        id: "calendar",
        labelKey: t("adminDashboard.sidebar.nav.calendar"),
        icon: Calendar,
        path: "/admin/calendar",
      },
      {
        id: "completed",
        labelKey: t("adminDashboard.sidebar.nav.completed"),
        icon: FolderCheck,
        path: "/admin/completed",
      },
    ],
    installer: [
      {
        id: "dashboard",
        labelKey: t("adminDashboard.sidebar.nav.dashboard"),
        icon: LayoutDashboard,
        path: "/admin",
        tab: "dashboard",
      },
      {
        id: "pipeline",
        labelKey: t("adminDashboard.sidebar.nav.pipeline"),
        icon: BarChart3,
        path: "/admin",
        tab: "pipeline",
      },
      {
        id: "projects",
        labelKey: t("adminDashboard.sidebar.nav.projects"),
        icon: LayoutGrid,
        path: "/admin",
        tab: "projects",
      },
      {
        id: "calendar",
        labelKey: t("adminDashboard.sidebar.nav.calendar"),
        icon: Calendar,
        path: "/admin/calendar",
      },
    ],
    sales_agency: [
      {
        id: "dashboard",
        labelKey: t("adminDashboard.sidebar.nav.dashboard"),
        icon: LayoutDashboard,
        path: "/admin",
        tab: "dashboard",
      },
      {
        id: "leads",
        labelKey: t("adminDashboard.sidebar.nav.myLeads"),
        icon: BarChart3,
        path: "/admin",
        tab: "leads",
      },
      {
        id: "partners",
        labelKey: t("adminDashboard.sidebar.nav.partners"),
        icon: Handshake,
        path: "/admin/partners",
      },
      {
        id: "router",
        labelKey: t("adminDashboard.sidebar.nav.leadRouter"),
        icon: Route,
        path: "/admin/router",
      },
      {
        id: "commissions",
        labelKey: t("adminDashboard.sidebar.nav.commissions"),
        icon: Landmark,
        path: "/admin/commissions",
      },
      {
        id: "calendar",
        labelKey: t("adminDashboard.sidebar.nav.calendar"),
        icon: Calendar,
        path: "/admin/agency-calendar",
      },
      {
        id: "team",
        labelKey: t("adminDashboard.sidebar.nav.team"),
        icon: Users,
        path: "/admin/agency-team",
      },
      {
        id: "settings",
        labelKey: t("adminDashboard.sidebar.nav.settings"),
        icon: SlidersHorizontal,
        path: "/admin/agency-settings",
      },
    ],
    agency_agent: [
      {
        id: "dashboard",
        labelKey: t("adminDashboard.sidebar.nav.dashboard"),
        icon: LayoutDashboard,
        path: "/admin",
        tab: "dashboard",
      },
      {
        id: "leads",
        labelKey: t("adminDashboard.sidebar.nav.myLeads"),
        icon: BarChart3,
        path: "/admin",
        tab: "leads",
      },
      {
        id: "router",
        labelKey: t("adminDashboard.sidebar.nav.leadRouter"),
        icon: Route,
        path: "/admin/router",
      },
      {
        id: "calendar",
        labelKey: t("adminDashboard.sidebar.nav.calendar"),
        icon: Calendar,
        path: "/admin/agency-calendar",
      },
    ],
    customer: [],
  };

  return nav[role] ?? nav.installer;
}

function getRoleLabels(t: (key: string) => string): Record<UserRole, string> {
  return {
    owner: t("adminDashboard.sidebar.role.owner"),
    super_employee: t("adminDashboard.sidebar.role.superEmployee"),
    vertrieb: t("adminDashboard.sidebar.role.sales"),
    projektleiter: t("adminDashboard.sidebar.role.projectManager"),
    monteur: t("adminDashboard.sidebar.role.technician"),
    backoffice: t("adminDashboard.sidebar.role.backoffice"),
    installer: t("adminDashboard.sidebar.role.installer"),
    customer: t("adminDashboard.sidebar.role.customer"),
    sales_agency: t("adminDashboard.sidebar.role.agencyOwner"),
    agency_agent: t("adminDashboard.sidebar.role.agencyAgent"),
  };
}

// ── Component ─────────────────────────────────────────────────────────

interface AdminSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { t } = useTranslation();
  const { user, logout, isOwner } = useAuth();
  const location = useLocation();
  const [showHelp, setShowHelp] = useState(false);
  const sidebarNav = user ? getNavForRole(user.role, t) : [];
  const roleLabels = getRoleLabels(t);
  const isSettingsPage = location.pathname === "/admin/settings";

  return (
    <aside className="w-[220px] flex-shrink-0 self-start sticky top-0 h-screen flex flex-col bg-[#0F0F0F] border-r border-white/5">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link to="/" className="flex items-center">
          <img src={LOGO_WHITE_PATH} alt="Solvary" className="h-9 w-auto" />
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto">
        {sidebarNav.map((item) => {
          const Icon = item.icon;
          const isExternal = item.path !== "/admin";
          const active = !isSettingsPage && activeTab === item.id;

          // Externe Seiten (Messages, Calendar, etc.) immer als Link rendern
          if (isExternal) {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-brand-secondary text-white font-medium"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.labelKey}
              </Link>
            );
          }

          // Dashboard-Tabs: Button wenn onTabChange vorhanden, sonst Link.
          // Von einer anderen Seite aus muss die Tab-ID mit in die URL —
          // sonst landet /admin immer auf dem Default-Tab "dashboard".
          return onTabChange ? (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                active
                  ? "bg-brand-secondary text-white font-medium"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.labelKey}
            </button>
          ) : (
            <Link
              key={item.id}
              to={item.tab ? `${item.path}?tab=${item.tab}` : item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                active
                  ? "bg-brand-secondary text-white font-medium"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.labelKey}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-4 pb-2 flex flex-col gap-1">
        {isOwner && (
          <Link
            to="/admin/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
              isSettingsPage
                ? "bg-brand-secondary text-white font-medium"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="w-[18px] h-[18px]" />
            {t("adminDashboard.sidebar.nav.settings")}
          </Link>
        )}
        <button
          onClick={() => setShowHelp(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <HelpCircle className="w-[18px] h-[18px]" />
          {t("adminDashboard.sidebar.nav.help")}
        </button>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-brand-secondary-hover rounded-2xl border border-white/10 p-6 w-full max-w-sm mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {t("adminDashboard.helpModal.title")}
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-5">
              {t("adminDashboard.helpModal.intro")}
            </p>
            <div className="space-y-3">
              <a
                href="mailto:contact@vu-studio.de"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-white"
              >
                <Mail className="w-4 h-4 text-brand-primary" />
                <span>contact@vu-studio.de</span>
              </a>
              <a
                href="tel:+4915226429187"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-white"
              >
                <Phone className="w-4 h-4 text-brand-primary" />
                <span>015226429187</span>
              </a>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-sm text-gray-400">
                <MessageCircle className="w-4 h-4 text-brand-primary" />
                <span>{t("adminDashboard.helpModal.hours")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User */}
      <div className="px-4 pb-6 pt-2">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-xs font-bold text-brand-primary">
            {user?.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "VA"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.fullName || "Admin"}
            </p>
            <p className="text-xs text-gray-600">
              {user ? roleLabels[user.role] : "User"}
            </p>
          </div>
          <button
            onClick={async () => {
              await logout();
              window.location.href = "/login";
            }}
            className="text-gray-500 hover:text-white transition-colors"
            title="Abmelden"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
