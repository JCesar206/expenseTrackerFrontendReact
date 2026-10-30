import { ArrowLeftRight } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

function Transactions() {
	const { t } = useApp();

	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bd-slate-900">
			<div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
				<ArrowLeftRight size={25} />
			</div>
			<h1 className="text-2xl font-bold">{t("transactions")}</h1>
			<p className="mt-2 text-slate-500 dark:text-slate-400">{t("description")}</p>
		</section>
	);
}

export default Transactions;