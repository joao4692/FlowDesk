"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="flex w-80 flex-col gap-4 rounded-xl bg-white p-8 shadow-md"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Entrar</h1>
          <p className="text-sm text-slate-500">Acesse sua conta no FlowDesk</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Entrar
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <p className="text-center text-sm text-slate-500">
          Não tem conta?{" "}
          <a href="/register" className="font-medium text-indigo-600 hover:underline">
            Criar conta
          </a>
        </p>
      </form>
    </main>
  );
}
