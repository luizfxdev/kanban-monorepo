package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/seu-usuario/kanban/api/internal/handler"
	"github.com/seu-usuario/kanban/api/internal/repository"
	"github.com/seu-usuario/kanban/api/internal/service"
)

func main() {
	db := mustConnectDB()
	defer db.Close()

	taskRepo := repository.NewTaskRepository(db)
	taskSvc := service.NewTaskService(taskRepo)
	taskHandler := handler.NewTaskHandler(taskSvc)

	r := mux.NewRouter()
	r.Use(corsMiddleware)

	r.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintln(w, `{"status":"ok"}`)
	}).Methods(http.MethodGet)

	r.HandleFunc("/api/tasks", taskHandler.List).Methods(http.MethodGet)
	r.HandleFunc("/api/tasks", taskHandler.Create).Methods(http.MethodPost)
	r.HandleFunc("/api/tasks/{id}", taskHandler.Get).Methods(http.MethodGet)
	r.HandleFunc("/api/tasks/{id}", taskHandler.Update).Methods(http.MethodPut)
	r.HandleFunc("/api/tasks/{id}", taskHandler.Delete).Methods(http.MethodDelete)
	r.HandleFunc("/api/tasks/{id}/like", taskHandler.ToggleLike).Methods(http.MethodPatch)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("API listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func mustConnectDB() *sql.DB {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL not set")
	}
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("db open: %v", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatalf("db ping: %v", err)
	}
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	return db
}
