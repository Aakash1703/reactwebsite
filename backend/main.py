import sqlite3
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CityLibrary Browse By Author API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

AUTHORS = [
    "Jane Austen",
    "George Orwell",
    "J.K. Rowling",
    "Agatha Christie",
    "Mark Twain",
    "Toni Morrison",
    "Ernest Hemingway",
    "Chimamanda Ngozi Adichie",
    "F. Scott Fitzgerald",
]

DB_PATH = Path(__file__).parent / "authors.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE)"
    )
    count = conn.execute("SELECT COUNT(*) FROM authors").fetchone()[0]
    if count == 0:
        conn.executemany(
            "INSERT INTO authors (name) VALUES (?)", [(name,) for name in AUTHORS]
        )
        conn.commit()
    conn.close()


init_db()


@app.get("/")
def root():
    return {"status": "ok", "service": "browse-by-author-api"}


@app.get("/browse-by-author")
def browse_by_author():
    return {"authors": AUTHORS}


@app.get("/browse-by-author-db")
def browse_by_author_db():
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("SELECT name FROM authors ORDER BY name").fetchall()
    conn.close()
    return {"authors": [row[0] for row in rows]}
