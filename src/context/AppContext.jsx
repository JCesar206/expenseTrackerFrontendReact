import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);
const translations = {
	es: {
		appName: "Expense Tracker",
		tagline: "Tus finanzas, bajo control.",
		welcome: "Bienvenido",
		description: "Administra tus ingresos y gastos desde un solo lugar.",
		language: "Idioma",
		spanish: "Español",
		english: "Inglés",
		theme: "Tema",
		light: "Claro",
		dark: "Oscuro",
		preview: "Vista previa",
		income: "Ingreso",
		expenses: "Gasto",
		balance: "Balance",
		login: "Iniciar sesión",
		register: "Crear cuenta",
		email: "Correo electrónico",
		password: "Contraseña",
		showPassword: "Mostrar contraseña",
		hidePassword: "Ocultar contraseña",
		dashboard: "Dashboard",
		transactions: "Transacciones",
		categories: "Categorías",
		overview: "Resumen general",
		recentTransactions: "Transacciones recientes",
		viewAll: "Ver todas",
		thisMonth: "Este mes",
		totalIncome: "Ingresos totales",
		totalExpenses: "Gastos totales",
		currentBalance: "Balance actual",
		menu: "Menú",
		navigation: "Navegación principal",
		sampleData: "Datos de demostración",
		allRights: "Todos los derechos reservados."
	},
	en: {
		appName: "Expense Tracker",
		tagline: "Your finances, under control.",
		welcome: "Welcome",
		description: "Manage your income and expenses in one place.",
		language: "Language",
		spanish: "Spanish",
		english: "English",
		theme: "Theme",
		light: "Light",
		dark: "Dark",
		preview: "Preview",
		income: "Income",
		expenses: "Expenses",
		balance: "Balance",
		login: "Log ing",
		register: "Create account",
		email: "Email",
		password: "Password",
		showPassword: "Show password",
		hidePassword: "Hide password",
		dashboard: "Dashboard",
		transactions: "Transactions",
		categories: "Categories",
		overview: "Overview",
		recentTransactions: "Recent transactions",
		viewAll: "View all",
		thisMonth: "This month",
		totalIncome: "Total income",
		totalExpenses: "Total expenses",
		currentBalance: "Current balance",
		menu: "Menu",
		navigation: "Main navigation",
		sampleData: "Demo data",
		allRights: "All rights reserved."
	},
};

export function AppProvider({ children }) {
	const [language, setLanguage] = useState(() => {
		return localStorage.getItem("expense-language") || "es";
	});
	const [theme, setTheme] = useState(() => {
		return localStorage.getItem("expense-theme") || "light";
	});

	useEffect(() => {
		localStorage.setItem("expense-language", language);
	}, [language]);

	useEffect(() => {
		localStorage.setItem("expense-theme", theme);
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	const toggleLanguage = () => {
		setLanguage((current) => current === "es" ? "en" : "es");
	};

	const toggleTheme = () => {
		setTheme((current) => current === "light" ? "dark" : "light");
	};

	const t = (key) => {
		return translations[language][key] || key;
	};

	return (
		<AppContext.Provider value={{language, theme, toggleLanguage, toggleTheme, t}}>
			{children}
		</AppContext.Provider>
	);
}

export function useApp() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useApp debe utilizarse dentro de AppProvider.");
	}
	return context;
}