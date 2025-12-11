package server

import (
	"choclacado/auth"
	"log/slog"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

var logger *slog.Logger

func (s *FiberServer) RegisterFiberRoutes() {
	// Apply CORS middleware
	s.App.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS,PATCH",
		AllowHeaders:     "Accept,Authorization,Content-Type",
		AllowCredentials: false, // credentials require explicit origins
		MaxAge:           300,
	}))

	s.App.Get("/", s.HelloWorldHandler)

	s.App.Get("/health", s.healthHandler)
	s.App.Get("/env", s.envHandler)

	s.App.Get("/api/auth/verify", s.verifyAuthHandler)
	s.App.Get("/api/me", s.verifyAuthHandler)

}

func (s *FiberServer) HelloWorldHandler(c *fiber.Ctx) error {
	resp := fiber.Map{
		"message": "Hello World",
	}

	return c.JSON(resp)
}

func (s *FiberServer) healthHandler(c *fiber.Ctx) error {
	return c.JSON(s.db.Health())
}

func (s *FiberServer) envHandler(c *fiber.Ctx) error {
	resp := fiber.Map{
		"environment Vars": os.Environ(),
	}

	return c.JSON(resp)
}

type AuthResponse struct {
	Status  string     `json:"status"`
	Message string     `json:"message"`
	User    *auth.User `json:"user,omitempty"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func (s *FiberServer) verifyAuthHandler(c *fiber.Ctx) error {
	user, err := auth.UserFromRequest(c.Request(), c.Context())
	if err != nil {
		slog.Error("failed to get user", slog.Any("error", err))

		// Return 401 Unauthorized with appropriate error message

		c.Status(http.StatusUnauthorized)

		errorMessage := "Authentication failed"

		errorResponse := ErrorResponse{
			Error: errorMessage,
		}

		return c.JSON(errorResponse)
	}

	response := AuthResponse{
		Status:  "success",
		Message: "Token is valid",
		User:    &user,
	}

	return c.JSON(response)

}
