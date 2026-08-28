# J06 Docker operational lab

This Compose file runs only a disposable PostgreSQL dependency for J03/J06. It does not create
a second Laundry architecture and it is not a production deployment recipe.

From `lab-kit/labs/docker/`:

```sh
docker compose config
docker compose up -d
docker compose ps
docker compose logs postgres
docker compose exec postgres pg_isready -U lab_user -d laundry_lab
```

Host clients use port `55432` by default; containers on the Compose network would use service
name `postgres` and container port `5432`, not `localhost:55432`.

Stop without deleting the named volume: `docker compose stop`. Only for an explicitly disposable
reset, after verifying this exact project and volume, use `docker compose down -v`; that deletes
the lab data and the next start recreates it from schema/seed files.

Before each failure injection, write expected symptom and first evidence command. Do not delete
containers or volumes as the first reaction to a port, password or readiness failure.
