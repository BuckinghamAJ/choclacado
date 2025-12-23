FROM golang:1.25-alpine AS build

WORKDIR /app

# Install migrate binary
RUN apk add --no-cache curl && \
    curl -L https://github.com/golang-migrate/migrate/releases/download/v4.17.0/migrate.linux-amd64.tar.gz | tar xvz && \
    mv migrate /usr/local/bin/migrate && \
    chmod +x /usr/local/bin/migrate

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main ./main.go

FROM alpine:3.20.1 AS prod

RUN apk --no-cache add ca-certificates && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY --from=build /usr/local/bin/migrate /usr/local/bin/migrate
COPY --from=build /app/main /app/main
COPY db/migrations ./migrations
COPY --chmod=755 bin/entrypoint.sh .

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 7373
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["./main"]
