# Foundation lab suite — QA00, JS01–JS08, TS01–TS04

Suite này đi cùng Part I của coursebook v4. Nó giả định người học bắt đầu từ zero và cần lấy lại khả năng tự suy nghĩ sau thời gian dài phụ thuộc AI.

## Bốn lớp artifact

- `worked/`: ví dụ nhỏ chạy được, dùng khi đọc mental model.
- `work/`: starter của người học. File hợp lệ về syntax/type nhưng cố tình chưa đúng contract.
- `tests/`: contract tests chạy được với cả `work` và `reference`.
- `reference/`: H5 solution; chỉ mở sau timebox và bug note.

Mỗi ID `QA00`, `JS01`–`JS08`, `TS01`–`TS04` có artifact ở cả bốn lớp. Nội dung
`work/reference/tests` khớp đúng Completion/Independent contract trong Part I, không chỉ cùng
chủ đề. `JS01`, `JS05` và `JS07` có companion files vì chính bài học yêu cầu nhiều artifact.
JS08/TS04 có thêm spec browser thật ở `../tests/{work|reference}/foundation/`; Node contract
không được dùng để thay browser gate đó.

## Chạy trực tiếp

Đứng tại `lab-kit/`:

```bash
node foundations/scripts/status.mjs
node foundations/scripts/run-worked.mjs
node foundations/scripts/run-suite.mjs work
node foundations/scripts/run-suite.mjs reference
npx tsc -p foundations/tsconfig.json --noEmit
```

Expected ban đầu:

- worked examples chạy xanh;
- reference suite xanh;
- typecheck xanh;
- work suite đỏ vì starter còn `TODO`.

`work` đỏ là bài tập đang mở, không phải lab kit hỏng. Mỗi lần chỉ sửa lesson hiện tại. Có thể chạy một lesson:

```bash
node foundations/scripts/run-suite.mjs work JS03
node foundations/scripts/run-suite.mjs reference TS02
```

Coursebook dùng alias npm trực tiếp, ví dụ `npm run lab:qa00`, `npm run lab:js03`,
`npm run lab:ts01`, `npm run lab:js08` và `npm run lab:ts04`.

QA00 starter thật là `work/qa00.mjs`; không có `starter/receipt.mjs` ẩn. JS07 production
functions được cấp trong `work/js07.mjs`, còn bài của learner là
`work/js07.learner.test.mjs`.

JS01 Completion/Independent được chấm ở `work/js01.mjs` và
`work/js01_service_snapshot.mjs`. Deliberate failures chạy riêng trong
`work/js01_failure_playground.mjs` để không làm bẩn trạng thái cuối của hai bài được chấm.
Playground chỉ dùng syntax JS01; mở từng failure block một, ghi evidence rồi khôi phục trước
khi sang block khác.

## Anti-brainrot protocol

1. Viết prediction trước lần chạy đầu.
2. Hai mươi phút đầu của completion không dùng AI.
3. Trước khi xin hint, ghi `expected / actual / hypothesis / evidence`.
4. Không mở `reference/` trước H5.
5. Nếu đã xem reference, đóng file rồi làm một variation không AI.
6. Không sửa tests để làm starter xanh; tests là executable contract.

## TypeScript boundary

Suite dùng `strict`, `noUncheckedIndexedAccess` và `exactOptionalPropertyTypes`. Node 22+ chạy các file `.ts` có erasable type syntax trực tiếp; `tsc` vẫn là type gate riêng. Không dùng enum, decorator hoặc TypeScript syntax cần code generation.

Các bài dùng vocabulary Laundry nhưng không phải production implementation. Java/Spring/PostgreSQL vẫn là authority của hệ thống SWP391; JavaScript/TypeScript ở đây phục vụ reasoning và automation.
