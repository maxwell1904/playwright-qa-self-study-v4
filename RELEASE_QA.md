# Self-Study v4 release QA

Ngày kiểm tra gần nhất: 28/08/2026

## Nội dung và canonical gate

- Teaching source: 39,641 từ theo structural validator.
- Đủ QA00, JS01-JS08, TS01-TS04, P01-P11, J01-J07, J00, S01-S07 và W1-W8.
- Đủ UC-01 đến UC-30 và canonical Laundry guardrails.
- `npm run zero:audit`: PASS cho 39 concept lessons và 47 individual contracts.
- Teaching-to-lab manifest: 47/47 PASS; source mention, artifact path và npm script được kiểm tra thật.
- Structural/PDF validator: PASS.
- Mỗi concept lesson có mental model, worked example, prediction, completion, independent,
  failure injection, transfer và gate; mỗi lesson có H1-H5 riêng.

## Lab gate

- Clean dependency install bằng `npm ci`: PASS; npm báo 0 vulnerability. Npm chỉ cảnh báo
  optional `fsevents` install script chưa nằm trong allow-list; các gate macOS/browser vẫn chạy.
- `npm run check:all`: PASS sau clean install.
- Root TypeScript strict check và foundation TypeScript strict check: PASS.
- 13 worked foundation examples: PASS.
- Foundation reference contracts: 30/30 PASS.
- Playwright/browser reference contracts: 17/17 PASS, gồm JS08/TS04 browser bridge và P05
  ownership proof.
- J01 mutation baseline: 2/2 PASS; J06 Compose topology contract: PASS.
- QA00 learner work: 2/2 PASS, giữ đúng evidence đã ghi trong progress.
- JS01 learner work: 0/2, exit 1 đúng thiết kế tại TODO; JS02 starter: 0/2, exit 1 đúng thiết kế.
- P01 focused starter: exit 2 với tên file còn `fixme`; skipped/fixme không thể được tính là
  completion. Cùng guard được áp dụng cho JS08, TS04 và P01-P11.
- J03 schema/seed/reference queries: PASS trên một PostgreSQL 14.20 cluster local tạm mới tạo;
  Compose target vẫn là PostgreSQL 17. Payment
  history 3 rows, overdue 1 row, failed-pickup snapshot 1 row và BR-32 gross/refund/net =
  60000/10000/50000. Cluster tạm đã stop và xóa sau kiểm tra.
- `docker compose config --quiet`: PASS. Không chạy được đúng Compose container trong lượt này
  vì Docker Desktop trên máy đang tắt; đây là giới hạn môi trường đã được ghi rõ, không được
  giả thành runtime PASS.

Một starter đỏ hoặc bị focused guard chặn là trạng thái bài tập mở, không phải lỗi phát hành.
Reference đỏ, typecheck đỏ, contract lệch hoặc starter tự xanh sẵn mới là lỗi thiết kế pack.

## PDF gate

| PDF | Trang | Bookmarks | Link/annotation | Trang rỗng |
| --- | ---: | ---: | ---: | ---: |
| Teaching | 155 | 113 | 123 | 0 |
| 12-week playbook | 44 | 57 | 70 | 0 |
| Hints/rubrics | 58 | 94 | 108 | 0 |

- Đã rebuild cả ba volume sau full refactor.
- Đã kiểm tra trực quan Teaching trang 22, 81-82, 124, 145-146; Career trang 5, 15, 18;
  Hints trang 16, 17, 31.
- Đã sửa outline Career bị nhảy level và ngắt thủ công lệnh J03 để PDF không bẻ đôi flag `-v`.
- Không có trang rỗng, raw `<code>`, fence `~~~` hoặc replacement glyph trong extracted text.
- Running header, table, code block, Vietnamese glyph, footer và bookmark/link đều giữ layout
  đọc được ở các trang refactor trọng yếu.

## Progress integrity

- `source/progress/CONTROL_PANEL.md` không bị maintenance sửa.
- QA00 vẫn PASSED 10/10; JS01 vẫn NOW; các foundation/Playwright lesson sau vẫn LOCKED.
- Reference, patch, Agent-generated evidence card hay release QA không được tính thành learner
  mastery.

## Release verdict

PASS để tiếp tục từ JS01. Verdict này chứng minh pack chạy, tài liệu-lab-contract nhất quán và
các false-green đã bị chặn; nó không hứa người học sẽ không bao giờ cần hint và không chứng minh
mastery. Docker runtime sẽ được chứng minh khi vào J06 và Docker Desktop đang chạy.
