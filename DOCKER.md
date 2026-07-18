# Executando com Docker

## Requisitos

- Docker Desktop com Docker Compose habilitado.

## Iniciar o projeto

Na pasta do projeto, execute:

```powershell
docker compose up --build
```

Quando os serviços estiverem saudáveis, acesse:

<http://localhost:3000>

O Compose inicia dois serviços:

- `app`: aplicação Next.js na porta `3000`;
- `database`: PostgreSQL 16 com as tabelas necessárias e volume persistente.

## Executar em segundo plano

```powershell
docker compose up --build -d
```

Para acompanhar os registros:

```powershell
docker compose logs -f app
```

Para parar os serviços sem apagar os dados:

```powershell
docker compose down
```

## Configuração opcional

Crie um arquivo `.env` ao lado do `compose.yml` para substituir os valores de desenvolvimento:

```dotenv
APP_PORT=3000
POSTGRES_DB=piscina_manager
POSTGRES_USER=postgres
POSTGRES_PASSWORD=troque-esta-senha
DOCKER_DATABASE_URL=postgresql://postgres:troque-esta-senha@database:5432/piscina_manager
```

O `.env` é ignorado pelo Git e não deve ser enviado ao repositório.

Para usar um PostgreSQL externo, defina apenas `DOCKER_DATABASE_URL` com a conexão autorizada. O banco incluído no Compose continuará sendo iniciado; remova o serviço `database` e o bloco `depends_on` se quiser operar exclusivamente com o banco externo.
