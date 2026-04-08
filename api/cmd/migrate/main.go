package main

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

const schema = `
CREATE TABLE IF NOT EXISTS tasks (
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

CREATE INDEX IF NOT EXISTS idx_tasks_status     ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
`

func main() {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if _, err := db.Exec(schema); err != nil {
		log.Fatalf("migrate: %v", err)
	}

	log.Println("migration completed")
}
