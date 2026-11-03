import { useState } from "react";
import { Eye, EyeOff, Languages, Moon, Sun, Wallet } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function AuthPage({ mode }) {
	const isRegister = mode === "register";
	const { language, theme, toggleLanguage, toggleTheme, t } = useApp();
	const { login, register } = useAuth();

	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const isDark = theme === "dark";
	const successMessage = location.state?.message;

	const getErrorMessage = (error) => {
		const detail = error.response?.data?.detail;
		if (typeof detail === "string") {
			return detail;
		}
		if (Array.isArray(detail)) {
			return detail.map((item) => item.msg).join(", ");
		}
		return isRegister ? t("registerError") : t("invalidCredentials");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");

		if (!email.trim() || !password) {
			setError(t("requiredField"));
			return;
		}
		if (isRegister && password.length < 8) {
			setError(t("passwordLength"));
			return;
		}
		if (isRegister && password !== confirmPassword) {
			setError(t("passwordMismatch"));
			return;
		}
		setLoading(true);

		try {
			if (isRegister) {
				await register({
					email: email.trim(),
					password,
				});
				navigate("/login", {
					replace: true,
					state: { message: t("registerSuccess")},
				});
			} else {
				await login({
					email: email.trim(),
					password,
				});
				navigate("/", { replace: true });
			}
		} catch (error) {
			setError(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="flex min-h-screen flex-col bg-slate-100 px-5 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
			{/* Top Controls */}
			<header className="flex items-center justify-between">
				<Link to="/login" className="flex items-center gap-2">
					<div className="rounded-xl bg-blue-600 p-2 text-white">
						<Wallet size={22} />
					</div>
					<span className="font-bold">Expense Tracker</span>
				</Link>

				<div className="flex items-center gap-2">
					<button
						onClick={toggleLanguage}
						className="rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
						aria-label={t("language")}
					>
						<Languages size={19} />
						<span className="ml-1 text-xs font-semibold">{language.toUpperCase()}</span>
					</button>

					<button
						onClick={toggleTheme}
						className="rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
						aria-label={isDark ? t("light") : t("dark")}
					>
						{isDark ? <Sun size={19} /> : <Moon size={19} />}
					</button>
				</div>
			</header>

			{/* Form */}
			<div className="flex flex-1 items-center justify-center py-10">
				<section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-9">
					<div className="mb-7">
						<h1 className="text-2xl font-bold">
							{isRegister ? t("registerTitle") : t("loginTitle")}
						</h1>
						<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
							{isRegister
							? t("registerDescription")
							: t("loginDescription")}
						</p>
					</div>
					{successMessage && (
						<div className="mb-5 rounded-lg bg-emerald-100 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
							{successMessage}
						</div>
					)}
					{error && (
						<div role="alert" className="mb-5 rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label className="mb-2 block text-sm font-medium">{t("email")}</label>
							<input
								type="email" value={email} onChange={(event) => setEmail(event.target.value)}
								placeholder="example@email.com" autoComplete="email" required
								className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700" />
						</div>

						<div>
							<label className="mb-2 block text-sm font-medium">{t("password")}</label>
							<div className="flex rounded-lg border border-slate-300 focus-within:border-blue-500 dark:border-slate-700">
								<input type={showPassword ? "text" : "password"} value={password}
									onChange={(event) => setPassword(event.target.value)}
									autoComplete={isRegister ? "new-password" : "current-password"} required
									minLength={isRegister ? 8 : undefined}
									className="w-full min-w-0 bg-transparent px-4 py-3 outline-none" />

									<button type="button" onClick={() => setShowPassword((current) => !current)}
										className="px-4 text-slate-500 hover:text-blue-600"
										aria-label={showPassword ? t("hidePassword") : t("showPassword")}
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
							</div>
						</div>

						{isRegister && (
							<div>
								<label className="mb-2 block text-sm font-medium">{t("confirmPassword")}</label>
								<div className="flex rounded-lg border border-slate-300 focus-within:border-slate-500 dark:border-slate-700">
									<input type={showConfirmPassword ? "text" : "password"} value={confirmPassword}
										onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required className="w-full min-w-0 bg-transparent px-4 py-3 outline-none" />

									<button type="button" onClick={(event) => setShowConfirmPassword((current) => !current)}
										className="px-4 text-slate-500 hover:text-blue-600"
										aria-label={
											showConfirmPassword ? t("hidePassword") : t("showPassword")
										}>
											{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</button>
								</div>
							</div>
						)}

						<button type="submit" disabled={loading}
							className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
								{loading ? "..." : isRegister ? t("registerButton") : t("loginButton")}
							</button>
					</form>

					<p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
						{isRegister ? t("hasAccount") : t("noAccount")}
						{" "}
						<Link to={isRegister ? "/login" : "/register"}
							className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
								{isRegister ? t("login") : t("createAccount")}
							</Link>
					</p>
					<div className="text-center font-semibold text-xs text-gray-500">Usuario Prueba: usuario_c@test.com <br/> Contraseña: PasswordTest123</div>
				</section>
			</div>
		</main>
	);
}

export default AuthPage;