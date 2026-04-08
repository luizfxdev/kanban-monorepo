# KANBAN BOARD | Gerenciador de Tarefas 📋

[![Go](https://img.shields.io/badge/Go-1.23%2B-00ADD8?style=flat-square&logo=go)](https://golang.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://www.docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Aplicação fullstack de gerenciamento de tarefas com **drag & drop**, desenvolvida como exercício prático combinando **Go** (backend) com **Next.js 16** (frontend).

---

## 📖 Descrição do Desafio

O desafio consiste em construir uma API REST completa em Go utilizando o roteador **Gorilla Mux**, e consumi-la em um frontend moderno com **Next.js 16**, **Zustand** e **Tailwind CSS**.

O sistema deve:

1. **Expor endpoints REST** para gerenciamento de tasks com Gorilla Mux
2. **Persistir dados** no PostgreSQL usando `database/sql` nativo do Go
3. **Gerenciar estado global** no frontend com Zustand
4. **Permitir arrastar cards** entre as colunas via drag & drop nativo HTML5
5. **Renderizar interface dark** com animações e design responsivo

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO INTERAGE COM O KANBAN                           │
│    ├─ Cria, edita ou deleta um card                        │
│    ├─ Arrasta card entre colunas (drag & drop)             │
│    ├─ Curte um card (toggle like)                          │
│    └─ Barra de progresso atualiza em tempo real            │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 2. ZUSTAND STORE (src/store/useTaskStore.ts)               │
│    ├─ Estado global de tasks e loading                     │
│    ├─ fetchTasks() → GET /api/tasks                        │
│    ├─ createTask() → POST /api/tasks                       │
│    ├─ updateTask() → PUT /api/tasks/:id                    │
│    ├─ deleteTask() → DELETE /api/tasks/:id                 │
│    ├─ toggleLike() → PATCH /api/tasks/:id/like             │
│    └─ moveTask() → atualiza localmente + PUT               │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 3. NEXT.JS REWRITE (next.config.ts)                        │
│    ├─ /api/* → proxy para http://api:8080/api/*            │
│    └─ Elimina CORS em desenvolvimento                      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 4. BACKEND GO (Gorilla Mux) PROCESSA                       │
│    ├─ corsMiddleware libera origin *                       │
│    ├─ handler recebe request e decodifica JSON             │
│    ├─ service aplica regras de negócio                     │
│    ├─ repository executa query no PostgreSQL               │
│    └─ resposta serializada em JSON                         │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 5. POSTGRESQL PERSISTE                                     │
│    ├─ Tabela tasks com UUID, status, likes, tags           │
│    ├─ CHECK constraint: pendentes | concluidas             │
│    └─ Indexes em status e created_at                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Estrutura do Projeto

```
kanban-monorepo/
├── apps/
│   ├── api/                          # Backend Go
│   │   ├── cmd/
│   │   │   ├── server/main.go        # Entrypoint — roteador e servidor HTTP
│   │   │   └── migrate/main.go       # Migration — cria tabela tasks
│   │   ├── internal/
│   │   │   ├── handler/task.go       # Handlers HTTP (List, Get, Create...)
│   │   │   ├── model/task.go         # Structs Task, CreateTaskInput...
│   │   │   ├── repository/task_repo.go  # Queries SQL
│   │   │   └── service/task_service.go  # Regras de negócio
│   │   ├── go.mod
│   │   └── go.sum
│   │
│   └── web/                          # Frontend Next.js
│       ├── src/
│       │   ├── app/
│       │   │   ├── globals.css       # Tailwind + fontes + scrollbar
│       │   │   ├── layout.tsx        # Root layout
│       │   │   └── page.tsx          # Página principal
│       │   ├── components/
│       │   │   ├── KanbanBoard.tsx   # Board principal + header
│       │   │   ├── KanbanColumn.tsx  # Coluna com drop zone
│       │   │   ├── TaskCard.tsx      # Card com drag, like e menu
│       │   │   ├── CardMenu.tsx      # Dropdown editar/deletar
│       │   │   └── AddCardModal.tsx  # Modal criar/editar card
│       │   ├── store/
│       │   │   └── useTaskStore.ts   # Zustand store com fetch
│       │   └── types/
│       │       └── task.ts           # Interfaces TypeScript
│       ├── next.config.ts
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       ├── tsconfig.json
│       └── package.json
│
├── infra/docker/
│   ├── Dockerfile.api
│   └── Dockerfile.web
├── docker-compose.yml
├── Makefile
├── .env
└── .env.example
```

---

## 🚀 Como Executar

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Go 1.23+](https://golang.org/dl/) *(apenas para rodar sem Docker)*
- [Node.js 22+](https://nodejs.org/) *(apenas para rodar sem Docker)*

### Com Docker *(recomendado)*

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/kanban-monorepo.git
cd kanban-monorepo

# 2. Configure as variáveis de ambiente
cp .env.example .env

# 3. Suba os containers
docker compose up

# 4. Execute a migration (apenas na primeira vez, em outro terminal)
docker compose exec api go run cmd/migrate/main.go
```

Acesse [http://localhost:3000](http://localhost:3000)

### Sem Docker

```bash
# Backend
cd apps/api
go mod tidy
go run cmd/migrate/main.go   # cria a tabela
go run cmd/server/main.go    # sobe a API em :8080

# Frontend (outro terminal)
cd apps/web
npm install
npm run dev                  # sobe o Next.js em :3000
```

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Healthcheck |
| `GET` | `/api/tasks` | Lista todas as tasks |
| `POST` | `/api/tasks` | Cria uma task |
| `GET` | `/api/tasks/{id}` | Busca uma task por ID |
| `PUT` | `/api/tasks/{id}` | Atualiza uma task |
| `DELETE` | `/api/tasks/{id}` | Remove uma task |
| `PATCH` | `/api/tasks/{id}/like` | Curtir / descurtir |

### Exemplo de Response

```json
{
  "id": "uuid-aqui",
  "title": "Implementar endpoints CRUD",
  "description": "GET, POST, PUT, DELETE com validação",
  "status": "pendentes",
  "liked": false,
  "likes": 2,
  "tag": "API",
  "tag_color": "violet",
  "created_at": "2026-04-08T21:00:00Z",
  "updated_at": "2026-04-08T21:00:00Z"
}
```

---

## ✨ Funcionalidades

- **Kanban** com 3 colunas: Total, Pendentes e Concluídas
- **Drag & drop** nativo HTML5 entre colunas
- **Criar, editar e deletar** cards via modal
- **Curtir** cards com contador persistido no banco
- **Tags** coloridas por categoria (Backend, Frontend, API...)
- **Barra de progresso** geral de conclusão
- **Design dark** com gradientes, animações e grid de pontos

---

## 🗄 Schema do Banco

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

## 🎨 Stack Tecnológica

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| **Backend** | Go 1.23 + Gorilla Mux | API REST e roteamento |
| **Banco** | PostgreSQL 16 | Persistência de dados |
| **Frontend** | Next.js 16 + React 19 | Interface e roteamento |
| **Estado** | Zustand 5 | Gerenciamento de estado global |
| **Estilos** | Tailwind CSS 3 | Layout e design dark |
| **Ícones** | Bootstrap Icons | Ícones dos componentes |
| **Infra** | Docker Compose | Orquestração dos serviços |

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

**Luiz Felipe de Oliveira**

Desenvolvedor Full Stack apaixonado por criar soluções elegantes e eficientes.

- 🌐 **Portfólio:** [luizfxdev.com.br](https://luizfxdev.com.br)
- 💼 **LinkedIn:** [in/luizfxdev](https://www.linkedin.com/in/luizfxdev)
- 🐙 **GitHub:** [@luizfxdev](https://github.com/luizfxdev)

---
