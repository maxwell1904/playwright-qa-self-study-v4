# V4 learning control panel

File này là nguồn sự thật tiến độ. Cập nhật ngắn sau mỗi buổi. Không dùng số tuần để tự pass gate.

## Personal calibration

- Start date:
- Expected SWP start:
- Expected SWP end:
- Internship remaining:
- Weekly standard capacity:
- Weekly survival capacity:
- Company Playwright task currently allowed:
- Laundry repo path:

## Current state

- Last session: 2026-08-18 QA00 gate
- Current phase: Three-week zero runway
- Current mission: JS01
- Gate attempt: QA00 passed 10/10
- Mode today: 20 / 45 / 90 minutes
- AI level allowed: A0 / A1 / A2 / A3
- Current blocker/evidence: QA00 work final proof `npm run lab:qa00; echo $?` — 2/2 pass, 0 fail, exit `0`; four failure layers diagnosed; Maven transfer explained
- Next physical action: mở `lab-kit/foundations/work/js01.mjs`, ghi prediction cho ba biểu thức rồi mới chạy `npm run lab:js01`

## Foundation and Playwright board

| Mission | Status | Score /10 | Evidence | Review due | Repair target |
| --- | --- | ---: | --- | --- | --- |
| QA00 runtime/terminal/npm feedback | PASSED | 10/10 | `foundations/work/qa00.mjs`; work 2/2 exit 0; reference 2/2; ENOENT 254→0; missing script 1; SyntaxError 1; module-not-found 1; teach-back + Maven transfer | 2026-08-19 |  |
| JS01 values/variables/expressions | NOW |  |  |  |  |
| JS02 conditions/loops | LOCKED |  |  |  |  |
| JS03 functions/return/scope | LOCKED |  |  |  |  |
| JS04 arrays/objects/reference | LOCKED |  |  |  |  |
| JS05 modules/JSON/errors/stack | LOCKED |  |  |  |  |
| JS06 Promise/async/await | LOCKED |  |  |  |  |
| JS07 unit tests/oracle/mutation | LOCKED |  |  |  |  |
| JS08 browser Playwright bridge | LOCKED |  |  |  |  |
| TS01 strict foundations | LOCKED |  |  |  |  |
| TS02 domain unions | LOCKED |  |  |  |  |
| TS03 unknown/narrowing/runtime validation | LOCKED |  |  |  |  |
| TS04 typed Playwright bridge | LOCKED |  |  |  |  |
| P01 anatomy/oracle | LOCKED |  |  |  |  |
| P02 semantic locator | LOCKED |  |  |  |  |
| P03 synchronization | LOCKED |  |  |  |  |
| P04 controls/table/events | LOCKED |  |  |  |  |
| P05 isolation/data ownership | LOCKED |  |  |  |  |
| P06 auth/session/CSRF | LOCKED |  |  |  |  |
| P07 fixtures/suite design | LOCKED |  |  |  |  |
| P08 API/hybrid | LOCKED |  |  |  |  |
| P09 evidence debug | LOCKED |  |  |  |  |
| P10 CI | LOCKED |  |  |  |  |
| P11 company-style capstone | LOCKED |  |  |  |  |

Status: `LOCKED`, `NOW`, `REPAIR`, `REVIEW`, `PASSED`.

## Job-support skills board

| Mission | Status | Evidence |
| --- | --- | --- |
| J01 testing fundamentals | NOW |  |
| J02 HTTP/API | LOCKED |  |
| J03 SQL oracle | LOCKED |  |
| J04 Git team workflow | NOW |  |
| J05 CI operation | LOCKED |  |
| J06 Docker operational only | LOCKED |  |
| J07 technical English | NOW |  |

## Full SWP board

| Wave | Canonical coverage | Status | Clean evidence | No-agent defense |
| --- | --- | --- | --- | --- |
| Pre-SWP J00-S02 | Java reading + request/MVC | LOCKED |  |  |
| W1 scaffold + UC-05/UC-01 start | LOCKED |  |  |  |
| W2 UC-01-08 except UC-05 already | LOCKED |  |  |  |
| W3 UC-09/10/11/14 | LOCKED |  |  |  |
| W4 UC-12/13/15/16/17 | LOCKED |  |  |  |
| W5 UC-18-24 | LOCKED |  |  |  |
| W6 UC-25-30 | LOCKED |  |  |  |
| W7 regression/docs/demo | LOCKED |  |  |  |
| W8 defense/random change | LOCKED |  |  |  |

## Review queue

| Due | Mission | Retrieval prompt | Result 0/1/2 | Next due |
| --- | --- | --- | ---: | --- |
| 2026-08-19 | QA00 | Vì sao command đúng nhưng đổi thư mục sai làm npm ENOENT; vì sao syntax/module/missing-script khác tầng? |  | 2026-08-26 |

0 = không nhớ/đoán; 1 = nhớ nhưng explain/variation yếu; 2 = explain + apply. Result 0/1 quay lại trong 1-3 ngày; result 2 lùi 7-14 ngày.

## Evidence index

| Date | Mission | Prediction | Independent artifact | Failure evidence | Transfer | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-08-18 | QA00 | Dự đoán output, exit status và failure layer trước mỗi biến thể | `foundations/work/qa00.mjs`; `npm run lab:qa00` 2/2, exit 0 | ENOENT 254; missing script 1; SyntaxError 1; ERR_MODULE_NOT_FOUND 1 | Maven `pom.xml` + root/command/layer model | PASSED 10/10 |

## Internship evidence - private/non-secret

Không chép source, URL nội bộ, secret hoặc customer data.

| Week | Flow/risk | What I did | Failure/debug | Review feedback | What I can now explain |
| --- | --- | --- | --- | --- | --- |
| 2026-08-13 | QA00 | Đổi 3 TODO thành LD-001 / Nguyễn An / Đã tiếp nhận; dự đoán output theo thứ tự dòng và npm tìm package ở thư mục cha |  |  | completion xanh; gate mở |

## Parking lot

Ghi tool hấp dẫn nhưng chưa mở khóa outcome hiện tại: Docker sâu, Kubernetes, Selenium thứ hai, mobile, performance, security specialization, cloud, certification.

- 

## Restart line

> Mở `lab-kit/foundations/work/js01.mjs`, ghi prediction cho ba biểu thức, rồi chạy `npm run lab:js01`.
