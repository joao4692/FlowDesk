"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CurrentUser = {
  id: string;
  name: string;
  email: string | null;
  role: "ADMIN" | "MEMBER";
  company: { id: string; name: string };
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:3001/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nao autorizado");
        }
        return response.json();
      })
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-56 flex-col justify-between border-r border-slate-200 bg-white px-4 py-6">
        <div>
          <h1 className="mb-8 px-2 text-lg font-bold text-slate-900">FlowDesk</h1>
          <nav className="flex flex-col gap-1">
            <a
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Projetos
            </a>
            <a
              href="/dashboard/team"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Equipe
            </a>
            <a
              href="/dashboard/settings"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Configurações
            </a>
          </nav>
        </div>

        <div className="border-t border-slate-200 pt-4">
          {user && (
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.company.name}</p>
              <p className="text-xs text-slate-400">
                {user.role === "ADMIN" ? "Administrador" : "Membro"}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}
