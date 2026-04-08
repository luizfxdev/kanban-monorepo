# 📋 Kanban Board

Aplicação fullstack de gerenciamento de tarefas com **drag & drop**, desenvolvida como exercício prático de Go e Next.js.

---

## 🛠 Tecnologias

**Backend**
- [Go](https://golang.org/) — linguagem principal
- [Gorilla Mux](https://github.com/gorilla/mux) — roteador HTTP
- [PostgreSQL](https://www.postgresql.org/) — banco de dados
- [lib/pq](https://github.com/lib/pq) — driver PostgreSQL para Go

**Frontend**
- [Next.js 16](https://nextjs.org/) — framework React
- [Tailwind CSS](https://tailwindcss.com/) — estilização
- [Zustand](https://zustand-demo.pmnd.rs/) — gerenciamento de estado
- [Bootstrap Icons](https://icons.getbootstrap.com/) — ícones
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática

**Infraestrutura**
- [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) — containerização

---

## 📁 Estrutura do projeto

```
kanban-monorepo/
├── apps/
│   ├── api/                        # Backend Go
│   │   ├── cmd/
│   │   │   ├── server/main.go      # Entrypoint da API
│   │   │   └── migrate/main.go     # Migration do banco
│   │   ├── internal/
│   │   │   ├── handler/task.go     # Handlers HTTP
│   │   │   ├── model/task.go       # Structs e tipos
│   │   │   ├── repository/         # Acesso ao banco
│   │   │   └── service/            # Regras de negócio
│   │   ├── go.mod
│   │   └── go.sum
│   │
│   └── web/                        # Frontend Next.js
│       ├── src/
│       │   ├── app/                # Layout e páginas
│       │   ├── components/         # Componentes React
│       │   ├── store/              # Zustand store
│       │   └── types/              # Tipagens TypeScript
│       ├── next.config.ts
│       ├── tailwind.config.js
│       └── package.json
│
├── docker-compose.yml
├── Makefile
└── .env
```

---

## ⚙️ Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Go 1.23+](https://golang.org/dl/) *(para rodar sem Docker)*
- [Node.js 22+](https://nodejs.org/) *(para rodar sem Docker)*

---

## 🚀 Rodando com Docker

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/kanban-monorepo.git
cd kanban-monorepo
```

**2. Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

**3. Suba os containers**
```bash
docker compose up
```

**4. Execute a migration** *(apenas na primeira vez, em outro terminal)*
```bash
docker compose exec api go run cmd/migrate/main.go
```

**5. Acesse a aplicação**

Abra [http://localhost:3000](http://localhost:3000) no browser.

---

## 🔧 Rodando sem Docker

**Backend**
```bash
cd apps/api
go mod tidy
DATABASE_URL=postgres://kanban:secret@localhost:5432/kanban?sslmode=disable go run cmd/migrate/main.go
go run cmd/server/main.go
```

**Frontend**
```bash
cd apps/web
npm install
npm run dev
```

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Healthcheck |
| `GET` | `/api/tasks` | Lista todas as tasks |
| `POST` | `/api/tasks` | Cria uma task |
| `GET` | `/api/tasks/{id}` | Busca uma task |
| `PUT` | `/api/tasks/{id}` | Atualiza uma task |
| `DELETE` | `/api/tasks/{id}` | Remove uma task |
| `PATCH` | `/api/tasks/{id}/like` | Curtir/descurtir |

---

## ✨ Funcionalidades

- **Kanban** com 3 colunas: Total, Pendentes e Concluídas
- **Drag & drop** entre colunas
- **Criar, editar e deletar** cards
- **Curtir** cards com contador
- **Tags** coloridas por categoria
- **Barra de progresso** geral
- **Design dark** com animações

---

## 🗄 Schema do banco

```sql
CREATE TABLE tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status      TEXT NOT NULL DEFAULT 'pendentes'
                  CHECK (status IN ('pendentes', 'concluidas')),
    liked       BOOLEAN NOT NULL DEFAULT false,
    likes       INT NOT NULL DEFAULT 0,
    tag         TEXT NOT NULL DEFAULT '',
    tag_color   TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 📝 Makefile

```bash
make up       # Sobe os containers
make down     # Derruba os containers
make migrate  # Roda a migration
make api      # Roda a API localmente
make web      # Roda o frontend localmente
make test     # Roda os testes Go
make tidy     # Atualiza dependências Go
```

---

## 👨‍💻 Autor

Desenvolvido por **Felipe** como exercício prático na [DIO](https://www.dio.me/).
