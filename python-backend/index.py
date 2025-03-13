import asyncio
import json
from contextlib import asynccontextmanager
from dataclasses import dataclass
from typing import List, Dict, Any
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
import os

NAME = "Python/FastAPI"

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "env.json"))
with open(env_path, 'r') as file:
    env = json.load(file)

async def connect_db():
    return await asyncpg.connect(
        user=env["db"]["username"],
        port=env["db"]["port"],
        password=env["db"]["password"],
        database=env["db"]["database"],
        host=env["db"]["host"]
    )

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(lifespan=lifespan)
origins = [
    "http://localhost:5173",
    "http://localhost:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/all-posts")
async def get_all_posts():
    conn = await connect_db();
    posts = await conn.fetch("SELECT * FROM posts")
    return {
        "name": NAME,
        "posts": posts
    }