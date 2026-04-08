package repository

import (
	"context"
	"database/sql"

	"github.com/seu-usuario/kanban/api/internal/model"
)

type TaskRepository struct {
	db *sql.DB
}

func NewTaskRepository(db *sql.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

func (r *TaskRepository) FindAll(ctx context.Context) ([]model.Task, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, title, description, status, liked, likes, tag, tag_color, created_at, updated_at
		FROM tasks ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []model.Task
	for rows.Next() {
		var t model.Task
		if err := rows.Scan(
			&t.ID, &t.Title, &t.Description, &t.Status,
			&t.Liked, &t.Likes, &t.Tag, &t.TagColor,
			&t.CreatedAt, &t.UpdatedAt,
		); err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}
	return tasks, rows.Err()
}

func (r *TaskRepository) FindByID(ctx context.Context, id string) (*model.Task, error) {
	var t model.Task
	err := r.db.QueryRowContext(ctx, `
		SELECT id, title, description, status, liked, likes, tag, tag_color, created_at, updated_at
		FROM tasks WHERE id = $1
	`, id).Scan(
		&t.ID, &t.Title, &t.Description, &t.Status,
		&t.Liked, &t.Likes, &t.Tag, &t.TagColor,
		&t.CreatedAt, &t.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &t, err
}

func (r *TaskRepository) Create(ctx context.Context, in model.CreateTaskInput) (*model.Task, error) {
	var t model.Task
	err := r.db.QueryRowContext(ctx, `
		INSERT INTO tasks (title, description, status, tag, tag_color)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, title, description, status, liked, likes, tag, tag_color, created_at, updated_at
	`, in.Title, in.Description, in.Status, in.Tag, in.TagColor).Scan(
		&t.ID, &t.Title, &t.Description, &t.Status,
		&t.Liked, &t.Likes, &t.Tag, &t.TagColor,
		&t.CreatedAt, &t.UpdatedAt,
	)
	return &t, err
}

func (r *TaskRepository) Update(ctx context.Context, id string, in model.UpdateTaskInput) (*model.Task, error) {
	var t model.Task
	err := r.db.QueryRowContext(ctx, `
		UPDATE tasks SET
			title       = COALESCE($2, title),
			description = COALESCE($3, description),
			status      = COALESCE($4, status),
			tag         = COALESCE($5, tag),
			tag_color   = COALESCE($6, tag_color),
			updated_at  = NOW()
		WHERE id = $1
		RETURNING id, title, description, status, liked, likes, tag, tag_color, created_at, updated_at
	`, id, in.Title, in.Description, in.Status, in.Tag, in.TagColor).Scan(
		&t.ID, &t.Title, &t.Description, &t.Status,
		&t.Liked, &t.Likes, &t.Tag, &t.TagColor,
		&t.CreatedAt, &t.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &t, err
}

func (r *TaskRepository) Delete(ctx context.Context, id string) error {
	res, err := r.db.ExecContext(ctx, `DELETE FROM tasks WHERE id = $1`, id)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *TaskRepository) ToggleLike(ctx context.Context, id string) (*model.Task, error) {
	var t model.Task
	err := r.db.QueryRowContext(ctx, `
		UPDATE tasks SET
			liked      = NOT liked,
			likes      = CASE WHEN liked THEN likes - 1 ELSE likes + 1 END,
			updated_at = NOW()
		WHERE id = $1
		RETURNING id, title, description, status, liked, likes, tag, tag_color, created_at, updated_at
	`, id).Scan(
		&t.ID, &t.Title, &t.Description, &t.Status,
		&t.Liked, &t.Likes, &t.Tag, &t.TagColor,
		&t.CreatedAt, &t.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &t, err
}
