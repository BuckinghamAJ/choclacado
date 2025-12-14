package posts

import (
	"choclacado/internal/database"
	"choclacado/sqlc/mkdb"
	"log/slog"

	"github.com/gofiber/fiber/v2"
)

type errorResponse struct {
	Error string `json:"error"`
}

func handleErrors(message string, err error) errorResponse {
	slog.Error("Fail to query the posts database", slog.Any("error", err))

	errorResponse := errorResponse{
		Error: "Fail to query the posts database",
	}

	return errorResponse
}

func GetAll(c *fiber.Ctx, queries *mkdb.Queries) error {
	allPosts, err := queries.GetAllPosts(c.Context())

	if err != nil {
		return c.JSON(handleErrors("Fail to query the posts database", err))
	}

	return c.JSON(allPosts)

}

type CreatePostReq struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	PostedBy    string  `json:"postedBy"`
	Resource    int32   `json:"resource"`
	Url         *string `json:"url"`
	Content     *string `json:"content"`
}

func (cpr *CreatePostReq) convertToQuery() mkdb.CreatePostParams {
	return mkdb.CreatePostParams{
		Title:         cpr.Title,
		Description:   cpr.Description,
		Accountposted: cpr.PostedBy,
		Resource:      cpr.Resource,
		Url:           database.StringToPgText(cpr.Url),
		Content:       database.StringToPgText(cpr.Content),
	}

}

func Add(c *fiber.Ctx, queries *mkdb.Queries) error {
	var postReq = new(CreatePostReq)

	if err := c.BodyParser(postReq); err != nil {
		return c.JSON(handleErrors("Failed to parse Request", err))
	}

	newPost, err := queries.CreatePost(c.Context(), postReq.convertToQuery())

	if err != nil {
		return c.JSON(handleErrors("Fail to add new post to db", err))
	}

	return c.JSON(newPost)

}
