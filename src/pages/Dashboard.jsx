import { ArrowDownCircle, ArrowUpCircle, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useApp } from "../context/AppContext";

function Dashboard() {
  const { t } = useApp();

  const summary = [
    {
      title: t("totalIncome"),
      amount: "$25,000.00",
      icon: ArrowUpCircle,
      color: "text-emerald-600",
      background: "bg-emerald-100 dark:bg-emerald-950",
    },
    {
      title: t("totalExpenses"),
      amount: "$3,500.00",
      icon: ArrowDownCircle,
      color: "text-red-500",
      background: "bg-red-100 dark:bg-red-950",
    },
    {
      title: t("currentBalance"),
      amount: "$21,500.00",
      icon: Wallet,
      color: "text-blue-600",
      background: "bg-blue-100 dark:bg-blue-950",
    },
  ];

  const transactions = [
    {
      description: "Monthly salary",
      category: "Salary",
      date: "Oct 28, 2026",
      amount: "+$25,000.00",
      kind: "income",
    },
    {
      description: "Supermarket",
      category: "Food",
      date: "Oct 27, 2026",
      amount: "-$2,500.00",
      kind: "expense",
    },
    {
      description: "Transportation",
      category: "Transport",
      date: "Oct 26, 2026",
      amount: "-$1,000.00",
      kind: "expense",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {t("overview")}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t("thisMonth")}
          </p>
        </div>

        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {t("sampleData")}
        </span>
      </div>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.title}
                </p>

                <div className={`rounded-xl p-3 ${item.background}`}>
                  <Icon size={22} className={item.color} />
                </div>
              </div>

              <p className="mt-5 text-2xl font-bold">
                {item.amount}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {t("recentTransactions")}
          </h2>

          <Link
            to="/transactions"
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t("viewAll")}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="space-y-5">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800"
            >
              <div>
                <p className="font-medium">
                  {transaction.description}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {transaction.category} · {transaction.date}
                </p>
              </div>

              <p
                className={`font-semibold ${
                  transaction.kind === "income"
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {transaction.amount}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
