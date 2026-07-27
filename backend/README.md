# browse-by-author-api

FastAPI service for CityLibrary that exposes a hardcoded list of authors.

## Endpoints

- `GET /` — health check
- `GET /browse-by-author` — returns `{"authors": [...]}` from the hardcoded `AUTHORS` list
- `GET /browse-by-author-db` — returns `{"authors": [...]}` queried from a bundled SQLite
  database (`authors.db`), seeded from `AUTHORS` on first startup. Demonstrates a DB-backed
  version of the same data alongside the in-memory one. Note: since the DB file lives in the
  container filesystem, it resets on every redeploy/new instance — fine for a demo, not for
  production persistence.

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
