"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Member = {
  id: string;
  name: string;
  email: string | null;
  username: string | null;
  createdAt: string;
};

export default function TeamPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState("");
  const [lastCreatedUsername, setLastCreatedUsername] = useState("");

  function fetchMembers(token: string) {
    fetch("http://localhost:3001/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(setMembers)
      .catch(() => setError("Erro ao carregar membros"));
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchMembers(token);
  }, [router]);

  async function handleCreateMember(e: React.SubmitEvent) {
    e.preventDefault();
    setCreateError("");
    setLastCreatedUsername("");

    const token = localStorage.getItem("token")!;

    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      setCreateError(
        response.status === 403
          ? "Só administradores podem adicionar membros."
          : "Erro ao criar membro."
      );
      return;
    }

    const data = await response.json();
    setLastCreatedUsername(data.username);
    setName("");
    fetchMembers(token);
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-8 py-10">
        <h2 className="mb-6 text-xl font-bold text-slate-900">Equipe</h2>

        <form
          onSubmit={handleCreateMember}
          className="mb-6 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <label className="text-sm font-medium text-slate-700">Nome do membro</label>
          <input
            type="text"
            placeholder="Ex: Vitinho"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <p className="text-xs text-slate-500">
            Não precisa de e-mail nem senha própria — o membro entra com um usuário simples e a
            senha geral da equipe (configure em Configurações).
          </p>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Adicionar membro
          </button>
          {createError && <p className="text-sm text-red-600">{createError}</p>}
          {lastCreatedUsername && (
            <p className="text-sm text-emerald-600">
              Criado! Usuário para login: <strong>{lastCreatedUsername}</strong>
            </p>
          )}
        </form>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <ul className="flex flex-col gap-3">
          {members.map((member) => (
            <li
              key={member.id}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
            >
              <p className="font-medium text-slate-900">{member.name}</p>
              <p className="text-sm text-slate-500">
                {member.username ? `usuário: ${member.username}` : member.email}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
