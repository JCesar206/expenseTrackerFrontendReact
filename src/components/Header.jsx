import { Languages, Moon, Sun, Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Header({ onMenuClick }) {
	const { language, theme, toggleLanguage, toggleTheme, t } = useApp();
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const isDark = theme === "dark";
	const handleLogout = () => {
		logout();
		navigate("/login", { replace: true });
	};

	return (
		<header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900 sm:px-8">
			<div className="flex items-center gap-3">
				<button
					onClick={onMenuClick}
					className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
					aria-label={t("menu")} >
						<Menu size={22} />
					</button>
					<h2 className="text-lg font-semibold">{t("appName")}</h2>
			</div>

			<div className="flex items-center gap-2">
				<button
					onClick={toggleLanguage}
					className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"
					aria-label={t("language")} >
						<Languages size={18} />
						{language.toUpperCase()}
					</button>

					<button
						onClick={toggleTheme}
						className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"
						aria-label={isDark ? t("light") : t("dark")} >
							{isDark ? <Sun size={19} /> : <Moon size={19} />}
						</button>

						<button
							onClick={handleLogout}
							className="rounded-lg border border-slate-200 p-2 text-red-500 hover:bg-red-50 dark:border-slate-700 dark:hover:bg-red-950" aria-label={t("logout")} title={t("logout")} >
								<LogOut size={19} />
							</button>
			</div>
		</header>
	);
}

export default Header;