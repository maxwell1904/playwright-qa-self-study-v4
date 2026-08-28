# UC-09 disturbance matrix

Predict every row before running it in the canonical Laundry repo.

| Disturbance | Expected earliest stop | Controller called? | Service called? | DB oracle | Actual evidence |
| --- | --- | --- | --- | --- | --- |
| POST missing CSRF | Security filter | no | no | no rows |  |
| `quantity=abc` | Binding/conversion | yes | no valid command | no rows |  |
| negative quantity | Bean Validation/shape | yes | no command | no rows |  |
| ITEM fractional quantity | Service/domain validation | yes | yes | no rows |  |
| inactive service ID | Service authoritative reload | yes | yes | no rows |  |
| fake `unitPrice`/`staffId` | ignored/untrusted boundary | yes | yes | server truth only |  |
| persistence exception after header insert | transaction rollback | yes | yes | no partial order/items/history |  |
| detail heading copy change | response/UI contract | yes | yes | backend may be correct |  |

Canonical reminders:

- UC-09 locks selected active service rows in ascending service ID; no nonexistent order lock.
- It snapshots contact/service/unit/price, calculates rounded lines and inserts initial history atomically.
- It writes no collection/payment; UC-20 is a separate submission after redirect to detail.
