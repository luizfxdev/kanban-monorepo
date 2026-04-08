package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/seu-usuario/kanban/api/internal/model"
	"github.com/seu-usuario/kanban/api/internal/service"
)

type TaskHandler struct {
	svc *service.TaskService
}

func NewTaskHandler(svc *service.TaskService) *TaskHandler {
	return &TaskHandler{svc: svc}
}

func (h *TaskHandler) List(w http.ResponseWriter, r *http.Request) {
	tasks, err := h.svc.List(r.Context())
	if err != nil {
		jsonError(w, "internal error", http.StatusInternalServerError)
		return
	}
	jsonOK(w, tasks, http.StatusOK)
}

func (h *TaskHandler) Get(w http.ResponseWriter, r *http.Request) {
	task, err := h.svc.Get(r.Context(), mux.Vars(r)["id"])
	if errors.Is(err, service.ErrNotFound) {
		jsonError(w, "not found", http.StatusNotFound)
		return
	}
	if err != nil {
		jsonError(w, "internal error", http.StatusInternalServerError)
		return
	}
	jsonOK(w, task, http.StatusOK)
}

func (h *TaskHandler) Create(w http.ResponseWriter, r *http.Request) {
	var in model.CreateTaskInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		jsonError(w, "invalid body", http.StatusBadRequest)
		return
	}
	task, err := h.svc.Create(r.Context(), in)
	if err != nil {
		jsonError(w, err.Error(), http.StatusBadRequest)
		return
	}
	jsonOK(w, task, http.StatusCreated)
}

func (h *TaskHandler) Update(w http.ResponseWriter, r *http.Request) {
	var in model.UpdateTaskInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		jsonError(w, "invalid body", http.StatusBadRequest)
		return
	}
	task, err := h.svc.Update(r.Context(), mux.Vars(r)["id"], in)
	if errors.Is(err, service.ErrNotFound) {
		jsonError(w, "not found", http.StatusNotFound)
		return
	}
	if err != nil {
		jsonError(w, "internal error", http.StatusInternalServerError)
		return
	}
	jsonOK(w, task, http.StatusOK)
}

func (h *TaskHandler) Delete(w http.ResponseWriter, r *http.Request) {
	if err := h.svc.Delete(r.Context(), mux.Vars(r)["id"]); errors.Is(err, service.ErrNotFound) {
		jsonError(w, "not found", http.StatusNotFound)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *TaskHandler) ToggleLike(w http.ResponseWriter, r *http.Request) {
	task, err := h.svc.ToggleLike(r.Context(), mux.Vars(r)["id"])
	if errors.Is(err, service.ErrNotFound) {
		jsonError(w, "not found", http.StatusNotFound)
		return
	}
	if err != nil {
		jsonError(w, "internal error", http.StatusInternalServerError)
		return
	}
	jsonOK(w, task, http.StatusOK)
}

func jsonOK(w http.ResponseWriter, data any, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(data)
}

func jsonError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
