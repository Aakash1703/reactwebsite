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


@app.get("/")
def root():
    return {"status": "ok", "service": "browse-by-author-api"}


@app.get("/browse-by-author")
def browse_by_author():
    return {"authors": AUTHORS}
