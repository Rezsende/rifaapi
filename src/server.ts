import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { router_sdkGrencia } from "./routers/routes_sdk_gerenciaNet";

const app = express();
app.use(router_sdkGrencia);
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

app.post("/rifa", async (req: Request, res: Response) => {
  try {
    const { email, cpf, telefone, numeros } = req.body;

    if (!email || !cpf || !telefone || !numeros || numeros.length === 0) {
      return res.status(400).json({ error: "Preencha todos os campos corretamente!" });
    }

    // Verificar se o usuário já existe ou criar um novo usuário
    let usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: { email, cpf, telefone },
      });
    }

    // Criar os números da rifa, cada grupo de 5 números será um novo registro
    const rifas = await prisma.rifa.createMany({
      data: numeros.map((grupo: number[]) => ({
        numeros: grupo,
        usuarioRifaId: usuario.id, // Relacionando o grupo de números ao usuário
      })),
    });

    res.status(201).json({ message: "Rifa registrada com sucesso!", rifas });
  } catch (error) {
    console.error("Erro ao salvar rifa:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.listen(port, () => {
  console.log(`App de exemplo está rodando na porta ${port}`);
});
