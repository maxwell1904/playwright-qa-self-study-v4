# QA evidence templates

Copy only the template needed by the current mission. Do not fill every document to create paperwork.

| Template | Use when |
| --- | --- |
| `RISK_TEST_MATRIX.md` | turning a requirement into risks, test conditions and the right test level |
| `BUG_REPORT.md` | reporting observable product behavior with reproducible evidence |
| `DEBUG_JOURNAL.md` | investigating a failing or flaky automated check |
| `API_CONTRACT_MATRIX.md` | designing HTTP/API checks beyond a status-only assertion |
| `CI_TRIAGE.md` | diagnosing a clean-run/pipeline failure |
| `EVIDENCE_LOG.md` | recording one skill proof without inflating a CV claim |
| `NO_AI_TRANSFER_GATE.md` | proving a concept can be transferred without generated first-pass code |

Rules:

1. Write prediction/expected behavior before running the experiment.
2. Preserve the first meaningful error, exact command and relevant artifact path.
3. Redact secrets, cookies, tokens, credentials and customer data.
4. Link evidence; do not replace evidence with “works on my machine”.
5. A green test created by AI is marked `assisted` until a no-AI variant passes.
