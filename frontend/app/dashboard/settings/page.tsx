"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token")!;

    const response = await fetch("http://localhost:3001/companies/access-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError(
        response.status === 403
          ? "Só administradores podem alterar a senha geral."
          : "Erro ao salvar senha."
      );
      return;
    }

    setPassword("");
    setMessage("Senha geral atualizada com sucesso.");
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-8 py-10">
        <h1 className="mb-6 text-xl font-bold text-slate-900">Configurações</h1>

        <form
          onSubmit={handleSubmit}
          className="flex max-w-sm flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <label className="text-sm font-medium text-slate-700">Senha geral de acesso</label>
          <p className="text-xs text-slate-500">
            Usada pelos membros da equipe para entrar (junto com o usuário deles) na opção
            &quot;Entrar como membro&quot; do login.
          </p>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
            placeholder="Ex: 85232"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Salvar
          </button>
          {message && <p className="text-sm text-emerald-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </main>
  );
}
