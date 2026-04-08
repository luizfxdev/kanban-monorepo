package model

import "time"

type Status string

const (
	StatusPendentes  Status = "pendentes"
	StatusConcluidas Status = "concluidas"
)

type Task struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"`
	Status      Status    `json:"status"`
	Liked       bool      `json:"liked"`
	Likes       int       `json:"likes"`
	Tag         string    `json:"tag,omitempty"`
	TagColor    string    `json:"tag_color,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateTaskInput struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      Status `json:"status"`
	Tag         string `json:"tag"`
	TagColor    string `json:"tag_color"`
}

type UpdateTaskInput struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Status      *Status `json:"status"`
	Tag         *string `json:"tag"`
	TagColor    *string `json:"tag_color"`
}
