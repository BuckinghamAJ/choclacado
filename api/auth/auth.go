package auth

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/lestrrat-go/httprc/v3"
	"github.com/lestrrat-go/jwx/v3/jwk"
	"github.com/lestrrat-go/jwx/v3/jwt"
	"github.com/valyala/fasthttp"
)

type User struct {
	ID    string
	Email string
	Name  string
}

var (
	ErrMissingUserID = errors.New("missing user id!")
	keySetCache      *jwk.Cache
)

func init() {
	ctx := context.Background()

	cache, err := jwk.NewCache(ctx, httprc.NewClient())
	if err != nil {
		panic(err)
	}

	BETTER_AUTH_JWT_URL := os.Getenv("BETTER_AUTH_JWT_URL")
	if BETTER_AUTH_JWT_URL == "" {
		BETTER_AUTH_JWT_URL = "http://frontend:3000/api/auth/jwks"
	}

	if err := cache.Register(ctx, BETTER_AUTH_JWT_URL); err != nil {
		panic(err)
	}

	keySetCache = cache
}

func UserFromRequest(fhr *fasthttp.Request, ctx *fasthttp.RequestCtx) (User, error) {

	BETTER_AUTH_JWT_URL := os.Getenv("BETTER_AUTH_JWT_URL")

	keyset, err := keySetCache.Lookup(ctx, BETTER_AUTH_JWT_URL)
	if err != nil {

		return User{}, fmt.Errorf("fetch jwks: %w", err)
	}

	authHeader := string(fhr.Header.Peek("Authorization"))
	if authHeader == "" {
		return User{}, fmt.Errorf("missing authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		return User{}, fmt.Errorf("invalid authorization format")
	}

	token, err := jwt.Parse([]byte(tokenString), jwt.WithKeySet(keyset))
	if err != nil {
		return User{}, fmt.Errorf("parse request: %w", err)
	}

	userID, exists := token.Subject()
	if !exists {
		return User{}, ErrMissingUserID
	}

	var email string
	var name string

	token.Get("email", &email)
	token.Get("name", &name)

	return User{
		ID:    userID,
		Email: email,
		Name:  name,
	}, nil
}
