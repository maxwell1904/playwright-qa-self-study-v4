# Playwright + QA + SWP391 Self-Study v4

Đây là bản v4 cá nhân hóa cho điểm xuất phát zero thật, internship còn gần ba tháng và SWP391 bắt đầu sau khoảng ba tuần.

## Bản v4 sửa lỗi gì của v3?

V3 có recovery/gate/lab tốt nhưng nén JavaScript/TypeScript quá mạnh. V4 không dùng nhãn “zero” dựa vào hai trang async. Nó có teaching runway riêng cho:

- terminal/Node/npm và feedback loop;
- values, conditions, loops, functions, arrays/objects/reference;
- modules, JSON, errors và stack trace;
- Promise/async/await;
- TypeScript strict, union, optional, `unknown`, narrowing và runtime boundary;
- bridge đọc/viết Playwright spec;
- QA fundamentals, HTTP/API, SQL, Git, CI và Docker operational;
- Playwright core và evidence-driven debug;
- Java/Spring reverse + toàn bộ canonical Laundry.

V3 không bị xóa. Folder v4 đứng riêng để đối chiếu và rollback.

## Ba PDF

1. `pdf/01_Zero_to_Playwright_QA_SWP391_v4.pdf` - teaching volume; học concept và lab.
2. `pdf/02_12_Week_Career_Playbook_v4.pdf` - lịch 3 + 8 + 1, branching/recovery và quyết định ưu tiên.
3. `pdf/03_Hints_Rubrics_and_Answer_Keys_v4.pdf` - chỉ mở theo hint ladder/timebox.

Editable sources nằm trong `source/`.

## Bắt đầu hôm nay

1. Mở teaching PDF, đọc `00 - Hợp đồng học tập cá nhân hóa`.
2. Copy hoặc mở `source/progress/CONTROL_PANEL.md`, điền ngày bắt đầu và SWP dự kiến.
3. Làm `QA00` rồi `JS01`; không làm baseline event-loop của v3.
4. Cài lab theo `lab-kit/README.md` và chạy `npm run check:all`.
5. Kết thúc bằng `source/progress/SESSION_TEMPLATE.md` và một restart line.

QA00 starter thật là `lab-kit/foundations/work/qa00.mjs`; chạy từ `lab-kit/` bằng
`npm run lab:qa00`. Danh sách exact artifact của mọi foundation lesson nằm ngay đầu Part I
và được máy kiểm tra bởi `source/lab_contracts_v4.json`.

## Nhịp đã khóa

```text
Tuần 1-3   zero runway: foundation + QA + typed Playwright nhỏ
Tuần 4-11  full SWP: tự đi hết UC-01..30 theo vertical slice
Tuần 12    consolidation: random change + seeded bug + clean run + defense
```

Ba tuần runway đầy đủ ước tính 55-63 giờ active practice. Nếu m không có 18-21 giờ/tuần, đừng giả vờ “xong foundation” để đúng lịch: dùng Playbook branching rules, giữ prerequisite trực tiếp và kéo curriculum dài hơn.

## CI/CD và Docker

- CI/CD là core ở mức chạy một pipeline thật, đọc failure và lấy artifact.
- Docker chỉ học run/stop/log/env/port/volume/Compose khi môi trường cần.
- Không rẽ DevOps, Kubernetes/cloud sâu hoặc Selenium thứ hai trong runway.

## Luật AI quan trọng nhất

Prediction và independent transfer phải làm không AI. Sau khi xem H5/reference solution, đóng lời giải và tự làm một biến thể mới. Code xanh nhưng không giải thích/sửa biến thể/debug được thì chưa pass.

## Lệnh kiểm tra pack

Từ `lab-kit/`:

```bash
npm ci
npx playwright install chromium
npm run check:all
```

Từ `source/`, sau khi PDF đã render:

```bash
python3 validate_v4.py
```

Validator không còn chỉ đếm chapter/token. <code>npm run zero:audit</code> kiểm tra block/hint theo
từng lesson, prerequisite leak và false-green guard; manifest hiện khóa 47 contract riêng từ
QA00-JS/TS, P01-P11, J00-J07, S01-S07 tới W1-W8.

## Canonical Laundry boundary

Production Laundry giữ Java 21, Spring Boot 4.1.x, Spring MVC/Thymeleaf/Security session+CSRF, JPA/Hibernate, PostgreSQL/Flyway, Maven và Bootstrap. TypeScript/Node là automation lab; API sandbox không trở thành REST layer của Laundry. Không thêm React/JWT/customer account/payment gateway/delivery/inventory chỉ để portfolio trông nhiều công nghệ.
