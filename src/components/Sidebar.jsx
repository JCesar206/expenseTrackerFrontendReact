import { LayoutDashboard, ArrowLeftRight, Tags, Wallet } from "lucide-react";
import { NavLink } from "react-router";
import { useApp } from "../context/AppContext.jsx";

function Sidebar({ onNavigate }) {
	const { t } = useApp();
	const links = [
		{
			to: "/",
			label: t("dashboard"),
			icon: LayoutDashboard,
		},
		{
			to: "/transactions",
			label: t("transactions"),
			icon: ArrowLeftRight,
		},
		{
			to: "/categories",
			label: t("categories"),
			icon: Tags,
		},
	];

	return (
		<aside className="flex min-h-full w-full flex-col border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:w-64 lg:shrink-0">
			<div className="mb-10 flex items-center gap-3">
				<div className="rounded-xl bg-blue600 p-2 text-white">
					<Wallet size={23} />
				</div>
				<span className="text-lg font-bold">Expense Tracker</span>
			</div>

			<p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
				{t("navigation")}</p>
			<nav className="flex flex-col gap-2">
				{links.map((link) => {
					const Icon = link.icon;
					return (
						<NavLink
							key={link.to}
							to={link.to}
							end={link.to}
							onClick={onNavigate}
							className={({ isActive }) =>
								`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
									isActive ? "bg-blue-600 text-white"
									: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" 
								}`
							}
						>
							<Icon size={19} />
							{link.label}
						</NavLink>
					)
				})}
			</nav>

			<div className="mt-auto pt-10">
				<div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
					<p className="text-sm font-semibold">{t("appName")}</p>
					<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t("tagline")}</p>
				</div>
			</div>
		</aside>
	);
}

export default Sidebar;