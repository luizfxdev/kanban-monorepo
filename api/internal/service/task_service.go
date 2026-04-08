package service

import (
	"context"
	"database/sql"
	"errors"

	"github.com/seu-usuario/kanban/api/internal/model"
	"github.com/seu-usuario/kanban/api/internal/repository"
)

var ErrNotFound = errors.New("task not found")

type TaskService struct {
	repo *repository.TaskRepository
}

func NewTaskService(repo *repository.TaskRepository) *TaskService {
	return &TaskService{repo: repo}
}

func (s *TaskService) List(ctx context.Context) ([]model.Task, error) {
	tasks, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}
	if tasks == nil {
		tasks = []model.Task{}
	}
	return tasks, nil
}

func (s *TaskService) Get(ctx context.Context, id string) (*model.Task, error) {
	task, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if task == nil {
		return nil, ErrNotFound
	}
	return task, nil
}

func (s *TaskService) Create(ctx context.Context, in model.CreateTaskInput) (*model.Task, error) {
	if in.Title == "" {
		return nil, errors.New("title is required")
	}
	if in.Status == "" {
		in.Status = model.StatusPendentes
	}
	return s.repo.Create(ctx, in)
}

func (s *TaskService) Update(ctx context.Context, id string, in model.UpdateTaskInput) (*model.Task, error) {
	task, err := s.repo.Update(ctx, id, in)
	if err != nil {
		return nil, err
	}
	if task == nil {
		return nil, ErrNotFound
	}
	return task, nil
}

func (s *TaskService) Delete(ctx context.Context, id string) error {
	if err := s.repo.Delete(ctx, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}
	return nil
}

func (s *TaskService) ToggleLike(ctx context.Context, id string) (*model.Task, error) {
	task, err := s.repo.ToggleLike(ctx, id)
	if err != nil {
		return nil, err
	}
	if task == nil {
		return nil, ErrNotFound
	}
	return task, nil
}
