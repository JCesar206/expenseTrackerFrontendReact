import { useEffect, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

import { useApp } from "../context/AppContext";
import api from "../services/api";

function Dashboard() {
  const { t, language } = useApp();

  const [financialSummary, setFinancialSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  const [summaryError, setSummaryError] = useState(false);
  const [transactionsError, setTransactionsError] = useState(false);

  // Consultar el resumen financiero.
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        setSummaryError(false);

        const response = await api.get("/reports/summary");

        setFinancialSummary(response.data);
      } catch (error) {
        console.error("Error loading financial summary:", error);
        setSummaryError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Consultar las transacciones recientes y las categorías.
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        setIsLoadingTransactions(true);
        setTransactionsError(false);

        const [transactionsResponse, categoriesResponse] =
          await Promise.all([
            api.get("/transactions", {
              params: {
                limit: 5,
                offset: 0,
              },
            }),
            api.get("/categories"),
          ]);

        setTransactions(transactionsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error loading recent transactions:", error);
        setTransactionsError(true);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchRecentTransactions();
  }, []);

  // Formatear cantidades monetarias.
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      language === "es" ? "es-MX" : "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(Number(amount ?? 0));
  };

  // Formatear fechas.
  const formatDate = (date) => {
    return new Intl.DateTimeFormat(
      language === "es" ? "es-MX" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    ).format(new Date(date));
  };

  // Relacionar el category_id con el nombre de la categoría.
  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    return (
      category?.name ??
      (language === "es" ? "Sin categoría" : "Uncategorized")
    );
  };

  const summary = [
    {
      title: t("totalIncome"),
      amount: financialSummary?.income,
      icon: ArrowUpCircle,
      color: "text-emerald-600",
      background: "bg-emerald-100 dark:bg-emerald-950",
    },
    {
      title: t("totalExpenses"),
      amount: financialSummary?.expenses,
      icon: ArrowDownCircle,
      color: "text-red-500",
      background: "bg-red-100 dark:bg-red-950",
    },
    {
      title: t("currentBalance"),
      amount: financialSummary?.balance,
      icon: Wallet,
      color: "text-blue-600",
      background: "bg-blue-100 dark:bg-blue-950",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {t("overview")}
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {language === "es"
            ? "Resumen de toda tu actividad financiera"
            : "Overview of all your financial activity"}
        </p>
      </div>

      {summaryError && (
        <div
          role="alert"
          className="mb-5 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
        >
          {language === "es"
            ? "No se pudo cargar el resumen financiero."
            : "Could not load the financial summary."}
        </div>
      )}

      {/* Financial summary */}
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
                {isLoading
                  ? "..."
                  : summaryError
                    ? "—"
                    : formatCurrency(item.amount)}
              </p>
            </article>
          );
        })}
      </section>

      {/* Recent transactions */}
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

        {isLoadingTransactions ? (
          <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {language === "es" ? "Cargando transacciones..." : "Loading transactions..."}
          </p>
        ) : transactionsError ? (
          <p
            role="alert"
            className="py-6 text-center text-sm text-red-600 dark:text-red-400"
          >
            {language === "es"
              ? "No se pudieron cargar las transacciones."
              : "Could not load transactions."}
          </p>
        ) : transactions.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {language === "es"
              ? "Todavía no tienes transacciones registradas."
              : "You don't have any transactions yet."}
          </p>
        ) : (
          <div className="space-y-5">
            {transactions.map((transaction) => {
              const isIncome = transaction.kind === "income";

              return (
                <div
                  key={transaction.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800"
                >
                  <div>
                    <p className="font-medium">
                      {transaction.description}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {getCategoryName(transaction.category_id)}
                      {" · "}
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>

                  <p
                    className={`font-semibold ${
                      isIncome
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;