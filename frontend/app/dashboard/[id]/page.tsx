"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Task = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  projectId: string;
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  function fetchTasks(token: string) {
    fetch(`http://localhost:3001/tasks?projectId=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar");
        }
        return response.json();
      })
      .then(setTasks)
      .catch(() => setError("Erro ao carregar tarefas"));
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchTasks(token);
  }, [id, router]);

  async function handleCreateTask(e: React.SubmitEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token")!;

    const response = await fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTaskTitle, projectId: id }),
    });

    if (response.ok) {
      setNewTaskTitle("");
      fetchTasks(token);
    }
  }

  const nextStatus: Record<Task["status"], Task["status"]> = {
    TODO: "IN_PROGRESS",
    IN_PROGRESS: "DONE",
    DONE: "TODO",
  };

  const statusColor: Record<Task["status"], string> = {
    TODO: "bg-slate-100 text-slate-600",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
    DONE: "bg-emerald-100 text-emerald-700",
  };

  async function handleCycleStatus(task: Task) {
    const token = localStorage.getItem("token")!;

    const response = await fetch(`http://localhost:3001/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nextStatus[task.status] }),
    });

    if (response.ok) {
      fetchTasks(token);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-8 py-4">
        <a href="/dashboard" className="text-sm font-medium text-indigo-600 hover:underline">
          ← Voltar
        </a>
      </header>

      <div className="mx-auto max-w-2xl px-8 py-10">
        <h1 className="mb-6 text-xl font-bold text-slate-900">Tarefas</h1>

        <form onSubmit={handleCreateTask} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Nova tarefa"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Adicionar
          </button>
        </form>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {tasks.length === 0 && !error && (
          <p className="text-sm text-slate-500">Nenhuma tarefa ainda.</p>
        )}

        <ul className="flex flex-col gap-3">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="font-medium text-slate-900">{task.title}</p>
              <button
                onClick={() => handleCycleStatus(task)}
                className={`rounded-full px-2 py-1 text-xs font-medium transition hover:opacity-75 ${statusColor[task.status]}`}
              >
                {task.status}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
