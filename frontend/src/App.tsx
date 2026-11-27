import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import AuthPage from "./pages/AuthPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import { api } from "./api/api";
import Dashboard from "./pages/DashBoard";

function ProtectedRoute({
  loggedIn,
  isAuthLoading,
  children,
}: {
  loggedIn: boolean;
  isAuthLoading: boolean;
  children: React.ReactNode;
}) {
  if (isAuthLoading) {
    return <Loading />;
  }
  if (!loggedIn) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const queryClient = useQueryClient();

  const { data: user, isPending: isAuthLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/verify");
        return res.data.user;
      } catch (error: any) {
        if (error?.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "success") {
      toast.success("Signed in with Google!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      params.delete("auth");
      const nextSearch = params.toString();
      const cleanUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, [queryClient]);

  const loggedIn = !!(user?.id || user?._id);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
        <Header loggedIn={loggedIn} isAuthLoading={isAuthLoading} />

        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home loggedIn={loggedIn} isAuthLoading={isAuthLoading} />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute loggedIn={loggedIn} isAuthLoading={isAuthLoading}>
                  <Dashboard loggedIn={loggedIn} />
                </ProtectedRoute>
              }
            />

            <Route path="/auth" element={<AuthPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
