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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS pagamentos (
    id SERIAL PRIMARY KEY,
    "clienteId" INTEGER NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,
    valor DOUBLE PRECISION NOT NULL,
    "mesReferencia" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pagamentos_cliente_fkey
        FOREIGN KEY ("clienteId")
        REFERENCES clientes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
