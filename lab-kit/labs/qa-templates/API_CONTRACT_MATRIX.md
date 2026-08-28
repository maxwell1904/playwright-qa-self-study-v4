# API contract matrix

- Resource / base URL:
- Contract owner/source:
- Authentication/authorization mechanism:
- Data ownership and cleanup:
- Sensitive fields that must not be logged:

| Case | Method/path | Auth | Request shape | Expected status/headers | Runtime body invariant | Side effect / read-back oracle | Cleanup |
| --- | --- | --- | --- | --- | --- | --- | --- |
| valid create |  |  |  |  |  |  |  |
| boundary |  |  |  |  |  |  |  |
| invalid body |  |  |  |  |  | no record | n/a |
| unauthorized |  | none/wrong role |  |  | no private fields | no mutation | n/a |
| missing |  |  |  |  | error contract | none | n/a |
| transition/duplicate |  |  |  |  | business invariant | exactly once / unchanged |  |

## Layer statement

- This API suite proves:
- It does not prove:
- One UI journey still required:
