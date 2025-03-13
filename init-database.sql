CREATE DATABASE ClimatePosts;

CREATE TABLE Posts (
    post_number INTEGER PRIMARY KEY,
    post_id BIGINT NOT NULL,
    datetime TIMESTAMP,
    username VARCHAR(100),
    text TEXT,
    raw_sentiment_score REAL,
    positive_sentiment BOOLEAN
);

COPY Posts
FROM '/Users/peter/AsyncBench/climate_posts.csv'
WITH (
    FORMAT csv,
    HEADER true,
    DELIMITER ','
);
