import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute() {
	const { user, isLoading } = useAuth();
	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
				<p className="text-slate-600 dark:text-slate-300">Loading...</p>
			</div>
		);
	}
	if (!user) {
		return <Navigate to="/login" replace />;
	}
	return <Outlet />;
}

export default ProtectedRoute;