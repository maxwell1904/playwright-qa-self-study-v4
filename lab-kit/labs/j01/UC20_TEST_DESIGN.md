# J01 completion - UC-20 collection test design

Write the rule/oracle before automation. Do not choose E2E for every row.

| ID | Status | Amount partition/boundary | Net paid before | Expected result | Persistence oracle | Cheapest useful level |
| --- | --- | --- | ---: | --- | --- | --- |
| C1 | RECEIVED | valid | 0 | TODO | TODO | TODO |
| C2 | TODO | 0 | TODO | TODO | TODO | TODO |
| C3 | READY_FOR_PICKUP | exact remaining | TODO | TODO | TODO | TODO |
| C4 | TODO | remaining + 1 | TODO | TODO | TODO | TODO |
| C5 | COMPLETED | numerically valid | TODO | TODO | TODO | TODO |

No-partial-write oracle:

Why the E2E slice is smaller than the service suite:
