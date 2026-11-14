import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Home from "./components/Home";
import AuthPage from "./pages/AuthPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { api } from "./api/api";

export default function App() {
  const { data: user } = useQuery({
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

  const loggedIn = !!user?.id;

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
        <Header loggedIn={loggedIn} />

        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage defaultMode="login" />} />
            <Route path="/login" element={<AuthPage defaultMode="login" />} />
            <Route path="/register" element={<AuthPage defaultMode="signup" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
