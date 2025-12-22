package tags

import (
	errRsp "choclacado/internal"
	"choclacado/sqlc/mkdb"
	"log/slog"

	"github.com/gofiber/fiber/v2"
)

type AddTagsReq struct {
	Tags []string `json:"tags"`
}

func findNewTags(exisingInDb []mkdb.Tag, sent []string) []string {
	existingMap := make(map[string]struct{}, len(exisingInDb))

	for _, v := range exisingInDb {
		existingMap[v.Value] = struct{}{}
	}

	var diff []string
	for _, v := range sent {
		if _, found := existingMap[v]; !found {
			diff = append(diff, v)
		}
	}

	return diff
}

func Add(c *fiber.Ctx, queries *mkdb.Queries) error {
	var tagReq = new(AddTagsReq)

	slog.Debug(string(c.Body()))

	if err := c.BodyParser(tagReq); err != nil {
		return c.JSON(errRsp.HandleErrors("Failed to parse Request", err))
	}

	existingTags, err := queries.ListTagsByValue(c.Context(), tagReq.Tags)

	if err != nil {
		return c.JSON(errRsp.HandleErrors("Failed to grab tags", err))
	}

	newTags := findNewTags(existingTags, tagReq.Tags)

	if len(newTags) == 0 {
		return c.JSON(fiber.Map{"status": "No Tags Need to be added"})
	}

	_, err = queries.CreateTags(c.Context(), newTags)

	if err != nil {
		return c.JSON(errRsp.HandleErrors("Failed add new tags", err))
	}

	return c.JSON(fiber.Map{"Added": newTags})
}
