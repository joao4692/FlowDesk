"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name: string;
  companyId: string;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

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
  }, [router]);

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Projetos</h1>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="flex flex-col gap-2">
        {projects.map((project) => (
          <li key={project.id} className="border rounded px-3 py-2">
            {project.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
