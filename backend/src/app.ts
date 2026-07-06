import express from "express";
import { prisma } from "./prisma";
import { authRoutes } from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { projectRoutes } from "./routes/project.routes";
import { taskRoutes } from "./routes/task.routes";
import { userRoutes } from "./routes/user.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { requireRole } from "./middlewares/requireRole.middleware";
import { setAccessPassword } from "./services/company.service";
import cors from "cors";






export const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes);



app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/companies", authMiddleware, async (req, res) => {
  const company = await prisma.company.create({
    data: { name: req.body.name },
  });
  res.json(company);
});

app.get("/companies", authMiddleware, async (_req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});

app.patch(
  "/companies/access-password",
  authMiddleware,
  requireRole("ADMIN"),
  async (req, res) => {
    const { password } = req.body;
    const companyId = req.user!.companyId;

    if (!password || password.length < 4) {
      return res.status(400).json({ error: "Senha deve ter ao menos 4 caracteres" });
    }

    await setAccessPassword(companyId, password);
    res.status(204).send();
  }
);
