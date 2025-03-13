package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type Post struct {
	PostNumber       int            `json:"post_number"`
	DateTime         sql.NullString `json:"datetime"` // Handle NULL
	UserName         sql.NullString `json:"username"` // Handle NULL
	Text             sql.NullString `json:"text"`     // Handle NULL
	RawSentiment     sql.NullFloat64 `json:"raw_sentiment_score"` // Handle NULL
	PositiveSentiment sql.NullBool   `json:"positive_sentiment"` // Handle NULL
}

const NAME = "Go/Gin"
var db *sql.DB

func main() {
	// Load database credentials from env.json
	env, err := loadEnv()
	if err != nil {
		log.Fatalf("Error loading env.json: %v", err)
	}

	// Connect to PostgreSQL
	var errDB error
	db, errDB = sql.Open("postgres", env["dsn"])
	if errDB != nil {
		log.Fatalf("Error connecting to database: %v", errDB)
	}
	defer db.Close()

	// Verify the connection
	if err = db.Ping(); err != nil {
		log.Fatalf("Database ping failed: %v", err)
	}

	// Setup Gin router
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Allow frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour, // Cache CORS rules
	}))
	router.GET("/all-posts", getAllPosts)
	router.Run("localhost:8080")
}

func getAllPosts(c *gin.Context) {
	rows, err := db.Query("SELECT post_number, datetime, username, text, raw_sentiment_score, positive_sentiment FROM posts")
	if err != nil {
		log.Printf("Error executing query: %v", err) 
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts", "details": err.Error()})
		return
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post
		if err := rows.Scan(&p.PostNumber, &p.DateTime, &p.UserName, &p.Text, &p.RawSentiment, &p.PositiveSentiment); err != nil {
			log.Printf("Error scanning row: %v", err) 
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan post", "details": err.Error()})
			return
		}
		posts = append(posts, p)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error during row iteration: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process posts", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"name": NAME,
		"posts": posts,
	})

}


func loadEnv() (map[string]string, error) {
	file, err := os.Open("../env.json")
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var env map[string]map[string]string
	if err := json.NewDecoder(file).Decode(&env); err != nil {
		return nil, err
	}

	return map[string]string{
		"dsn": "postgres://" + env["db"]["username"] + ":" + env["db"]["password"] +
			"@" + env["db"]["host"] + ":" + env["db"]["port"] + "/" + env["db"]["database"] +
			"?sslmode=disable",
	}, nil
}
