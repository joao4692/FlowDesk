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

  async function handleSubmit(e: React.FormEvent) {
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
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-3">
        <h1 className="text-xl font-bold">Criar conta</h1>
        <input type="text" placeholder="Nome da empresa" value={companyName}
          onChange={(e) => setCompanyName(e.target.value)} className="border rounded px-3 py-2" />
        <input type="text" placeholder="Seu nome" value={name}
          onChange={(e) => setName(e.target.value)} className="border rounded px-3 py-2" />
        <input type="email" placeholder="E-mail" value={email}
          onChange={(e) => setEmail(e.target.value)} className="border rounded px-3 py-2" />
        <input type="password" placeholder="Senha" value={password}
          onChange={(e) => setPassword(e.target.value)} className="border rounded px-3 py-2" />
        <button type="submit" className="bg-black text-white rounded px-3 py-2">
          Criar conta
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </main>
  );
}
