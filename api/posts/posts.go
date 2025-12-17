package posts

import (
	"choclacado/auth"
	errRsp "choclacado/internal"
	"choclacado/internal/database"
	"choclacado/sqlc/mkdb"
	"fmt"
	"log/slog"

	"github.com/gofiber/fiber/v2"
)

func GetAll(c *fiber.Ctx, queries *mkdb.Queries) error {
	allPosts, err := queries.GetAllPosts(c.Context())

	if err != nil {
		return c.JSON(errRsp.HandleErrors("Fail to query the posts database", err))
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
	user := c.Locals("user").(auth.User)
	postReq.PostedBy = user.ID

	slog.Debug(string(c.Body()))

	if err := c.BodyParser(postReq); err != nil {
		return c.JSON(errRsp.HandleErrors("Failed to parse Request", err))
	}

	newPost, err := queries.CreatePost(c.Context(), postReq.convertToQuery())

	if err != nil {
		return c.JSON(errRsp.HandleErrors("Fail to add new post to db", err))
	}

	return c.JSON(newPost)

}

type DeletePostReq struct {
	ID   int32  `json:"id"`
	User string `json:"user"`
}

func Delete(c *fiber.Ctx, queries *mkdb.Queries) error {
	var deletePostReq = new(DeletePostReq)
	user := c.Locals("user").(auth.User)

	if err := c.BodyParser(deletePostReq); err != nil {
		return c.JSON(errRsp.HandleErrors("Failed to parse Request", err))
	}

	if user.ID != deletePostReq.User {
		return c.JSON(errRsp.HandleErrors("UnAuthorized Delete Request", fmt.Errorf("%s not allowed to delete post %d", user.ID, deletePostReq.ID)))
	}

	err := queries.DeletePost(c.Context(), deletePostReq.ID)
	if err != nil {
		return c.JSON(errRsp.HandleErrors("Error Deleting Post", err))
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Post deleted successfully",
		"id":      deletePostReq.ID,
	})

}
