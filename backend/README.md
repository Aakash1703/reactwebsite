# browse-by-author-api

FastAPI service for CityLibrary that exposes a hardcoded list of authors.

## Endpoints

- `GET /` — health check
- `GET /browse-by-author` — returns `{"authors": [...]}` from the hardcoded `AUTHORS` list
- `GET /browse-by-author-db` — returns `{"authors": [...]}` queried from `authors.db`, a
  SQLite database committed to this repo and copied into the Docker image at build time.
  Demonstrates a DB-backed version of the same data alongside the in-memory one. To change
  the DB-backed list, edit `authors.db` directly (see below) and commit it — edits made to
  the file inside a running container are lost when that instance restarts, since each new
  container starts fresh from the image.

## Run locally

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Then visit http://127.0.0.1:8000/browse-by-author

## Deploy

Pushing changes under `backend/` to `main` triggers
`.github/workflows/deploy-backend-cloudrun.yml`, which builds and deploys this
service to Cloud Run using the `GCP_SA_KEY` repo secret.
