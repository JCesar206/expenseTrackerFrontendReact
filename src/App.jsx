import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Navigate, Outlet, Route, Routes } from "react-router";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import AuthPage from "./pages/AuthPage";

import { useApp } from "./context/AppContext";

function PrivateLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useApp();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* MOBILE SIDEBAR */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-black/50 cursor-pointer"
            onClick={closeMenu}
            aria-label={t("menu")}
          />

          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%]">
            <div className="flex justify-end bg-white px-4 pt-4 dark:bg-slate-900">
              <button
                onClick={closeMenu}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label={t("menu")}
              >
                <X size={22} />
              </button>
            </div>

            <Sidebar onNavigate={closeMenu} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setMenuOpen(true)} />
          <main className="flex-1 p-5 sm:p-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>

          <footer className="border-t border-slate-200 px-5 py-5 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">{new Date().getFullYear()} | Expense Tracker · 2026 | {t("allRights")}
          </footer>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<AuthPage mode="login" />}/>
      <Route path="/register" element={<AuthPage mode="register" />} />

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="categories" element={<Categories />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;