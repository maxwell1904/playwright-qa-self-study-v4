# J03 PostgreSQL oracle lab

This is a disposable four-table teaching subset, not a replacement Flyway schema for canonical Laundry.
It exists to practise cardinality, ledger aggregates, stable ordering and half-open time ranges.

Run every command below from `lab-kit/labs/sql/`.

1. Start the disposable database and wait for its health check:

   ```sh
   docker compose -f ../docker/compose.yaml up -d --wait
   docker compose -f ../docker/compose.yaml ps
   docker compose -f ../docker/compose.yaml exec postgres pg_isready -U lab_user -d laundry_lab
   ```

2. Open `work/queries.sql` and write a prediction above each query. Then send that file to
   `psql` inside the container; no host PostgreSQL installation is required:

   ```sh
   docker compose -f ../docker/compose.yaml exec -T postgres \
     psql -U lab_user -d laundry_lab \
     -v order_code=LD-001 \
     < work/queries.sql
   ```

3. Check your result against these oracles before opening the reference:

   - payment history for `LD-001`: three rows, newest first (`TX-003`, `TX-002`, `TX-001`);
   - overdue active orders at `2026-08-13T12:00:00Z`: only `LD-001`;
   - failed-pickup snapshot for `LD-002`: status `READY_FOR_PICKUP`, three history rows,
     zero `COMPLETED` rows;
   - BR-32 range `[2026-08-12T17:00:00Z, 2026-08-13T17:00:00Z)`:
     gross `60000`, refund `10000`, net `50000`.

4. Use `reference/queries.sql` only at H5/postmortem. Run it with the same command after
   replacing `work/queries.sql` with `reference/queries.sql`.

5. Stop without deleting data:

   ```sh
   docker compose -f ../docker/compose.yaml stop
   ```

The schema and seed files run only when the named volume is first created. If you intentionally
need a clean disposable reset, first verify that this is the J03/J06 lab, then run
`docker compose -f ../docker/compose.yaml down -v`. This deletes only that Compose project's lab
volume, and the next start recreates it from `schema.sql` and `seed.sql`.

The work file is valid SQL containing deliberate placeholder results, so it runs but cannot pass
the stated oracles until completed. A command that exits successfully is therefore not the J03
gate; the result rows and your cardinality explanation are the evidence.
