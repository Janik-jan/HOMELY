FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM golang:1.25-alpine AS backend
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /homely .

FROM alpine:latest
WORKDIR /app
COPY --from=backend /homely ./homely
COPY --from=frontend /app/frontend/dist ./dist
EXPOSE 8080
CMD ["./homely"]
