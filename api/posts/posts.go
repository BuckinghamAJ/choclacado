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

	returningPost, err := queries.GetSinglePost(c.Context(), newPost.ID)
	slog.Debug("Get Single Post", slog.Any("returningPost", returningPost))
	if err != nil {
		return c.JSON(errRsp.HandleErrors("Fail to grab new post info", err))
	}

	return c.JSON(returningPost)

}

type DeletePostReq struct {
	User string `json:"user"`
}

func Delete(c *fiber.Ctx, queries *mkdb.Queries, id int32) error {
	var deletePostReq = new(DeletePostReq)
	user := c.Locals("user").(auth.User)

	if err := c.BodyParser(deletePostReq); err != nil {
		return c.JSON(errRsp.HandleErrors("Failed to parse Request", err))
	}

	if user.ID != deletePostReq.User {
		return c.JSON(errRsp.HandleErrors("UnAuthorized Delete Request", fmt.Errorf("%s not allowed to delete post %d", user.ID, id)))
	}

	err := queries.DeletePost(c.Context(), id)
	if err != nil {
		return c.JSON(errRsp.HandleErrors("Error Deleting Post", err))
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Post deleted successfully",
		"id":      id,
	})

}

type UpdatePostReq struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Url         *string `json:"url"`
	User        string  `json:"user"`
	Resource    int32   `json:"resource"`
	Content     *string `json:"content"`
}

func (upr *UpdatePostReq) convertToQuery(id int32) mkdb.UpdatePostParams {
	return mkdb.UpdatePostParams{
		ID:          id,
		Title:       upr.Title,
		Description: upr.Description,
		Resource:    upr.Resource,
		Url:         database.StringToPgText(upr.Url),
		Content:     database.StringToPgText(upr.Content),
	}

}

func Update(c *fiber.Ctx, queries *mkdb.Queries, id int32) error {
	var updatePostReq = new(UpdatePostReq)
	user := c.Locals("user").(auth.User)

	if err := c.BodyParser(updatePostReq); err != nil {
		return c.JSON(errRsp.HandleErrors("Failed to parse Request", err))
	}

	if user.ID != updatePostReq.User {
		return c.JSON(errRsp.HandleErrors("UnAuthorized Update Request", fmt.Errorf("%s not allowed to delete post %d", user.ID, id)))
	}

	err := queries.UpdatePost(c.Context(), updatePostReq.convertToQuery(id))
	if err != nil {
		return c.JSON(errRsp.HandleErrors("Error Updating Post", err))
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Post update successfully",
		"id":      id,
	})
}
