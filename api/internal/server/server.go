package server

import (
	"github.com/gofiber/fiber/v2"

	"choclacado/internal/database"
)

type FiberServer struct {
	*fiber.App

	db database.Service
}

func New() *FiberServer {
	server := &FiberServer{
		App: fiber.New(fiber.Config{
			ServerHeader: "choclacado",
			AppName:      "choclacado",
		}),

		db: database.New(),
	}

	return server
}
