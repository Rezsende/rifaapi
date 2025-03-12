import { Request, Response } from "express";
import EfiPay from "sdk-node-apis-efi";
import fs from "fs";
import path from "path";
import https from "https";
import { PrismaClient } from "@prisma/client";

interface DetalhePix {
  produto: string;
}
const cert = fs.readFileSync(path.resolve(__dirname, "../../certificados/certificate-chain-prod.crt"));

const prisma = new PrismaClient();

const httpsOptions = {
  //cert: cert,
  //key: fs.readFileSync("/"), // Chave privada do domínio
  ca: cert,
  minVersion: "TLSv1.2",
  requestCert: true,
  rejectUnauthorized: true, //Caso precise que os demais endpoints não rejeitem requisições sem mTLS, você pode alterar para false
};

const options = {
  // PRODUÇÃO = false
  // HOMOLOGAÇÃO = true
  sandbox: false,
  client_id: "Client_Id_85c3fc8af8c6275f45728c0e8ab2aadc6c1c84c1",
  client_secret: "Client_Secret_a22c5a36a2d15b678a4c726cf6f5640bb9097c49",
  certificate: "./certificados/producao-405499-rifabv.p12",
  cert_base64: false, // Indica se o certificado está em base64 ou não
};
const efipay = new EfiPay(options);

export class SdkGerenciaNet {
  criarChave = async (req: Request, res: Response) => {
    const chave = await efipay.pixCreateEvp();
    return res.send(chave);
  };
  ListaChave = async (req: Request, res: Response) => {
    const chave = await efipay.pixListEvp();

    return res.send(chave);
  };

  DeletataChave = async (req: Request, res: Response) => {
    try {
      const { cv } = req.params;
      const chave = await efipay.pixDeleteEvp({
        chave: cv,
      });
      return res.send(chave);
    } catch (error) {
      return res.status(500).send({ error: "Erro ao deletar a chave" });
    }
  };
  CriarPixImediato = async (req: Request, res: Response) => {
    try {
      // const { afiliado } = req.params;
      const { cpf, nome, original, email, telefone, detalhepix } = req.body;
      const body = {
        calendario: {
          expiracao: 600,
        },
        devedor: {
          cpf: cpf,
          nome: nome,
        },
        valor: {
          original: original,
        },
        chave: "3637e431-1245-4980-a764-f0c7a7f0a169",
        infoAdicionais: [
          {
            nome: "Bombox 3",
            valor: "2.199,99",
          },
          {
            nome: "Numeros",
            valor: "06 02 03 08 30",
          },
        ],
      };

      const chave = await efipay.pixCreateImmediateCharge({}, body);

      const id = chave.loc.id; // Substitua por onde o ID é encontrado na resposta
      const qrcode = await efipay.pixGenerateQRCode({ id });

      const dadosPessoais = {
        nome: nome,
        email: email,
        cpf: cpf,
        valor: original,
        telefone: telefone,
        txtid: chave.txid,
        criacao: chave.calendario.criacao,
        expiracao: chave.calendario.expiracao,
        status: chave.status,
        locId: chave.loc.id,
        location: chave.location,
        pixcopiacola: chave.pixCopiaECola,
        link: qrcode.linkVisualizacao,
        qrcodeImagem: qrcode.imagemQrcode,
      };

      const result = {
        // dadospix: chave,
        // qrcode: qrcode,
        dadosPessoais: dadosPessoais,
      };

      const novo = await prisma.dadosPix.create({
        data: {
          nome: dadosPessoais.nome,
          email: dadosPessoais.email,
          cpf: dadosPessoais.cpf,
          valor: dadosPessoais.valor,
          telefone: dadosPessoais.telefone,
          txtid: dadosPessoais.txtid,
          criacao: dadosPessoais.criacao,
          expiracao: dadosPessoais.expiracao,
          status: dadosPessoais.status,
          locId: dadosPessoais.locId,
          location: dadosPessoais.location,
          pixcopiacola: dadosPessoais.pixcopiacola,
          link: dadosPessoais.link,
          qrcodeImagem: dadosPessoais.qrcodeImagem,
          //afiliado: afiliado,
          DetalhePix: {
            create: detalhepix.map((produto: DetalhePix) => ({
              produto: produto.produto, // Certifique-se de que cada objeto em detalhepix tem o campo 'produto'
            })),
          },
        },
      });
      //return res.send({ resposta: chave, qrcode: qrcode });
      return res.send(dadosPessoais);
    } catch (error) {}
  };
  DetalhePixImediato = async (req: Request, res: Response) => {
    const { txid } = req.params; // Extrai corretamente o txid dos parâmetros da URL

    try {
      // Passa o txid correto para o método
      const chave = await efipay.pixDetailCharge({ txid });

      // Retorna a chave como resposta
      return res.send(chave);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Erro ao buscar detalhes do Pix imediato" });
    }
  };

  ListadePix = async (req: Request, res: Response) => {
    const { status, inicio, fim } = req.params; // Obtém o status da requisição

    // let params = {
    //   inicio: "2025-02-11T05:01:35Z",
    //   fim: "2025-02-11T20:10:00Z",
    // };

    let params = {
      inicio: inicio + "Z",
      fim: fim + "Z",
    };

    // Chama a API para listar as cobranças
    const chave = await efipay.pixListCharges(params);

    // Filtra os itens por status se um status for fornecido
    const filteredPix = status
      ? chave.cobs.filter((p) => p.status === status) // Filtra com base no status fornecido
      : chave.cobs; // Se não houver status, não faz filtro

    // Prepara a resposta com os dados filtrados
    const resposta = {
      parametros: chave.parametros,
      pix: filteredPix.map((p) => ({
        datacriacao: p.calendario.criacao,
        expiracao: p.calendario.expiracao,
        txid: p.txid,
        status: p.status,
        valor: p.valor.original,
        devedorCpf: p.devedor?.cpf,
        devedorNome: p.devedor?.nome,
        pix: p.pix,
      })),
    };

    return res.send(resposta);
  };
}
/*

{
	"cpf":"03386346227",
	"nome":"Osmel Santos Feitosa Neto",
	"original":"0.01",
	"email":"osmelsantos@gmail.com",
	"telefone": "(11) 91234-5678"
  

}


*/
