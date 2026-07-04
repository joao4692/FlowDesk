import express from "express";
import { prisma } from "./prisma";
import { authRoutes } from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { projectRoutes } from "./routes/project.routes";
import { taskRoutes } from "./routes/task.routes";
import { userRoutes } from "./routes/user.routes";




export const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

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
