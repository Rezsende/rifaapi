import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class MostrarPagamento {
  mostra_pagamento_do_tempo = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await prisma.dadosPix.findFirst({
        where: {
          id: parseInt(id),
        },
      });

      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar Condicao!" });
    }
  };
}
