package server

import (
	"choclacado/auth"
	"choclacado/posts"
	"log/slog"
	"net/http"
	"strconv"

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

	api := s.App.Group("/api", s.authMiddleware)

	api.Get("/me", s.verifyAuthHandler)
	api.Get("/posts", s.getAllPostsHandler)
	api.Post("/posts", s.addNewPost)
	api.Delete("/posts/:id", s.deletePost)
	api.Patch("/posts/:id", s.updatePost)

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

func (s *FiberServer) authMiddleware(c *fiber.Ctx) error {
	user, err := auth.UserFromRequest(c.Request(), c.Context())
	if err != nil {
		slog.Error("failed to get user", slog.Any("error", err))

		return c.Status(http.StatusUnauthorized).JSON(ErrorResponse{
			Error: "Authentication failed",
		})
	}

	c.Locals("user", user)
	return c.Next()
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
	user := c.Locals("user").(auth.User)

	response := AuthResponse{
		Status:  "success",
		Message: "Token is valid",
		User:    &user,
	}

	return c.JSON(response)

}

func (s *FiberServer) getAllPostsHandler(c *fiber.Ctx) error {
	return posts.GetAll(c, s.db.Queries())
}

func (s *FiberServer) addNewPost(c *fiber.Ctx) error {
	return posts.Add(c, s.db.Queries())
}

func (s *FiberServer) deletePost(c *fiber.Ctx) error {
	postIdStr := c.Params("id")
	postIdInt, err := strconv.ParseInt(postIdStr, 10, 32)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error: "Invalid post ID",
		})
	}
	postId := int32(postIdInt)
	return posts.Delete(c, s.db.Queries(), postId)
}

func (s *FiberServer) updatePost(c *fiber.Ctx) error {

	postIdStr := c.Params("id")
	postIdInt, err := strconv.ParseInt(postIdStr, 10, 32)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(ErrorResponse{
			Error: "Invalid post ID",
		})
	}
	postId := int32(postIdInt)
	return posts.Update(c, s.db.Queries(), postId)
}
