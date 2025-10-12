import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 flex h-screen w-screen overflow-hidden bg-slate-100 transition-colors duration-300 ease-out dark:bg-slate-950">
      {/* Sidebar fixa (desktop) + gaveta (mobile) */}
      <Sidebar aberto={mobileOpen} onFechar={() => setMobileOpen(false)} />

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 h-full md:ml-20">
        {/* Topbar */}
        <header className="z-20 flex items-center justify-between px-6 py-3 shadow-sm backdrop-blur-md transition-colors duration-300 border-b border-slate-200/70 bg-white/85 dark:border-slate-700 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileOpen(true)}
              aria-label={t("layout.dashboard.openMenu")}
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              to="/dashboard"
              className="text-lg font-semibold tracking-wide text-slate-900 dark:text-slate-100"
            >
              {t("brand.name")}
            </Link>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("layout.dashboard.subtitle")}
            </span>
          </div>
          <ThemeToggle floating={false} className="relative hover:scale-105" />
        </header>

        {/* Conteúdo da página (dashboard) */}
        <main className="flex-1 h-full overflow-y-auto p-2 md:p-4">
          <div className="h-full w-full rounded-2xl border border-slate-200/70 bg-white/90 p-3 shadow-lg transition-colors duration-300 backdrop-blur-sm md:p-4 dark:border-slate-700 dark:bg-slate-900/70">
            <div className="min-h-full flex flex-col justify-start">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
