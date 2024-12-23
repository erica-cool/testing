package main

import (
	"fmt"
	"log"
	"net/http"

	"context"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

var ctx = context.Background()
var rdb *redis.Client

func main() {

	fmt.Println("Starting at http://localhost:8080")
	r := mux.NewRouter()
	r.HandleFunc("/ping", PingHandler).Methods("GET")
	r.HandleFunc("/user", CreateUserHandler).Methods("POST")
	http.Handle("/", r)

	rdb = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func PingHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "pong")
}

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	// create user in redis : key = user:uuid, value = timestamp
	id := uuid.New().String()
	timestamp := time.Now().Format(time.RFC3339)
	err := rdb.Set(ctx, "user:"+id, timestamp, 0).Err()
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	fmt.Fprint(w, "user created")
}
