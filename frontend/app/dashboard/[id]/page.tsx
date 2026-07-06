"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Task = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  projectId: string;
  assignee: { id: string; name: string } | null;
};

type Member = {
  id: string;
  name: string;
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [draftAssigneeId, setDraftAssigneeId] = useState("");
  const [assigneeError, setAssigneeError] = useState("");

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

  function fetchMembers(token: string) {
    fetch("http://localhost:3001/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(setMembers)
      .catch(() => {});
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchTasks(token);
    fetchMembers(token);
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
      body: JSON.stringify({
        title: newTaskTitle,
        projectId: id,
        assigneeId: newTaskAssignee || undefined,
      }),
    });

    if (response.ok) {
      setNewTaskTitle("");
      setNewTaskAssignee("");
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

  function startEditingAssignee(task: Task) {
    setAssigneeError("");
    setEditingTaskId(task.id);
    setDraftAssigneeId(task.assignee?.id ?? "");
  }

  function cancelEditingAssignee() {
    setEditingTaskId(null);
    setAssigneeError("");
  }

  async function handleSubmitAssignee(taskId: string) {
    setAssigneeError("");
    const token = localStorage.getItem("token")!;

    const response = await fetch(`http://localhost:3001/tasks/${taskId}/assignee`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ assigneeId: draftAssigneeId || null }),
    });

    if (!response.ok) {
      const data = await response.json();
      setAssigneeError(data.error ?? "Erro ao atribuir tarefa");
      return;
    }

    setEditingTaskId(null);
    fetchTasks(token);
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm("Excluir esta tarefa?")) {
      return;
    }

    const token = localStorage.getItem("token")!;

    await fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTasks(token);
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-8 py-10">
        <a
          href="/dashboard"
          className="mb-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Voltar
        </a>
        <h1 className="mb-6 text-xl font-bold text-slate-900">Tarefas</h1>

        <form onSubmit={handleCreateTask} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Nova tarefa"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <select
            value={newTaskAssignee}
            onChange={(e) => setNewTaskAssignee(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Sem responsável</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
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
            <li
              key={task.id}
              className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <p className="font-medium text-slate-900">{task.title}</p>

                {editingTaskId === task.id ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <select
                      value={draftAssigneeId}
                      onChange={(e) => setDraftAssigneeId(e.target.value)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Sem responsável</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSubmitAssignee(task.id)}
                      className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Submeter tarefa
                    </button>
                    <button
                      onClick={cancelEditingAssignee}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700"
                    >
                      Cancelar
                    </button>
                    {assigneeError && (
                      <p className="w-full text-xs text-red-600">{assigneeError}</p>
                    )}
                  </div>
                ) : task.assignee ? (
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>Tarefa submetida, aguardando status de {task.assignee.name}</span>
                    {task.status !== "IN_PROGRESS" && (
                      <button
                        onClick={() => startEditingAssignee(task)}
                        className="font-medium text-indigo-600 hover:underline"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => startEditingAssignee(task)}
                    className="mt-1 text-xs font-medium text-indigo-600 hover:underline"
                  >
                    Atribuir responsável
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleCycleStatus(task)}
                  className={`rounded-full px-2 py-1 text-xs font-medium transition hover:opacity-75 ${statusColor[task.status]}`}
                >
                  {task.status}
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-xs font-medium text-red-500 hover:text-red-700"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
