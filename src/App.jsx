import { useState } from "react";
import { Eye, EyeOff, Languages, Moon, Sun } from "lucide-react";
import { useApp } from "./context/AppContext.jsx";

function App() {
  const {language, theme, toggleLanguage, toggleTheme, t} = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const isDark = theme === "dark";
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{t("appName")}</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-black flex items-center gap-2 rounded-lg border border-slate-300 bg-white cursor-pointer" aria-label={t("language")}>
                <Languages size={18} /> {language.toUpperCase()}
              </button>
            <button
              onClick={toggleTheme}
              className="text-black flex items-center gap-2 rounded-lg border border-slate-100 bg-white cursor-pointer" aria-label={t("theme")}>
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                {isDark ? t("light") : t("dark")}
              </button>
          </div>
        </header>

        {/* Welcome */}
        <section className="mt-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t("preview")}
          </p>
          <h2 className="mt-2 text-4xl font-bold">{t("welcome")}</h2>
          <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">{t("description")}</p>
        </section>

        {/* Summary cards */}
        <section className="mt-10 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("income")}</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">$25,000.00</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("expenses")}</p>
            <p className="mt-3 text-2xl font-bold text-red-500">$3,500.00</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("balance")}</p>
            <p className="mt-3 text-2xl font-bold">$21,500.00</p>
          </div>
        </section>

        {/* Password Preview */}
        <section className="mt-10 max-w-md rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-semibold">{t("login")}</h3>
          <label className="mb-2 block text-sm font-medium">{t("password")}</label>

          <div className="flex items-center rounded-lg border border-slate-300 focus-within:border-blue-500 dark:border-slate-700">
            <input
              type={showPassword ? "text" : "password"}
              defaultValue="myPassword123"
              className="w-full bg-transparent px-4 py-3 outline-none"
              aria-label={t("password")} />
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="px-4 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;