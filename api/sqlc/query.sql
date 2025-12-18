-- name: CreatePost :one
INSERT INTO posts (
  title, description, accountPosted, resource, url, content
) VALUES (
  $1, $2, $3, $4, $5, $6
)
RETURNING *;

-- name: GetPost :one
SELECT * FROM posts
WHERE id = $1 LIMIT 1;

-- name: GetSinglePost :one
SELECT p.*, array_agg(t.value) as tags, rt.value as resource_type, u.name as posted_by
FROM posts p
LEFT JOIN posts_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
LEFT JOIN resource_type rt ON rt.id = p.resource
LEFT JOIN "user" u ON u.id = p.accountposted
WHERE p.id = $1
GROUP BY p.id, rt.value, u.name;

-- name: GetAllPosts :many
SELECT p.*, array_agg(t.value) as tags, rt.value as resource_type, u.name as posted_by
FROM posts p
LEFT JOIN posts_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
LEFT JOIN resource_type rt ON rt.id = p.resource
LEFT JOIN "user" u ON u.id = p.accountposted
GROUP BY p.id, rt.value, u.name
ORDER BY p.createDate DESC;

-- name: ListPosts :many
SELECT * FROM posts
ORDER BY createDate DESC;

-- name: ListPostsByUser :many
SELECT p.* FROM posts p
JOIN account a ON p.accountPosted = a.id
WHERE a."userId" = $1
ORDER BY p.createDate DESC;

-- name: ListPostsByAccount :many
SELECT * FROM posts
WHERE accountPosted = $1
ORDER BY createDate DESC;

-- name: ListPostsByResourceType :many
SELECT * FROM posts
WHERE resource = $1
ORDER BY createDate DESC;

-- name: ListPostsByTag :many
SELECT p.* FROM posts p
JOIN posts_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
WHERE t.value = $1
ORDER BY p.createDate DESC;

-- name: UpdatePost :exec
UPDATE posts
SET title = $2,
    description = $3,
    resource = $4,
    url = $5,
    content = $6,
    updateDate = NOW()
WHERE id = $1;

-- name: DeletePost :exec
DELETE FROM posts
WHERE id = $1;

-- name: CreateTag :one
INSERT INTO tags (value)
VALUES ($1)
RETURNING *;

-- name: CreateTags :copyfrom
INSERT INTO tags (value)
VALUES ($1);

-- name: ListTagsByValue :many
SELECT * FROM tags
WHERE value = ANY($1::text[]);

-- name: GetTagByValue :one
SELECT * FROM tags
WHERE value = $1 LIMIT 1;

-- name: GetOrCreateTag :one
INSERT INTO tags (value)
VALUES ($1)
ON CONFLICT DO NOTHING
RETURNING *;

-- name: AssociatePostTag :exec
INSERT INTO posts_tags (post_id, tag_id)
VALUES ($1, $2)
ON CONFLICT DO NOTHING;

-- name: RemovePostTag :exec
DELETE FROM posts_tags
WHERE post_id = $1 AND tag_id = $2;

-- name: GetPostTags :many
SELECT t.* FROM tags t
JOIN posts_tags pt ON t.id = pt.tag_id
WHERE pt.post_id = $1;

-- name: CreateResourceType :one
INSERT INTO resource_type (value)
VALUES ($1)
RETURNING *;

-- name: GetResourceType :one
SELECT * FROM resource_type
WHERE id = $1 LIMIT 1;

-- name: ListResourceTypes :many
SELECT * FROM resource_type
ORDER BY value;

-- name: SearchPostsByTitle :many
SELECT * FROM posts
WHERE title ILIKE '%' || $1 || '%'
ORDER BY createDate DESC;

-- name: SearchPostsByDescription :many
SELECT * FROM posts
WHERE description ILIKE '%' || $1 || '%'
ORDER BY createDate DESC;

-- name: ListPostsByMultipleTags :many
SELECT p.*, COUNT(pt.tag_id) as tag_match_count
FROM posts p
JOIN posts_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
WHERE t.value = ANY($1::text[])
GROUP BY p.id
HAVING COUNT(pt.tag_id) = $2
ORDER BY p.createDate DESC;
