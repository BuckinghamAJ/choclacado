CREATE TABLE resource_type (
    id SERIAL PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    accountPosted TEXT NOT NULL REFERENCES "user"(id),
    createDate TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updateDate TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resource INTEGER NOT NULL REFERENCES resource_type(id),
    url TEXT,
    content TEXT
);

CREATE TABLE posts_tags (
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id),
    PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_posts_accountPosted ON posts(accountPosted);
CREATE INDEX idx_posts_createDate ON posts(createDate);
CREATE INDEX idx_posts_resource ON posts(resource);

INSERT INTO resource_type (value) VALUES ('Articles');
INSERT INTO resource_type (value) VALUES ('Code Snippets');
INSERT INTO resource_type (value) VALUES ('Learning Resources');
