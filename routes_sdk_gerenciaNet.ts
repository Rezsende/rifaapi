import { Router } from "express";
import { SdkGerenciaNet } from "../sdkgerencianetcontroller";
import { MostrarPagamento } from "../controller/RifaController/mostra_pagamento";

export const router_sdkGrencia = Router();

const sdk = new SdkGerenciaNet();
const rifa = new MostrarPagamento();

router_sdkGrencia.post("/createChave", sdk.criarChave);
router_sdkGrencia.get("/ListChave", sdk.ListaChave);
router_sdkGrencia.delete("/DeletarChave/:cv", sdk.DeletataChave);
router_sdkGrencia.post("/createpixsdk/:afiliado?", sdk.CriarPixImediato);
router_sdkGrencia.get("/detalhedopixsdk/:txid", sdk.DetalhePixImediato);
router_sdkGrencia.get("/ListaPix/:status/:inicio/:fim", sdk.ListadePix);

router_sdkGrencia.get("/rifa/dadosPagamento/:id", rifa.mostra_pagamento_do_tempo);
