import express from "express";
import { prisma } from "./prisma";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/companies", async (req, res) => {
  const company = await prisma.company.create({
    data: { name: req.body.name },
  });
  res.json(company);
});

app.get("/companies", async (_req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});
