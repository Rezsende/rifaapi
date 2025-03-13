import { Router } from "express";
import { SdkGerenciaNet } from "../RifaController/sdkgerencianetcontroller";
import { MostrarPagamento } from "../RifaController/mostra_pagamento";

export const router_sdkGrencia = Router();

const sdk = new SdkGerenciaNet();
const mostrapagamento = new MostrarPagamento();

router_sdkGrencia.post("/createChave", sdk.criarChave);
router_sdkGrencia.get("/ListChave", sdk.ListaChave);
router_sdkGrencia.delete("/DeletarChave/:cv", sdk.DeletataChave);
router_sdkGrencia.post("/createpixsdk", sdk.CriarPixImediato);

router_sdkGrencia.get("/detalhedopixsdk/:txid", sdk.DetalhePixImediato);
router_sdkGrencia.get("/ListaPix/:status/:inicio/:fim", sdk.ListadePix);
router_sdkGrencia.get("/rifa/dadosPagamento/:id", mostrapagamento.mostra_pagamento_do_tempo);
