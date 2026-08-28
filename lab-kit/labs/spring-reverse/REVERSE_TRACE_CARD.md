# Reverse trace evidence card

Use one card per concrete request in the canonical Laundry repo.

- Date / commit:
- UC / BR:
- User-visible outcome:
- Prediction before run:

## Browser

- DOM role/name and action:
- Form/query values:
- Playwright assertion:

## HTTP

- Method/path/query:
- Relevant headers/cookie/CSRF:
- Body fields:
- Status/Location/content type:

## Security and MVC

- Authentication/role:
- Filter decision:
- Controller breakpoint hit?:
- Handler method:
- Typed form/query + BindingResult:

## Business and persistence

- Service method:
- Transaction boundary:
- Canonical rules checked:
- Rows read/locked:
- Rows written:
- Rollback oracle:

## Response

- Error render or redirect + GET:
- Model/view/template:
- Final HTML/URL:

## Disturbance

- Change injected:
- Expected earliest stop point:
- Actual evidence:
- Root cause / learning:

## Teach-back

Explain the full chain in 3-5 minutes without reading this card.
# Canonical Spring reverse trace card

Use this as the compact index card. Detailed runnable-evidence cards are in the same folder:
`J00_JAVA_READING.md`, `S01_HTTP_CONTAINER_TRACE.md`, `S02_MVC_PRG_TRACE.md`,
`S03_TRANSACTION_TRACE.md`, `S04_PERSISTENCE_TRACE.md`, `S05_SECURITY_TRACE.md`,
`S06_TEST_LAYER_MATRIX.md` and `S07_FULL_VERTICAL_TRACE.md`.
