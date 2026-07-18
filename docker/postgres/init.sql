CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    periodicidade TEXT NOT NULL,
    valor DOUBLE PRECISION NOT NULL,
    "diaPagamento" INTEGER NOT NULL,
    rua TEXT NOT NULL DEFAULT '',
    numero TEXT NOT NULL DEFAULT '',
    complemento TEXT NOT NULL DEFAULT '',
    "pontoReferencia" TEXT NOT NULL DEFAULT '',
    observacoes TEXT NOT NULL DEFAULT '',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS pagamentos (
    id SERIAL PRIMARY KEY,
    "clienteId" INTEGER NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,
    valor DOUBLE PRECISION NOT NULL,
    "mesReferencia" TEXT NOT NULL,
    "formaPagamento" TEXT NOT NULL DEFAULT '',
    comprovante TEXT,
    "comprovanteNome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pagamentos_cliente_fkey
        FOREIGN KEY ("clienteId")
        REFERENCES clientes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Idempotent upgrades for existing databases
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE pagamentos ADD COLUMN IF NOT EXISTS "formaPagamento" TEXT NOT NULL DEFAULT '';
ALTER TABLE pagamentos ADD COLUMN IF NOT EXISTS comprovante TEXT;
ALTER TABLE pagamentos ADD COLUMN IF NOT EXISTS "comprovanteNome" TEXT;
