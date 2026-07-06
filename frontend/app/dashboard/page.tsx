"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name: string;
  companyId: string;
  createdAt: string;
};

type Summary = {
  totalProjects: number;
  totalTasks: number;
  todo: number;
  inProgress: number;
  done: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [createError, setCreateError] = useState("");

  function fetchProjects(token: string) {
    fetch("http://localhost:3001/projects", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nao autorizado");
        }
        return response.json();
      })
      .then(setProjects)
      .catch(() => setError("Erro ao carregar projetos"));
  }

  function fetchSummary(token: string) {
    fetch("http://localhost:3001/dashboard/summary", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(setSummary)
      .catch(() => {});
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchProjects(token);
    fetchSummary(token);
  }, [router]);

  async function handleCreateProject(e: React.SubmitEvent) {
    e.preventDefault();
    setCreateError("");

    const token = localStorage.getItem("token")!;

    const response = await fetch("http://localhost:3001/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newProjectName }),
    });

    if (!response.ok) {
      setCreateError(
        response.status === 403
          ? "Só administradores podem criar projetos."
          : "Erro ao criar projeto."
      );
      return;
    }

    setNewProjectName("");
    fetchProjects(token);
    fetchSummary(token);
  }

  async function handleDeleteProject(e: React.MouseEvent, projectId: string) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Excluir este projeto e todas as suas tarefas?")) {
      return;
    }

    const token = localStorage.getItem("token")!;

    await fetch(`http://localhost:3001/projects/${projectId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchProjects(token);
    fetchSummary(token);
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-8 py-10">
        {summary && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-slate-900">{summary.totalProjects}</p>
              <p className="text-xs text-slate-500">Projetos</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-slate-900">{summary.todo}</p>
              <p className="text-xs text-slate-500">A Fazer</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-amber-600">{summary.inProgress}</p>
              <p className="text-xs text-slate-500">Em Progresso</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-emerald-600">{summary.done}</p>
              <p className="text-xs text-slate-500">Concluídas</p>
            </div>
          </div>
        )}

        <h2 className="mb-6 text-xl font-bold text-slate-900">Projetos</h2>

        <form onSubmit={handleCreateProject} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Nome do novo projeto"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            required
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Criar
          </button>
        </form>
        {createError && <p className="mb-4 text-sm text-red-600">{createError}</p>}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {projects.length === 0 && !error && (
          <p className="text-sm text-slate-500">Nenhum projeto criado ainda.</p>
        )}

        <ul className="flex flex-col gap-3">
          {projects.map((project) => (
            <li key={project.id} className="relative">
              <a
                href={`/dashboard/${project.id}`}
                className="block rounded-lg border border-slate-200 bg-white px-4 py-3 pr-16 shadow-sm transition hover:border-indigo-300"
              >
                <p className="font-medium text-slate-900">{project.name}</p>
              </a>
              <button
                onClick={(e) => handleDeleteProject(e, project.id)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-red-500 hover:text-red-700"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
