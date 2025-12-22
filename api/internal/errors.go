package errRsp

import "log/slog"

type errorResponse struct {
	Error string `json:"error"`
}

func HandleErrors(message string, err error) errorResponse {
	slog.Error(message, slog.Any("error", err))

	errorResponse := errorResponse{
		Error: message,
	}

	return errorResponse
}
