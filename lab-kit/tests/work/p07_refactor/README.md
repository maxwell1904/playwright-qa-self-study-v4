# P07 refactor lab

First make the two starter checks green. Then refactor from evidence:

1. Extract one `openOrder` task helper because the copies have the same meaning.
2. Keep the final business-heading oracle in the helper or immediately after it; do not create a silent click helper.
3. Add a deterministic data builder only after a second input shape needs the same defaults.
4. Add a fixture only when setup/use/teardown lifecycle is real.
5. Run focused tests, full work list, repeat and reorder.

Do not create `BasePage`, `CommonUtils` or a mega Page Object for this tiny suite.
