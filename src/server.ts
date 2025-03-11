import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const app = express();

const port = 3000;

const prisma = new PrismaClient();

app.get("/", async (req: Request, res: Response) => {
  try {
    // Buscando todos os usuários da tabela Usuario
    const lista = await prisma.usuario.findMany();
    res.json(lista); // Retorna a lista de usuários em formato JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

app.listen(port, () => {
  console.log(`App de exemplo está rodando na porta ${port}`);
});
