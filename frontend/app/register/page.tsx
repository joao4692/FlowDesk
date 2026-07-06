"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");

    const response = await fetch("http://localhost:3001/auth/register-company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, name, email, password }),
    });

    if (!response.ok) {
      setError("Erro ao registrar. Verifique os dados.");
      return;
    }

    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="flex w-80 flex-col gap-4 rounded-xl bg-white p-8 shadow-md"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Criar conta</h1>
          <p className="text-sm text-slate-500">Comece a usar o FlowDesk</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Nome da empresa</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Seu nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
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
          Criar conta
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <p className="text-center text-sm text-slate-500">
          Já tem conta?{" "}
          <a href="/login" className="font-medium text-indigo-600 hover:underline">
            Entrar
          </a>
        </p>
      </form>
    </main>
  );
}
