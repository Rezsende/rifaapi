-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rifa" (
    "id" SERIAL NOT NULL,
    "numeros" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioRifaId" INTEGER,

    CONSTRAINT "Rifa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DadosPix" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "txtid" TEXT NOT NULL,
    "criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiracao" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "locId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "pixcopiacola" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "qrcodeImagem" TEXT,

    CONSTRAINT "DadosPix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalhePix" (
    "id" SERIAL NOT NULL,
    "produto" TEXT NOT NULL,
    "dadosPixId" INTEGER NOT NULL,

    CONSTRAINT "DetalhePix_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- AddForeignKey
ALTER TABLE "Rifa" ADD CONSTRAINT "Rifa_usuarioRifaId_fkey" FOREIGN KEY ("usuarioRifaId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalhePix" ADD CONSTRAINT "DetalhePix_dadosPixId_fkey" FOREIGN KEY ("dadosPixId") REFERENCES "DadosPix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
