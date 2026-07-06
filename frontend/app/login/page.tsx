"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"admin" | "member">("admin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const [accessPassword, setAccessPassword] = useState("");

  const [error, setError] = useState("");

  async function handleAdminLogin(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");

    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError("Credenciais inválidas");
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  }

  async function handleMemberLogin(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");

    const response = await fetch("http://localhost:3001/auth/login-member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, accessPassword }),
    });

    if (!response.ok) {
      setError("Usuário ou senha da equipe inválidos");
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-80 rounded-xl bg-white p-8 shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Entrar</h1>
          <p className="text-sm text-slate-500">Acesse sua conta no FlowDesk</p>
        </div>

        <div className="mb-6 flex rounded-lg bg-slate-100 p-1 text-sm font-medium">
          <button
            onClick={() => {
              setMode("admin");
              setError("");
            }}
            className={`flex-1 rounded-md py-1.5 transition ${
              mode === "admin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode("member");
              setError("");
            }}
            className={`flex-1 rounded-md py-1.5 transition ${
              mode === "member" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Entrar como membro
          </button>
        </div>

        {mode === "admin" ? (
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={handleMemberLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Senha da equipe</label>
              <input
                type="password"
                value={accessPassword}
                onChange={(e) => setAccessPassword(e.target.value)}
                required
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Entrar
            </button>
          </form>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <p className="mt-4 text-center text-sm text-slate-500">
          Não tem conta?{" "}
          <a href="/register" className="font-medium text-indigo-600 hover:underline">
            Criar conta
          </a>
        </p>
      </div>
    </main>
  );
}
