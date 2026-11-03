import { useEffect, useState } from "react";
import {ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, CalendarDays, Plus, X, Save, Pencil, Trash2} from "lucide-react";

import { useApp } from "../context/AppContext.jsx";
import api from "../services/api";

// Obtener la fecha y hora local para datetime-local.
function getLocalDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - offset)
    .toISOString()
    .slice(0, 16);
}

function Transactions() {
  const { t, language } = useApp();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    kind: "expense",
    category_id: "",
    transaction_date: getLocalDateTime(),
  });

  // Consultar transacciones y categorías.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [transactionsResponse, categoriesResponse] =
          await Promise.all([
            api.get("/transactions"),
            api.get("/categories"),
          ]);

        setTransactions(transactionsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Error loading transactions:", err);
        setError(
          language === "es"
            ? "No se pudieron cargar las transacciones."
            : "Could not load transactions."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [language]);

  // Formatear cantidades monetarias.
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      language === "es" ? "es-MX" : "en-US",
      {
        style: "currency",
        currency: language === "es" ? "MXN" : "USD",
      }
    ).format(Number(amount ?? 0));
  };

  // Formatear fechas.
  const formatDate = (date) => {
    return new Intl.DateTimeFormat(
      language === "es" ? "es-MX" : "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(date));
  };

  // Obtener nombre de categoría.
  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    return (
      category?.name ??
      (language === "es" ? "Sin categoría" : "Uncategorized")
    );
  };

  // Actualizar campos del formulario.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  };
  // Cambiar tipo de transacción.
  const handleKindChange = (kind) => {
    setFormData((current) => ({
      ...current,
      kind,
      category_id: "",
    }));

    setFormError("");
  };
  // Abrir formulario.
  const openForm = () => {
    setFormError("");
    setIsFormOpen(true);
  };
  // Abrir el formulario con los datos de una transacción existente.
  const openEditForm = (transaction) => {
    setEditingId(transaction.id);

    setFormData({
      description: transaction.description,
      amount: String(transaction.amount),
      kind: transaction.kind,
      category_id: transaction.category_id
      ? String(transaction.category_id)
      : "",
      transaction_date: transaction.transaction_date.slice(0, 16),
    });
    setFormError("");
    setIsFormOpen(true);
  };

    const handleDelete = async (transactionId) => {
      const confirmed = window.confirm(
        language === "es"
          ? "¿Estás seguro de que deseas eliminar esta transacción?"
          : "Are you sure you want to delete this transaction?"
      );
      if (!confirmed) return;
      try {
        await api.delete(`/transactions/${transactionId}`);
        setTransactions((current) => 
          current.filter(
            (transaction) => transaction.id !== transactionId
          )
        );
      } catch (err) {
        console.error("Error deleting transaction:", err);
        alert(
          language === "es"
          ? "No se pudo eliminar la transacción."
          : "Could not delete the transaction."
        );
      }
    };
  
  // Cerrar y limpiar formulario.
  const closeForm = () => {
    setIsFormOpen(false);
    setFormError("");
    setEditingId(null);

    setFormData({
      description: "",
      amount: "",
      kind: "expense",
      category_id: "",
      transaction_date: getLocalDateTime(),
    });
  };

  // Crear transacción.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const amount = Number(formData.amount);

    if (!formData.description.trim()) {
      setFormError(
        language === "es"
          ? "La descripción es obligatoria."
          : "Description is required."
      );
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError(
        language === "es"
          ? "Introduce un importe válido mayor que cero."
          : "Enter a valid amount greater than zero."
      );
      return;
    }

    if (!formData.transaction_date) {
      setFormError(
        language === "es"
          ? "La fecha es obligatoria."
          : "Date is required."
      );
      return;
    }

    if (amount > 9999999999.99) {
      setFormError(
        language === "es"
          ? "El importe supera el máximo permitido."
          : "The amount exceeds the maximum allowed."
      );
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        description: formData.description.trim(),
        amount: formData.amount,
        kind: formData.kind,
        category_id: formData.category_id
          ? Number(formData.category_id)
          : null,
        transaction_date: `${formData.transaction_date}:00`,
      };

      let response;
      if (editingId !== null) {
        // Actualizar una transacción existente.
        response = await api.put(`/transactions/${editingId}`, payload);
        setTransactions((current) =>
          current.map((transaction) =>
            transaction.id === editingId
            ? response.data
            : transaction
          )
        );
      } else {
        // Crear una nueva transacción.
        response = await api.post("/transactions", payload);
        setTransactions((current) => [
          response.data,
          ...current,
        ]);
      }

      closeForm();
    } catch (err) {
      console.error("Error creating transaction:", err);

      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setFormError(detail);
      } else if (Array.isArray(detail)) {
        setFormError(detail.map((item) => item.msg).join(", "));
      } else {
        setFormError(
          language === "es"
            ? "No se pudo guardar la transacción. Inténtalo nuevamente."
            : "Could not save the transaction. Please try again."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) => category.kind === formData.kind
  );

  return (
    <section>
      {/* Page heading */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <ArrowLeftRight size={25} />
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            {t("transactions")}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {language === "es"
              ? "Consulta y administra tus movimientos financieros."
              : "View and manage your financial transactions."}
          </p>
        </div>

        <button
          type="button"
          onClick={openForm}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={19} />
          {language === "es"
            ? "Nueva transacción"
            : "New transaction"}
        </button>
      </div>

      {/* Create transaction form */}
      {isFormOpen && (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId !== null
                ? language === "es"
                ? "Editar transacción"
                : "Edit transaction"
              : language === "es"
                ? "Registrar transacción"
                : "Create transaction"}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              disabled={isSaving}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label={language === "es" ? "Cerrar" : "Close"}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Transaction type */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                {language === "es"
                  ? "Tipo de transacción"
                  : "Transaction type"}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleKindChange("income")}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${
                    formData.kind === "income"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "border-slate-200 text-slate-500 dark:border-slate-700"
                  }`}
                >
                  <ArrowUpCircle size={19} />
                  {language === "es" ? "Ingreso" : "Income"}
                </button>

                <button
                  type="button"
                  onClick={() => handleKindChange("expense")}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${
                    formData.kind === "expense"
                      ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                      : "border-slate-200 text-slate-500 dark:border-slate-700"
                  }`}
                >
                  <ArrowDownCircle size={19} />
                  {language === "es" ? "Gasto" : "Expense"}
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                {language === "es" ? "Descripción" : "Description"}
              </label>

              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={255}
                required
                placeholder={
                  language === "es"
                    ? "Ej. Compra del supermercado"
                    : "e.g. Grocery shopping"
                }
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                {language === "es" ? "Importe" : "Amount"}
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0.01"
                max="9999999999.99"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                {language === "es" ? "Categoría" : "Category"}
              </label>

              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="">
                  {language === "es"
                    ? "Sin categoría"
                    : "No category"}
                </option>

                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                {language === "es" ? "Fecha y hora" : "Date and time"}
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="datetime-local"
                  name="transaction_date"
                  value={formData.transaction_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-transparent py-3 pl-10 pr-3 outline-none transition focus:border-blue-500 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Error */}
            {formError && (
              <div
                role="alert"
                className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
              >
                {formError}
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                {language === "es" ? "Cancelar" : "Cancel"}
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {isSaving
                  ? language === "es"
                   ? "Guardado..."
                   : "Saving..."
                  : editingId !== null
                    ? language === "es"
                      ? "Guardar cambios"
                      : "Save changes"
                    : language === "es"
                      ? "Guardar transacción"
                      : "Save transaction"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Transactions history */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-6 dark:border-slate-800">
          <h2 className="text-lg font-semibold">
            {language === "es"
              ? "Historial de transacciones"
              : "Transaction history"}
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {language === "es"
              ? `${transactions.length} transacciones`
              : `${transactions.length} transactions`}
          </p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {language === "es"
                ? "Cargando transacciones..."
                : "Loading transactions..."}
            </p>
          ) : error ? (
            <div
              role="alert"
              className="rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
            >
              {error}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-10 text-center">
              <ArrowLeftRight
                size={35}
                className="mx-auto text-slate-400"
              />

              <p className="mt-4 font-medium">
                {language === "es"
                  ? "Todavía no tienes transacciones."
                  : "You don't have any transactions yet."}
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {language === "es"
                  ? "Cuando registres un ingreso o gasto aparecerá aquí."
                  : "Your income and expenses will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {transactions.map((transaction) => {
                const isIncome = transaction.kind === "income";

                return (
                  <article
                    key={transaction.id}
                    className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 last:border-0 last:pb-0 dark:border-slate-800"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`rounded-xl p-3 ${
                          isIncome
                            ? "bg-emerald-100 dark:bg-emerald-950"
                            : "bg-red-100 dark:bg-red-950"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpCircle
                            size={22}
                            className="text-emerald-600"
                          />
                        ) : (
                          <ArrowDownCircle
                            size={22}
                            className="text-red-500"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {transaction.description}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>
                            {getCategoryName(transaction.category_id)}
                          </span>

                          <span>·</span>

                          <CalendarDays size={13} />

                          <span>
                            {formatDate(transaction.transaction_date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className={`font-semibold ${isIncome ? "text-emerald-600" : "text-red-500"}`}>
                        {isIncome ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                        <button
                          type="button"
                          onClick={() => openEditForm(transaction)}
                          className="rounded-lg p-2 text-slate-500 transaction hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 cursor-pointer"
                          aria-label={
                            language === "es"
                            ? "Editar transacción"
                            : "Edit transaction"
                          }
                          title={
                            language === "es"
                            ? "Editar"
                            : "Edit"
                          }
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(transaction.id)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 cursor-pointer"
                            aria-label={
                              language === "es"
                              ? "Eliminar transacción"
                              : "Delete transaction"
                            }
                            title={
                              language === "es"
                              ? "Eliminar"
                              : "Delete"
                            }
                          >
                            <Trash2 size={17} />
                          </button>
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Transactions;