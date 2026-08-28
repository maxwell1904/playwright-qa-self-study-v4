# PHẦN II - Kỹ năng QA nền: test design, API, SQL, Git, CI và English

> Phần này là một **learning volume**, không phải checklist công nghệ và không phải tài liệu tìm việc. Mục tiêu là biến kiến thức Playwright thành năng lực kỹ thuật dùng được trong dự án thật, đồng thời tạo bằng chứng phục vụ SWP391 Laundry.

## 1. Vai trò của volume này trong lộ trình v4

Thị trường fresher/junior không chỉ cần người “biết viết Playwright”. Một Automation QA có thể làm việc phải nối được cả chuỗi:

```text
Requirement/risk
→ test design
→ browser/HTTP evidence
→ data oracle
→ defect diagnosis
→ version-controlled change
→ clean-machine execution
→ communication
```

Vì vậy, volume này dạy bảy năng lực:

1. QA fundamentals và test design.
2. HTTP và API testing.
3. SQL như một test oracle.
4. Git workflow trong team.
5. CI/CD ở mức đủ dùng cho Automation QA.
6. Docker operational literacy.
7. English for QA.

CI/CD và Docker không phải hai nhánh nghề mới trong ba tháng này. CI/CD chỉ cần đủ để test chạy được trên máy sạch, giữ report và hỗ trợ chẩn đoán. Docker chỉ cần đủ để khởi động dependency, hiểu port/environment/log và sửa lỗi vận hành cơ bản. Trọng tâm vẫn là testing, JS/TS, Playwright, HTTP/API, SQL, Git và khả năng giải thích evidence.

## 2. Hai đường chạy: ba tuần runway và hai tháng SWP

Các module dưới đây không thay thế volume JS/TS hay Playwright. Chúng chạy song song và được xoắn ốc lại trong dự án SWP.

### Ba tuần runway

| Tuần | Trọng tâm | Bằng chứng tối thiểu |
|---|---|---|
| 1 | QA fundamentals, Git căn bản, English QA mỗi ngày | Một risk map, một decision table, ba test case, một bug report; một branch có commit sạch |
| 2 | HTTP/API testing, SQL oracle | Một HTTP contract map, một API suite nhỏ, ba truy vấn có giải thích cardinality |
| 3 | CI đủ dùng, Docker vận hành, tích hợp các kỹ năng | Một pipeline xanh và một lần đỏ có artifact; tự khởi động dependency bằng container; hoàn thành runway gate |

Thứ tự trên là thứ tự phụ thuộc, không phải lịch cưỡng ép. Nếu mất một ngày, không học bù gấp đôi. Tiếp tục từ evidence gần nhất và chỉ qua module khi đạt gate.

### Hai tháng SWP391 Laundry

| Giai đoạn | Kỹ năng được dùng lại |
|---|---|
| Vertical core: login, catalogue, customer, create/view order | Requirement analysis, state/decision test, Git theo vertical slice, HTTP form/session/CSRF, SQL đọc snapshot |
| Operations và money: transitions, issue, collection/refund, pickup | Boundary/negative/concurrency testing, ledger oracle, failure diagnosis, regression selection |
| Management và submission: reports, settings, release | SQL aggregation/time boundary, CI evidence, Docker local dependency, English technical walkthrough |

Mọi bài Laundry phải giữ canonical baseline: UI server-rendered bằng Spring MVC/Thymeleaf, session/CSRF, PostgreSQL/Flyway, năm order status, hai issue status, chín bảng và các BR/UC đã phê duyệt. Không thêm REST API, customer account, React/JWT, payment provider, delivery hay feature ngoài scope chỉ để luyện công nghệ.

## 3. Learning loop chung

Mỗi module dùng một vòng học cố định:

1. **Mental model:** hiểu hệ thống đang làm gì và đâu là nguồn sự thật.
2. **Worked example:** đọc một ví dụ hoàn chỉnh đã được giải thích.
3. **Prediction:** dự đoán trước khi chạy hoặc xem kết quả.
4. **Completion:** hoàn thiện một bài có khung.
5. **Independent:** tự làm một biến thể không có khung.
6. **Failure injection:** chủ động làm hỏng, thu evidence và chẩn đoán.
7. **Transfer:** áp dụng vào tình huống giống công ty và canonical Laundry.
8. **Gate:** chứng minh hiểu bằng output và lời giải thích, không chỉ bằng dấu xanh.

Mỗi artifact phải dùng dữ liệu giả hoặc dữ liệu được phép. Không đưa URL nội bộ, token, cookie, thông tin khách hàng, source code độc quyền hay ảnh màn hình nhạy cảm vào tài liệu học/public repository.

## 4. Bản đồ artifact executable - authority cho J01-J07

Path tính từ <code>lab-kit/</code>:

| Module | Starter/evidence thật | Command hoặc gate |
|---|---|---|
| J01 | <code>labs/j01/UC20_TEST_DESIGN.md</code>, <code>UC25_TRACKING_PACK.md</code>, mutation toy cùng folder | <code>npm run lab:j01</code> |
| J02 | <code>labs/j02/HTTP_TRACE_MATRIX.md</code> và <code>tests/work/p08_api.spec.ts</code> | <code>npm run lab:p08</code> |
| J03 | <code>labs/sql/work/queries.sql</code>; schema/seed và H5 reference nằm trong <code>labs/sql/</code> | Chạy đúng lệnh trong <code>labs/sql/README.md</code> trên PostgreSQL disposable từ J06 Compose |
| J04 | <code>labs/git-toy/</code> | <code>npm run lab:j04</code> tạo repo mới trong OS temp |
| J05 | <code>labs/ci/broken/playwright.yml</code>, <code>labs/ci/fixed/playwright.yml</code>, <code>tests/work/p10_ci.spec.ts</code> | <code>npm run lab:p10</code>; active baseline ở <code>.github/workflows/playwright.yml</code> |
| J06 | <code>labs/docker/compose.yaml</code> và <code>README.md</code> | <code>npm run lab:j06:check</code> trước khi chạy Docker |
| J07 | <code>labs/j07/FAILURE_REPORT.md</code>, <code>REQUIREMENT_QUESTION.md</code> | review evidence + oral gate |

---

# J01 - QA fundamentals: từ requirement đến test có lý do

**Mục tiêu:** Không bắt đầu bằng việc “automate tất cả”. Người học xác định được rủi ro, oracle, loại test, dữ liệu và mức coverage trước khi chọn UI/API/DB.

## Mental model

Testing không phải chứng minh phần mềm không còn bug. Testing là thu thập thông tin để giảm bất định về một rủi ro có ý nghĩa.

Một test tốt trả lời được năm câu:

```text
Ta đang lo điều gì?
→ kích hoạt hành vi bằng input/action nào?
→ quan sát ở đâu?
→ dựa vào oracle nào để kết luận?
→ nếu fail thì tác động là gì?
```

Phân biệt các khái niệm nền:

- **Test basis:** requirement, rule, acceptance criterion, bug history hoặc code contract mà test dựa vào.
- **Risk:** xác suất lỗi × tác động nếu lỗi xảy ra.
- **Oracle:** nguồn cho biết kết quả đúng là gì: business rule, response contract, DB invariant, calculation độc lập hoặc quan sát người dùng.
- **Test level:** unit/service, integration/repository, web/controller, API, E2E.
- **Test type:** functional, regression, usability, security-oriented, performance-oriented… Không đồng nhất test type với tool.
- **Positive path:** dữ liệu hợp lệ đi đến kết quả hợp lệ.
- **Negative path:** dữ liệu/quyền/state không hợp lệ bị chặn đúng cách và không để lại partial write.
- **Regression:** bằng chứng rằng thay đổi mới không làm hỏng hành vi đã có.

Một số cặp khái niệm dễ bị trộn ở mức fresher:

- **Verification:** artifact có đúng với specification đã chấp nhận không? **Validation:** sản phẩm có giải quyết đúng nhu cầu/ngữ cảnh sử dụng không?
- **Severity:** tác động kỹ thuật/business của defect. **Priority:** thứ tự/thời điểm team chọn sửa. QA cung cấp evidence về impact; product/team quyết định priority theo bối cảnh.
- **Smoke:** tập nhỏ chứng minh build/môi trường và critical path đủ khỏe để test tiếp. **Regression:** tập kiểm tra hành vi cũ sau thay đổi. **Retest/confirmation:** chạy lại đúng defect đã sửa.
- **Test scenario:** mục tiêu kiểm tra ở mức cao. **Test case:** precondition, data, actions và expected result cụ thể. **Exploratory charter:** mission/timebox/risk để vừa học vừa thiết kế vừa thực thi.

Một mini test plan đủ dùng phải nói được: scope/out-of-scope, risks, test levels/types, environment/data, responsibilities, entry/exit criteria, evidence/reporting và known constraints. Trong Agile, QA tham gia từ lúc refinement để làm rõ rule/testability; không chờ code xong mới bắt đầu “phase testing”.

Automation phù hợp khi oracle rõ, hành vi lặp lại, setup kiểm soát được và giá trị hồi quy cao. Exploratory testing phù hợp khi cần học sản phẩm, tìm rủi ro mới hoặc oracle chưa rõ.

### Bộ kỹ thuật test design tối thiểu

- **Equivalence partitioning:** chia dữ liệu thành các nhóm được hệ thống xử lý giống nhau.
- **Boundary value analysis:** kiểm tra ngay dưới, đúng tại và ngay trên biên.
- **Decision table:** phối hợp nhiều điều kiện độc lập.
- **State transition:** kiểm tra trạng thái, hành động hợp lệ/không hợp lệ và trạng thái sau hành động.
- **Error guessing:** dùng lịch sử lỗi và hiểu biết hệ thống để đặt biến thể nguy hiểm.

## Worked example - quyết định hoàn tất trả đồ

Canonical Laundry quy định pickup chỉ thành công khi:

- Order đang ở `READY_FOR_PICKUP`.
- `remainingAmount = 0`.
- Không có issue `OPEN`.

Thay vì viết ngay một Playwright test “click nút Hoàn tất”, ta tạo decision table:

| Case | Ready? | Remaining = 0? | Có issue mở? | Kết quả business |
|---|---:|---:|---:|---|
| P1 | Có | Có | Không | Pickup thành công; order chuyển `COMPLETED`; history được ghi |
| N1 | Không | Có | Không | Bị từ chối vì sai trạng thái; không có history mới |
| N2 | Có | Không | Không | Bị từ chối vì còn tiền; không có history mới |
| N3 | Có | Có | Có | Bị từ chối vì issue mở; không có history mới |
| N4 | Có | Không | Có | Bị từ chối; không partial write |

`N4` có thể không cần một E2E riêng nếu service-level decision-table test đã chứng minh tổ hợp đó và các E2E trọng yếu đã đủ. Coverage là quyết định theo rủi ro, không phải đếm số test tối đa.

Một test case có thể viết như sau:

```text
ID: PICKUP-N2
Basis: UC-24, BR-30, BR-31
Risk: Order bị hoàn tất dù khách còn nợ
Precondition: READY_FOR_PICKUP; total 150.000 ₫; net paid 100.000 ₫; no OPEN issue
Action: Staff gửi lệnh hoàn tất pickup
Expected UI/HTTP: lệnh bị từ chối bằng thông báo business phù hợp
Expected persistence: status vẫn READY_FOR_PICKUP; không có COMPLETED history; completed_at vẫn null
Evidence: screenshot/trace + service/repository assertion tương ứng
```

Điểm quan trọng: thông báo UI chỉ là một observation. Oracle mạnh hơn còn gồm trạng thái và việc **không có partial write**.

## Prediction - trả lời trước khi xem hệ thống

Không chạy ứng dụng. Với từng tình huống sau, ghi: rủi ro, kỹ thuật test design, test level rẻ nhất có thể bắt lỗi và một E2E có thật sự cần hay không.

1. Collection bằng `0`, `1`, đúng remaining và remaining + `1`.
2. Chuyển `PROCESSING → READY_FOR_PICKUP` khi có issue mở.
3. Hai người cùng gửi toàn bộ remaining balance gần như đồng thời.
4. Wrong order code và wrong phone trên public tracking.
5. Giá catalogue thay đổi sau khi order đã được tạo.

Không mở hint trước khi hoàn thành bảng dự đoán.

## Completion - hoàn thiện test design có khung

Điền trực tiếp <code>labs/j01/UC20_TEST_DESIGN.md</code>. Baseline mutation chạy bằng
<code>npm run lab:j01</code>; chỉ mutate sau khi đã ghi test nào dự đoán sẽ đỏ.

Điền bảng cho UC-20 Record customer payment:

| ID | Status | Amount partition/boundary | Net paid trước | Expected result | Persistence oracle |
|---|---|---|---:|---|---|
| C1 | RECEIVED | hợp lệ | 0 | … | … |
| C2 | … | 0 | … | … | … |
| C3 | READY_FOR_PICKUP | đúng remaining | … | … | … |
| C4 | … | remaining + 1 | … | … | … |
| C5 | COMPLETED | hợp lệ về số | … | … | … |

Sau đó đánh dấu test nào nên ở service level, web/controller level, repository level và E2E. Không được chọn E2E cho tất cả.

## Independent - tự thiết kế

Dùng <code>labs/j01/UC25_TRACKING_PACK.md</code>; không tạo một checklist rời không trace được về UC/BR.

Tự tạo một test pack cho public tracking theo UC-25/BR-07/BR-09:

- Một risk map tối thiểu năm rủi ro.
- Equivalence partitions cho code và phone.
- Tối thiểu sáu test case, trong đó có privacy/no-leak.
- Chỉ rõ test nào có thể data-driven.
- Viết một exploratory charter 20 phút, không trùng hoàn toàn với scripted cases.

## Failure injection - làm hỏng để học chẩn đoán

Trong lab/toy implementation, thay điều kiện collection từ `amount > 0` thành `amount >= 0`, hoặc bỏ guard “open issue blocks ready”. Không sửa ngay.

Thực hiện:

1. Dự đoán test nào phải đỏ trước khi chạy.
2. Chạy lớp test nhỏ nhất liên quan.
3. Thu expected/actual và vị trí oracle bị vi phạm.
4. Chạy một test xa hơn để xem lỗi có bị bắt muộn ở UI hay không.
5. Khôi phục code và chứng minh suite xanh.

Nếu mutation không bị test nào bắt, đó là coverage gap. Bổ sung test ở level rẻ nhất phù hợp.

## Transfer công ty

Với một user story được phép sử dụng:

1. Viết lại acceptance criteria thành các rule quan sát được.
2. Liệt kê ba rủi ro cao nhất trước khi mở tool automation.
3. Chọn test level cho từng rủi ro.
4. Tách smoke, critical regression và exploratory scope.
5. Khi có bug, ghi evidence để developer tái hiện được, không chỉ gửi ảnh “bị lỗi”.

Không sao chép requirement/data nội bộ sang learning repository. Dùng bản mô phỏng đã khử nhạy cảm.

## Transfer Laundry

Chọn một vertical slice và trace đầy đủ:

```text
UC/BR
→ screen/route/form
→ Controller
→ service transaction/guard
→ repository/table
→ test level
→ observable result
```

Ứng viên tốt cho module này: UC-16/17 lifecycle, UC-20 collection, UC-24 pickup hoặc UC-25 tracking. Không gọi một UC là done chỉ vì trang render hoặc happy path chạy được.

## Gate J01

| Bằng chứng | Điều kiện pass |
|---|---|
| Risk map + test design | Mỗi test truy ngược được về risk/rule; có positive, negative và boundary/state coverage |
| Test-level selection | Giải thích được vì sao không đẩy mọi thứ lên E2E |
| Bug report mô phỏng | Có build/environment, precondition, steps, expected, actual, evidence và impact |
| Oral check 5 phút | Phân biệt risk, oracle, test case, exploratory charter, regression và automation |
| Mutation proof | Dự đoán đúng test đỏ hoặc nhận diện được coverage gap, rồi đưa suite về xanh |

**Chưa pass nếu:** chỉ liệt kê thao tác UI; expected ghi chung chung “hoạt động đúng”; không kiểm tra no-partial-write; hoặc không giải thích được test đang bảo vệ rule nào.

---

# J02 - HTTP và API testing: nhìn xuyên qua UI

**Mục tiêu:** Đọc được request/response, phân biệt transport result với business result, test API có contract và dùng HTTP evidence để debug Playwright/Spring flows.

## Mental model

Browser không “gọi button”. Browser tạo HTTP traffic.

```text
Client
→ method + URL/path/query + headers + cookies + body
→ server/router/security/controller/service
→ status + headers + body
→ client render/redirect/state update
```

Một HTTP exchange cần đọc theo sáu phần:

1. **Method:** GET đọc; POST tạo/gửi command; PUT/PATCH cập nhật theo contract; DELETE yêu cầu semantics rõ.
2. **Address:** scheme, host, port, path, query string.
3. **Headers:** content type, accept, authorization, cookie, correlation ID, caching.
4. **Body:** JSON, form-urlencoded, multipart hoặc không có body.
5. **Status:** 2xx, 3xx, 4xx, 5xx; status chỉ nói một phần sự thật.
6. **Side effect:** dữ liệu/state có thực sự thay đổi đúng, thay đổi đúng một lần và không lộ thông tin hay không.

### Session, cookie và CSRF

- Session authentication thường dùng cookie để nối request hiện tại với server-side session.
- Cookie không đồng nghĩa với quyền hợp lệ; server vẫn phải kiểm tra role/state.
- CSRF token chứng minh protected form request xuất phát từ session/page hợp lệ. Thiếu hoặc sai token phải bị chặn trước business command.
- Redirect `302` sau POST là mẫu Post/Redirect/Get. Nó ngăn browser refresh lặp form ở mức UX, nhưng không thay thế server-side revalidation/concurrency guard.

### API test không chỉ là status code

Một API test có giá trị kiểm tra các lớp phù hợp:

```text
transport status
+ response headers/content type
+ body shape/types
+ business values/invariants
+ authorization/privacy
+ persisted side effect hoặc downstream observation
+ retry/duplicate behavior nếu có risk
```

## Worked example A - API lab bằng Playwright request

Ví dụ dưới dùng **practice API của course lab**, không phải endpoint của Laundry. `LAB_API_BASE_URL` trỏ đến môi trường disposable.

```ts
import { test, expect } from '@playwright/test';

test('create task then read it back', async ({ request }) => {
  const title = `qa-lab-${Date.now()}`;

  const createResponse = await request.post(
    `${process.env.LAB_API_BASE_URL}/tasks`,
    { data: { title, priority: 'HIGH' } },
  );

  expect(createResponse.status()).toBe(201);
  expect(createResponse.headers()['content-type']).toContain('application/json');

  const created: unknown = await createResponse.json();
  expect(created).toMatchObject({ title, priority: 'HIGH', status: 'OPEN' });

  const taskId = (created as { id: string }).id;
  expect(taskId).toBeTruthy();

  const readResponse = await request.get(
    `${process.env.LAB_API_BASE_URL}/tasks/${taskId}`,
  );

  expect(readResponse.status()).toBe(200);
  await expect(readResponse).toBeOK();
  expect(await readResponse.json()).toMatchObject({ id: taskId, title });
});
```

Ví dụ cố ý quan sát lại bằng GET thay vì tin rằng `201` tự động chứng minh dữ liệu đã lưu đúng. Ở dự án thật, cần parse `unknown` bằng schema/type guard thay vì cast mù; phần TypeScript foundation sẽ dạy kỹ bước này.

## Worked example B - đọc một Laundry form flow

UC-20 không phải REST API. Đây là server-rendered form command:

```text
POST /payments/collect?orderCode=LD-...
Cookie: authenticated session
Content-Type: application/x-www-form-urlencoded
Body: amount=50000&method=CASH&_csrf=...

Success:
302 Location: /orders/detail?code=LD-...
→ browser GET trang detail
→ flash message xuất hiện một lần
→ ledger có đúng một COLLECTION mới
```

Ba lớp failure có thể trông giống nhau trên UI nhưng evidence khác nhau:

- Thiếu CSRF: security trả `403`; command service không chạy.
- Amount vượt remaining: request qua security nhưng business rule từ chối; không có transaction mới.
- SQL/server exception bất ngờ: generic `500` có correlation code; không lộ stack trace.

Không thêm `/api/payments` vào Laundry chỉ để luyện API. Dùng request/response của chính server-rendered flow để hiểu HTTP; dùng practice API riêng cho JSON/API exercises.

## Prediction

Ghi status/redirect/side effect dự kiến trước khi gửi request:

1. Guest `GET /services`.
2. Guest `GET /orders/detail?code=...`.
3. Authenticated Staff POST collection thiếu CSRF.
4. Authenticated Staff POST collection hợp lệ.
5. Authenticated Staff POST refund.
6. Manager POST refund với cumulative refund lớn hơn collection.

Với từng dòng, tách **HTTP expectation** và **business/persistence expectation**. Không suy luận rằng mọi business conflict bắt buộc phải cùng status nếu contract chưa quy định.

## Completion

Điền <code>labs/j02/HTTP_TRACE_MATRIX.md</code>, rồi hiện thực hai test còn thiếu trong
<code>tests/work/p08_api.spec.ts</code>.

Đây là gate hai chặng: matrix HTTP có thể làm ngay sau J01/HTTP foundation; phần executable P08 chỉ
mở sau TS04 và P01-P07. Nếu chưa tới P08, giữ test file <code>fixme</code>, ghi restart line và không
nhảy prerequisite để “hoàn thành J02” trên lịch.

Mở một trace/network log của practice app và hoàn thiện bảng:

| Field | Request create | Response create | Request read | Response read |
|---|---|---|---|---|
| Method/path | … | - | … | - |
| Auth/session | … | - | … | - |
| Content-Type | … | … | … | … |
| Status | - | … | - | … |
| Business invariant | - | … | - | … |
| Correlation/ID | … | … | … | … |

Sau đó bổ sung hai tests:

- Invalid body trả lỗi contract và không tạo record.
- Request không có quyền không đọc/ghi được resource.

Sau attempt thật, enable các P08 tests liên quan và chạy <code>npm run lab:p08</code>. Command còn
bị block vì <code>test.fixme</code> hoặc chỉ report skipped thì J02 chưa completion.

## Independent

Tự thiết kế một suite 6-8 tests cho một practice API resource:

- Create hợp lệ.
- Validation boundary.
- Read existing và missing.
- Update/state transition nếu contract có.
- Authorization/ownership.
- Duplicate/retry hoặc concurrency risk nếu có ý nghĩa.
- Cleanup theo API hoặc fixture disposable; không phụ thuộc test order.

Mỗi test phải ghi test basis và oracle. Không dùng public production API để tạo rác.

## Failure injection

Lần lượt tạo ba lỗi trong lab:

1. Bỏ `await` trước khi đọc body hoặc trước một API action.
2. Chỉ assert status `200/201`, trong khi server cố ý trả body sai.
3. Dùng một title/ID cố định để hai test workers đụng dữ liệu.

Với mỗi lỗi:

- Dự đoán symptom.
- Chạy lặp hoặc parallel để tái hiện.
- Phân loại failure: test bug, product bug, environment hay data collision.
- Sửa nguyên nhân, không thêm sleep/retry mù.

## Transfer công ty

Với một flow được phép kiểm thử:

1. Dùng browser network để map UI action → HTTP exchange.
2. Xác định contract owner và auth mechanism trước khi automate.
3. Chọn API test cho logic/contract và UI test cho user journey/rendering.
4. Khi UI test fail, lưu status, request ID/correlation ID, response excerpt đã khử nhạy cảm và trace.
5. Không log token, full cookie, password hoặc PII.

## Transfer Laundry

Lập HTTP contract map cho một flow, ví dụ UC-25 hoặc UC-20:

| Step | Route | Public/protected | Binding | Expected navigation | Rule |
|---|---|---|---|---|---|
| Open tracking | `GET /track` | Public | - | Render form | UC-25 |
| Submit tracking | `POST /track` | Public + CSRF theo form contract | `PublicTrackingForm` | Limited result hoặc generic mismatch | BR-07/09 |
| Collect | `POST /payments/collect?orderCode=...` | Staff/Manager | `CollectionForm` | PRG về detail | BR-24-30 |

Chứng minh một request bị security chặn, một request bị business rule chặn và một request thành công. Với success, xác minh flash chỉ xuất hiện một request sau redirect.

## Gate J02

| Bằng chứng | Điều kiện pass |
|---|---|
| HTTP contract map | Đủ method/path/query/header/body/status/side effect; không trộn REST giả vào Laundry |
| API lab suite | Isolated, không phụ thuộc thứ tự, assert cả contract và business value |
| Failure triage | Phân biệt được product/test/environment/data failure bằng evidence |
| Session/CSRF oral check | Giải thích được cookie, session, CSRF, 302 PRG và vì sao 302 chưa đủ chứng minh success |
| Laundry transfer | Trace đúng route → security/binding → command → redirect/observation |

**Chưa pass nếu:** chỉ test status code; hard-code shared data; log secret; dùng sleep để chữa race; hoặc thêm API ngoài canonical scope.

---

# J03 - SQL as oracle: kiểm tra dữ liệu mà không đoán

**Mục tiêu:** Đọc dữ liệu quan hệ bằng truy vấn an toàn, dùng SQL để xác minh invariant/diagnose nhưng không biến mọi E2E thành test phụ thuộc implementation.

## Mental model

Database là một nguồn evidence, không mặc định là oracle duy nhất.

```text
Business rule
→ expected relational state/invariant
→ read-only query
→ compare with UI/API observation
```

Các nền tảng bắt buộc:

- Table, row, column, primary key và foreign key.
- `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`.
- `INNER JOIN` và `LEFT JOIN`.
- `GROUP BY`, `COUNT`, `SUM`, `CASE`.
- `NULL` và ba-valued logic; dùng `IS NULL`, không dùng `= NULL`.
- Cardinality: one-to-one, one-to-many, many-to-many; một join có thể nhân số dòng.
- Transaction visibility: query phải chạy đúng database/environment và đúng thời điểm sau commit.
- Constraint/migration: schema thật đến từ Flyway; entity đổi mà migration không đổi chưa phải schema change.

SQL oracle hữu ích khi cần xác minh ledger, history, snapshot, report aggregation hoặc điều tra failure. Không cần query DB trực tiếp để assert mọi label UI; điều đó tạo coupling và có thể bỏ qua contract từ góc nhìn người dùng.

## Worked example - tính balance từ immutable ledger

Canonical Laundry không lưu `paid_amount` hay `remaining_amount` trên order. Balance được suy ra từ `payment_transaction`.

```sql
SELECT
    o.order_code,
    o.total_amount,
    COALESCE(SUM(CASE
        WHEN p.transaction_type = 'COLLECTION' THEN p.amount
        ELSE 0
    END), 0) AS collected_amount,
    COALESCE(SUM(CASE
        WHEN p.transaction_type = 'REFUND' THEN p.amount
        ELSE 0
    END), 0) AS refunded_amount,
    COALESCE(SUM(CASE
        WHEN p.transaction_type = 'COLLECTION' THEN p.amount
        WHEN p.transaction_type = 'REFUND' THEN -p.amount
        ELSE 0
    END), 0) AS net_paid_amount,
    GREATEST(
        o.total_amount - COALESCE(SUM(CASE
            WHEN p.transaction_type = 'COLLECTION' THEN p.amount
            WHEN p.transaction_type = 'REFUND' THEN -p.amount
            ELSE 0
        END), 0),
        0
    ) AS remaining_amount
FROM laundry_order o
LEFT JOIN payment_transaction p ON p.order_id = o.order_id
WHERE o.order_code = :order_code
GROUP BY o.order_id, o.order_code, o.total_amount;
```

Tại sao dùng `LEFT JOIN`? Order chưa có payment vẫn phải xuất hiện với các tổng bằng `0`. Nếu dùng `INNER JOIN`, order chưa thanh toán biến mất và test có thể hiểu nhầm “không có order”.

Ví dụ tính tay độc lập với seed của lab: total `150000`, collections `50000 + 100000`, refund `20000`:

```text
collected = 150000
refunded  = 20000
net paid  = 130000
remaining = 20000
```

Tên cột trong query phải được đối chiếu với Flyway migration thật trước khi chạy; không sửa schema chỉ để khớp ví dụ học.

## Worked example - immutable state history

```sql
SELECT
    o.order_code,
    h.from_status,
    h.to_status,
    h.changed_at,
    h.history_id
FROM laundry_order o
JOIN order_status_history h ON h.order_id = o.order_id
WHERE o.order_code = :order_code
ORDER BY h.changed_at ASC, h.history_id ASC;
```

Oracle của một transition thành công không chỉ là current status. History phải chứa đúng transition. Oracle của lệnh thất bại là **không có history mới**.

## Prediction

Không chạy query. Dự đoán row count và aggregate:

1. Một order không có payment với `INNER JOIN`.
2. Cùng order đó với `LEFT JOIN`.
3. Một order có hai items và ba payments nếu join cả items lẫn payments trước khi `SUM(p.amount)`.
4. `WHERE h.from_status = NULL` so với `WHERE h.from_status IS NULL`.
5. `COUNT(*)` trên `LEFT JOIN` so với `COUNT(p.transaction_id)`.

Viết lý do bằng cardinality, không chỉ ghi con số.

## Completion

Schema/seed disposable ở <code>labs/sql/schema.sql</code> và <code>seed.sql</code>. Chỉ sửa
<code>labs/sql/work/queries.sql</code>; H5 là <code>labs/sql/reference/queries.sql</code>.

Từ <code>lab-kit/labs/sql/</code>, khởi động và chứng minh database ready:

```sh
docker compose -f ../docker/compose.yaml up -d --wait
docker compose -f ../docker/compose.yaml exec postgres pg_isready -U lab_user -d laundry_lab
```

Sau khi đã ghi prediction, chạy work file ngay trong container; máy host không cần cài `psql`:

```sh
docker compose -f ../docker/compose.yaml exec -T postgres \
  psql -U lab_user -d laundry_lab \
  -v order_code=LD-001 \
  < work/queries.sql
```

`-v order_code=LD-001` cấp giá trị cho cú pháp psql `:'order_code'`. Nếu shell báo không tìm
thấy `work/queries.sql`, bạn đang đứng sai folder; nếu `pg_isready` chưa báo accepting
connections, chưa được kết luận query sai. Oracle cụ thể và lệnh reset an toàn nằm trong
<code>labs/sql/README.md</code>.

Hoàn thiện ba query từ skeleton:

1. Liệt kê payment history của một order theo `recorded_at DESC, transaction_code DESC`.
2. Tìm các order đang active và quá promised time tại một `now` được cung cấp.
3. Chứng minh một failed pickup không đổi status và không thêm history.

Mỗi query kèm:

- Mục đích/oracle.
- Expected cardinality.
- Vì sao chọn join type.
- Một case `NULL` hoặc no-child-row.
- Cách tránh chạy nhầm database.

## Independent

Tự xây query kiểm tra revenue theo BR-32 cho một half-open time range:

```text
[fromStart, dayAfterToStart)
grossCollected = sum(COLLECTION)
refunded = sum(REFUND)
netRevenue = grossCollected - refunded
```

Yêu cầu:

- Filter bằng `payment_transaction.recorded_at`, không bằng ngày tạo order/current status.
- Có case transaction đúng tại lower bound, ngay trước upper bound và đúng tại upper bound.
- Giải thích timezone `Asia/Ho_Chi_Minh` và instant range.
- So sánh kết quả query với report UI nhưng không hard-code theo machine timezone.

## Failure injection

Tạo một query sai bằng cách join:

```text
laundry_order
→ laundry_order_item (2 rows)
→ payment_transaction (3 rows)
```

Rồi `SUM(payment_transaction.amount)` trực tiếp. Quan sát payment rows bị nhân lên thành sáu combinations.

Nhiệm vụ:

1. Vẽ bảng trung gian sáu dòng.
2. Giải thích vì sao `DISTINCT amount` không phải bản sửa tổng quát.
3. Sửa bằng pre-aggregation/subquery hoặc tách query đúng mục đích.
4. Tạo data có hai payment cùng amount để chứng minh `SUM(DISTINCT amount)` sai.

## Transfer công ty

- Chỉ dùng account/database được cấp quyền; ưu tiên read-only.
- Xác nhận environment/database/schema trước khi query.
- Không chạy UPDATE/DELETE để “làm cho test pass”.
- Nếu automated test dùng DB oracle, giải thích vì sao observation công khai chưa đủ và giới hạn coupling.
- Khi báo bug, cung cấp business key/correlation ID và query result tối thiểu đã khử PII; không dump cả bảng.

## Transfer Laundry

Thực hành trên disposable local/test PostgreSQL được tạo bằng Flyway:

- UC-09: snapshot service/price/quantity/line amount và initial history.
- UC-20/23: immutable collection/refund và derived balance.
- UC-24: pickup success/failed no-partial-write.
- UC-27: transaction-date revenue.
- UC-28: cohort/order performance và service demand không trộn KG/ITEM.

Không dùng H2 để chứng minh PostgreSQL-specific query/time/locking semantics. Không thêm cột tổng tiền đã trả/còn lại vì điều đó vi phạm ledger source of truth.

## Gate J03

| Bằng chứng | Điều kiện pass |
|---|---|
| Năm query read-only | Kết quả đúng với zero/one/many child rows; có stable ordering khi cần |
| Cardinality explanation | Vẽ/giải thích được row multiplication và sửa đúng, không dùng `DISTINCT` như bùa |
| Ledger oracle | Tính đúng collected/refunded/net/remaining từ immutable rows |
| Time-boundary oracle | Dùng half-open instant range và shop timezone đúng |
| Safety check | Chứng minh đang ở disposable/read-only database; không dùng data thật nhạy cảm |

**Chưa pass nếu:** chỉ copy query mà không dự đoán cardinality; sửa data bằng tay; aggregate sau một join nhân dòng; hoặc coi UI và DB trùng nhau là đủ mà không truy về rule.

---

# J04 - Git workflow: thay đổi có thể hiểu, review và phục hồi

**Mục tiêu:** Làm việc bằng branch/commit có chủ đích, đọc được trạng thái repository, xử lý conflict an toàn và bàn giao một vertical change có traceability.

## Mental model

Git lưu một graph các snapshot, không phải “Google Drive cho code”. Tại mọi thời điểm cần phân biệt:

```text
working tree  - file đang sửa
staging area  - nội dung dự kiến vào commit kế tiếp
local commit  - snapshot đã ghi vào graph local
remote branch - graph được chia sẻ
```

Ba câu hỏi chẩn đoán trước mọi thao tác:

1. Tôi đang ở branch nào?
2. Working tree/staging area có gì?
3. Commit/remote nào là base của thay đổi này?

Commit tốt có một mục đích, đủ nhỏ để review/revert và vẫn giữ repository ở trạng thái hợp lý. “Update code”, “fix stuff” hoặc một commit trộn feature, format, generated binary và tài liệu không liên quan làm mất khả năng hiểu lịch sử.

## Worked example - một vertical test change

```bash
git switch -c test/uc25-public-tracking
git status --short

# Sửa test và fixture liên quan.
git diff

git add tests/public-tracking.spec.ts tests/fixtures/tracking.ts
git diff --staged
git commit -m "test: cover public tracking mismatch privacy"

# Nếu thay đổi canonical docs là thật sự cần thiết và đã được duyệt,
# cập nhật trong commit riêng có mục đích rõ.
git status
git log --oneline --decorate -5
```

`git diff` đọc phần chưa stage; `git diff --staged` đọc đúng nội dung sắp commit. Không commit `.env`, auth state, trace chứa secret, database dump hay credentials.

Trước khi tích hợp thay đổi từ team:

```bash
git fetch origin
git status
git log --oneline --graph --decorate --all -12
```

Chỉ merge/rebase sau khi hiểu branch state và theo workflow của team. Không dùng destructive reset để che một working tree chưa hiểu.

## Prediction

Với mỗi trạng thái, dự đoán output của `git status --short`, `git diff` và `git diff --staged`:

1. File mới chưa tracked.
2. File đã sửa nhưng chưa stage.
3. File đã stage rồi sửa thêm lần nữa.
4. File secret vô tình đã stage.
5. Local branch có hai commit chưa có trên remote.

Sau đó tạo tình huống trong toy repository và kiểm tra dự đoán.

## Completion

Chạy <code>npm run lab:j04</code> để tạo toy repository mới trong OS temp. Command in exact path;
mọi branch/conflict/unstage của J04 phải diễn ra trong repo đó, không phải curriculum repo.

Trong toy repository:

1. Tạo branch từ base sạch.
2. Thực hiện một test change gồm fixture và assertion.
3. Stage chọn lọc, để một file note ngoài commit.
4. Viết commit message có scope và intent.
5. Tạo commit thứ hai sửa documentation liên quan.
6. Dùng log graph giải thích quan hệ hai commit với base.

Không dùng `git add .` cho bài này; mục tiêu là luyện chọn scope có ý thức.

## Independent

Tự tạo conflict có kiểm soát trong toy repository:

- Hai branch sửa cùng một đoạn requirement-to-test mapping.
- Merge theo workflow đã chọn.
- Đọc conflict markers, quyết định nội dung dựa trên requirement, không chọn “ours/theirs” mù.
- Chạy test sau resolution.
- Commit resolution và giải thích vì sao bản cuối đúng.

## Failure injection

Thực hiện ba sự cố an toàn trong toy repository:

1. Stage nhầm file `.env.example.local` chứa fake secret.
2. Commit thiếu fixture làm test fail trên clean checkout.
3. Reformat toàn file chung với một logic change nhỏ làm diff nhiễu.

Nhiệm vụ:

- Phát hiện bằng `status`, staged diff và clean-checkout test.
- Gỡ file khỏi staging mà không xóa working copy.
- Tách hoặc làm lại commit trong toy repo.
- Ghi prevention rule cho dự án thật.

## Transfer công ty

- Theo branch/PR convention của team; không tự áp workflow khác.
- Một change phải có requirement/ticket context, tests và evidence đủ review.
- Trước khi yêu cầu review, đọc lại full diff và chạy focused checks.
- Conflict được giải theo product intent; nếu intent không rõ thì hỏi owner, không tự chọn cho build xanh.
- Không đưa artifact nhạy cảm vào Git history; xóa file ở commit sau không làm secret biến khỏi history.

## Transfer Laundry

Một branch nên đại diện một UC hoặc một vertical slice gắn chặt:

```text
form/view
+ Controller
+ service rule/transaction
+ repository/migration nếu có
+ automated tests
+ canonical traceability/document update khi behavior thật sự đổi
```

Không chia ownership kiểu “một người chỉ frontend, một người chỉ backend” khiến không ai trace được end-to-end. Không commit generated PDF/diagram trước khi behavior/code/schema được freeze theo delivery gate.

## Gate J04

| Bằng chứng | Điều kiện pass |
|---|---|
| Branch có 2-3 atomic commits | Mỗi commit có một intent, diff review được và repository hợp lệ |
| Status/diff oral check | Phân biệt working tree, staging, commit và remote không cần đoán |
| Conflict lab | Resolve đúng theo requirement và test xanh |
| Clean-checkout proof | Dependency install/test chạy từ trạng thái sạch, không dựa file untracked local |
| Secret hygiene | Không credential/auth state/dump/trace nhạy cảm trong history |

**Chưa pass nếu:** chỉ biết `add/commit/push`; không đọc staged diff; commit phụ thuộc file untracked; hoặc xử lý conflict bằng cách chọn một phía không hiểu nội dung.

---

# J05 - CI/CD đủ dùng: test phải sống được trên máy sạch

**Mục tiêu:** Đưa automated checks lên CI, giữ evidence khi fail và chẩn đoán được khác biệt local/runner. Không yêu cầu triển khai hệ thống hay trở thành DevOps.

## Mental model

CI là một thí nghiệm lặp lại trên môi trường sạch:

```text
trigger
→ checkout exact commit
→ provision runtime/dependencies
→ start required services
→ wait for readiness
→ run deterministic checks
→ preserve report/trace/log
→ return trustworthy status
```

CD là bước đưa artifact qua môi trường/release sau khi các gate đạt. Trong lộ trình này, chỉ cần hiểu tests có thể làm deployment gate; không tự xây deployment pipeline.

Một pipeline xanh chỉ đáng tin khi:

- Dùng lockfile và clean install.
- Không phụ thuộc file/secret chỉ có trên laptop.
- Service readiness rõ, không ngủ cố định rồi hy vọng.
- Test isolated và time/locale/config được kiểm soát.
- Failure vẫn giữ trace/report/log.
- Secrets đi qua secret store và không bị print.

## Worked example - Playwright CI tối thiểu

Ví dụ GitHub Actions; kiểm tra phiên bản action theo official docs lúc triển khai thật.

```yaml
name: playwright-check

on:
  pull_request:
  push:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 20

    steps:
      - name: Checkout exact commit
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies from lockfile
        run: npm ci

      - name: Install Chromium and OS dependencies
        run: npx playwright install --with-deps chromium

      - name: Run Chromium tests
        env:
          PLAYWRIGHT_BASE_URL: ${{ vars.PLAYWRIGHT_BASE_URL }}
        run: npx playwright test --project=chromium

      - name: Upload Playwright evidence
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: |
            playwright-report/
            test-results/
          if-no-files-found: ignore
          retention-days: 7
```

Điểm cần giải thích:

- `npm ci` tái tạo dependency từ lockfile; nếu lockfile lệch, CI phải fail thay vì tự sửa.
- Cài đúng browser project cần chạy để giữ pipeline nhỏ.
- Base URL là configuration, không hard-code environment nội bộ.
- `if: always()` giữ evidence cả khi test đỏ.
- Retry, worker count và timeout không được tăng để che flaky test.

Nếu test app được khởi động trong cùng repository, ưu tiên Playwright `webServer` hoặc readiness command có health check. Không dùng một `sleep 30` cố định làm điều kiện sẵn sàng.

## Worked example - phân lớp pipeline Laundry

Không viết một job khổng lồ ngay. Tư duy theo feedback cost:

```text
Fast checks: compile/lint/unit/service tests
→ Spring web/repository integration tests với PostgreSQL
→ browser smoke trên vertical critical path
→ report/artifact
```

Lệnh cụ thể phải lấy từ repository thật. Baseline tối thiểu cho backend là clean Maven test; browser smoke chỉ chạy sau khi Flyway dựng được disposable PostgreSQL và application readiness được chứng minh. Không commit database credential.

## Prediction

Với mỗi failure, dự đoán pipeline stage và evidence cần đọc đầu tiên:

1. `package.json` đổi nhưng lockfile không đổi.
2. Browser binary chưa được cài.
3. Base URL thiếu.
4. App process đã start nhưng DB chưa healthy.
5. Test dùng machine local timezone, runner dùng UTC.
6. UI test fail nhưng artifact upload step dùng mặc định `if: success()`.

## Completion

Artifact: <code>labs/ci/broken/playwright.yml</code>, <code>labs/ci/fixed/playwright.yml</code>
và <code>tests/work/p10_ci.spec.ts</code>. Active reference baseline không chạy work specs chưa làm.

Cho một toy Playwright project:

1. Thêm workflow CI.
2. Chạy suite xanh trên pull request/branch.
3. Cố ý làm một assertion đỏ.
4. Xác minh job đỏ nhưng report/trace vẫn được upload.
5. Đọc trace để viết expected/actual và phân loại failure.
6. Khôi phục assertion, chạy lại và đạt xanh.

Không coi bước 6 là pass nếu không giải thích được lần đỏ ở bước 4.

Sau attempt thật, enable ba contract tests và chạy <code>npm run lab:p10</code>; command còn
<code>test.fixme</code> phải fail thay vì tạo tín hiệu xanh giả.

## Independent

Tự thiết kế CI contract cho một project có app + test:

- Trigger nào cần chạy fast checks và browser smoke?
- Runtime/version nào phải pin?
- Dependency nào là service?
- Readiness được chứng minh thế nào?
- Configuration nào là variable, configuration nào là secret?
- Artifact nào cần giữ khi fail và bao lâu?
- Failure nào block integration?

Viết diagram pipeline và workflow skeleton; sau đó hiện thực một happy path nhỏ.

## Failure injection

Chọn ba lỗi, mỗi lỗi phải được tạo và phục hồi riêng:

- Test phụ thuộc thứ tự.
- Test data cố định va chạm khi chạy hai workers.
- Timezone/locale khác local.
- Missing environment variable.
- App chưa ready nhưng test đã chạy.
- Artifact không được giữ khi job fail.

Không sửa bằng cách tăng sleep/retry trước khi có evidence nguyên nhân.

## Transfer công ty

- Đọc pipeline hiện có và tuân theo owner/security policy; không tự thêm secret hay deployment.
- Khi CI đỏ, bắt đầu từ exact commit, failed step, first meaningful error và artifact.
- Reproduce bằng cùng command/config trong khả năng được phép.
- Phân biệt product failure, test failure, infrastructure failure và known external outage.
- Một rerun xanh không tự chứng minh lỗi đã biến mất; nếu rerun thay đổi outcome, điều tra flakiness.

## Transfer Laundry

CI target theo release gate:

- Maven tests từ clean checkout.
- Flyway dựng được empty PostgreSQL từ V1 trở đi.
- Hibernate validate schema; không `ddl-auto=create/update`.
- Focused repository tests dùng PostgreSQL cho query/time/locking.
- Browser smoke bao phủ public, Staff và Manager critical paths ở desktop width.
- Không raw ID, secret, persistent toast hoặc empty demo report trong evidence.

CI không thay thế traceability audit, rendered document QA hay defense rehearsal; nó chỉ là một lớp gate.

## Gate J05

| Bằng chứng | Điều kiện pass |
|---|---|
| Green clean-machine run | Checkout + clean install + test không phụ thuộc file local |
| Deliberate red run | Failure đúng dự đoán và report/trace/log vẫn còn |
| Triage note | Nêu exact commit, failed step, first error, classification và fix evidence |
| Configuration safety | Không hard-code secret; biết phân biệt variable/secret |
| Oral check | Giải thích CI vs CD, readiness vs sleep, retry vs flaky diagnosis |

**Chưa pass nếu:** pipeline chỉ xanh trên rerun; artifact mất khi fail; dùng sleep/retry để che root cause; hoặc pipeline phụ thuộc thao tác tay không được ghi lại.

---

# J06 - Docker operational literacy: vận hành dependency, không học lan sang DevOps

**Mục tiêu:** Hiểu image/container, khởi động dependency có cấu hình, kiểm tra health/log/port và xử lý các lỗi phổ biến. Chưa học Kubernetes, orchestration sâu hay tự tối ưu production image.

## Mental model

```text
Image      = mẫu filesystem + metadata bất biến
Container  = một process đang chạy từ image
Port map   = host_port → container_port
Environment = configuration truyền vào process
Volume     = dữ liệu sống ngoài writable layer của container
Network    = cách containers tìm/gọi nhau
Health     = process có thực sự sẵn sàng phục vụ hay chưa
Log        = evidence đầu tiên khi process không như mong đợi
```

“Container đang Up” không đồng nghĩa database đã ready. “Chạy được trên máy tôi” cũng không chứng minh app trong container truy cập được `localhost` của host/container khác.

## Worked example - disposable PostgreSQL cho lab

Ví dụ dùng version lab đã pin. Khi chuyển sang Laundry, dùng version/configuration được repository quyết định.

```yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: laundry_dev
      POSTGRES_USER: laundry
      POSTGRES_PASSWORD: local-only-password
    ports:
      - "5433:5432"
    volumes:
      - laundry_pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U laundry -d laundry_dev"]
      interval: 3s
      timeout: 3s
      retries: 10

volumes:
  laundry_pg_data:
```

Các lệnh quan sát:

```bash
docker compose up -d
docker compose ps
docker compose logs postgres
docker compose exec postgres pg_isready -U laundry -d laundry_dev
docker compose stop
```

Host application kết nối `localhost:5433`; process trong cùng Compose network sẽ gọi service name `postgres:5432`. Mật khẩu ví dụ chỉ dành cho disposable local lab. Project thật dùng ignored local environment/secret mechanism phù hợp.

Không xóa volume khi chưa hiểu dữ liệu nào sẽ mất. Reset disposable lab database phải là thao tác rõ target và có thể tái tạo bằng Flyway.

## Prediction

Trước khi chạy, dự đoán symptom và command kiểm tra đầu tiên:

1. Host port `5433` đã bị process khác dùng.
2. App trong container dùng `localhost:5432` để gọi Postgres container khác.
3. Password app khác password database.
4. Container `Up` nhưng healthcheck `starting/unhealthy`.
5. Stop rồi start container khi có named volume.
6. Xóa named volume của disposable DB rồi khởi động lại.

## Completion

Đọc <code>labs/docker/README.md</code>, kiểm tra topology bằng <code>npm run lab:j06:check</code>,
sau đó mới dùng <code>labs/docker/compose.yaml</code> cho PostgreSQL disposable.

1. Khởi động PostgreSQL lab.
2. Dùng `ps` và healthcheck chứng minh sẵn sàng.
3. Kết nối từ host bằng port đã map.
4. Dừng/start và dự đoán data còn hay mất.
5. Đọc log để tìm startup line và một lỗi authentication cố ý.
6. Ghi lại config contract: image version, database, user, host port, container port, volume, health command.

## Independent

Nhận một Compose file chưa từng thấy. Không chạy ngay. Vẽ:

```text
host
→ mapped ports
→ services
→ internal service-name connections
→ volumes
→ environment/secrets
→ health dependencies
```

Sau đó chạy, xác minh từng dự đoán và sửa một configuration mismatch bằng evidence.

## Failure injection

Tạo ba lỗi lần lượt:

- Đổi host port sang một port đang bị chiếm.
- Đổi password phía app nhưng không đổi DB.
- Cho test chạy trước health readiness.

Với mỗi lỗi, ghi:

1. Symptom bên ngoài.
2. `ps/health/log` evidence.
3. Root cause.
4. Minimal fix.
5. Proof sau fix.

Không “sửa” bằng cách xóa toàn bộ Docker data khi chưa biết root cause.

## Transfer công ty

- Dùng setup được team cung cấp; không đổi image/tag/port/volume chung tùy ý.
- Biết tìm app log, service log, health state và connection configuration.
- Phân biệt failure của product/test với dependency chưa ready.
- Không đưa production dump hoặc credential vào local container.
- Nếu project dùng containerized Playwright, hiểu mount/workdir/user/artifact path trước khi copy command.

## Transfer Laundry

Docker chỉ phục vụ operational setup, trước hết là PostgreSQL local/test. Spring Boot app vẫn theo fixed Maven JAR stack; không tạo một frontend/API/container architecture thứ hai.

Evidence cần có:

- Disposable DB khởi động healthy.
- Flyway chạy từ V1 và Hibernate validate thành công.
- App dùng shop timezone/config đúng, không dựa machine default.
- Reset disposable DB có quy trình rõ; không hand-edit row để demo pass.
- Browser/service/repository tests trỏ đúng environment.

## Gate J06

| Bằng chứng | Điều kiện pass |
|---|---|
| Topology sketch | Phân biệt host/container port, service name, volume và health |
| Healthy dependency proof | Tự khởi động/stop/start và kết nối được mà không đoán |
| Three-failure log | Chẩn đoán port/auth/readiness bằng evidence, không xóa mù |
| Data-safety oral check | Giải thích khi nào data tồn tại, khi nào volume reset làm mất data |
| Scope discipline | Không mở rộng sang Kubernetes/cloud/Docker production optimization |

**Chưa pass nếu:** chỉ thuộc `docker compose up`; coi `Up` là ready; nhầm `localhost`; hoặc xóa container/volume như phản xạ đầu tiên.

---

# J07 - English for QA: truyền evidence không làm người khác đoán

**Mục tiêu:** Đọc requirement/tool output, hỏi rõ ambiguity, viết bug report/test note và giải thích failure ngắn gọn bằng English kỹ thuật.

## Mental model

English trong QA không phải thi văn phạm. Nó là giao thức truyền:

```text
context
→ observation
→ expected/actual delta
→ evidence
→ impact
→ next action/question
```

Thông điệp tốt ngắn nhưng không thiếu dữ kiện. Tránh từ mơ hồ: “not working”, “sometimes”, “wrong”, “please check” nếu không có điều kiện tái hiện/evidence.

### Mẫu câu tối thiểu

- **Clarify:** “When the order is cancelled with a positive net-paid amount, should the customer view show refund due or remaining payment?”
- **Prediction:** “I expect the POST to be rejected before any payment row is inserted.”
- **Observation:** “The response is 302, but the redirected page shows no new transaction and the server log contains correlation ID …”
- **Delta:** “Expected one COLLECTION row; actual result contains two rows with the same user action.”
- **Impact:** “This may overstate paid amount and allow pickup before the real balance reaches zero.”
- **Next step:** “I can reproduce it with two concurrent submissions; shall I add the trace and timestamps to the ticket?”

## Worked example - bug report mô phỏng

Đây là lỗi được **cài trong lab**, không phải claim về implementation thật.

```text
Title
[Pickup] Order can be completed while an issue is OPEN

Environment
Local disposable environment, build 8f31c2a, Chromium, 13 Aug 2026

Preconditions
- Staff is authenticated.
- Order LD-20260813-000321 is READY_FOR_PICKUP.
- Remaining amount is 0 VND.
- The order has one OPEN issue.

Steps
1. Open the order detail page.
2. Submit “Complete pickup”.
3. Reopen the order detail and status history.

Expected
The command is rejected. The order remains READY_FOR_PICKUP and no COMPLETED history row is created.

Actual
The order changes to COMPLETED and a COMPLETED history row is created.

Evidence
- Playwright trace: <sanitized artifact name>
- Screenshot: <sanitized artifact name>
- Correlation ID: <id>

Impact
Staff can hand over an order before its operational issue is resolved.

Reproducibility
3/3 in the disposable local environment.
```

Report không suy đoán root cause nếu chưa có evidence. “Service forgot the guard” chỉ nên viết sau khi đã trace code/log hoặc xác nhận với developer.

## Prediction

Đọc report sau và liệt kê ít nhất năm câu reviewer buộc phải hỏi:

```text
Login is broken. It sometimes redirects wrong. Please check ASAP.
```

Sau đó viết lại thành report có environment, account state, exact steps, expected, actual, frequency và evidence.

## Completion

Điền <code>labs/j07/FAILURE_REPORT.md</code> bằng một failure thật từ J02/J05.
Clarification artifact của independent task là <code>labs/j07/REQUIREMENT_QUESTION.md</code>.

Điền template từ một deliberate failure đã làm ở J02/J05:

```text
Summary:
Context/environment:
Preconditions:
Steps/command:
Expected:
Actual:
First meaningful error:
Evidence/artifact:
Classification hypothesis:
Impact:
Next check:
```

Giới hạn 180 từ, nhưng không bỏ exact command/route/status cần thiết.

## Independent

Thực hiện ba artifact:

1. Một clarification question cho requirement có ambiguity.
2. Một 90-second spoken failure walkthrough: context → expected → actual → evidence → hypothesis → next check.
3. Một test review comment giải thích vì sao status-only assertion chưa đủ.

Thu âm/phát lại phần nói. Nếu chính người học nghe lại không xác định được “lỗi gì, ở đâu, bằng chứng nào”, làm lại.

## Failure injection

Lấy bug report tốt rồi lần lượt bỏ:

- Preconditions.
- Exact expected result.
- Environment/build.
- Evidence identifier.

Với mỗi phiên bản, đóng vai reviewer và ghi câu hỏi phát sinh. Mục tiêu là hiểu chi phí giao tiếp của dữ kiện bị thiếu, không phải viết report dài nhất.

## Transfer công ty

Luyện một nhịp ngắn hằng ngày:

- Đọc một requirement/test failure tiếng Anh và tóm tắt ba dòng.
- Viết một prediction trước khi test.
- Khi report failure, dùng exact noun/verb/status thay cho “it/thing/wrong”.
- Trong standup: done, evidence, blocker, next action; không kể toàn bộ timeline.
- Khi chưa hiểu domain term, hỏi định nghĩa/example thay vì giả vờ hiểu.

Không đưa nội dung công ty thật vào artifact công khai hoặc công cụ không được phép.

## Transfer Laundry

Người học phải giải thích được một vertical flow bằng English đơn giản:

```text
The browser submits …
Spring Security checks …
The controller binds …
The service enforces … inside one transaction.
The repository reads/writes …
The observable result is …
The test proves …
```

Tập trung vào UC-20/24/25 hoặc một UC mình sở hữu. Không cần accent hoàn hảo; cần thuật ngữ nhất quán, flow đúng và trả lời được một “why” cùng một failure variant.

## Gate J07

| Bằng chứng | Điều kiện pass |
|---|---|
| Bug report ≤ 220 từ | Người khác có thể tái hiện; expected/actual/evidence/impact rõ |
| Clarification question | Chỉ ra đúng ambiguity và đưa ví dụ boundary cụ thể |
| 3-minute technical walkthrough | Flow đúng, không đọc script toàn bộ, trả lời được hai follow-up |
| Failure summary | Nêu first meaningful error và hypothesis như hypothesis, không biến thành fact |
| Vocabulary consistency | Dùng đúng request/response/status/session/transaction/oracle/fixture/trace |

**Chưa pass nếu:** report chỉ có ảnh; dùng “not working”; trộn observation với phỏng đoán; hoặc không nói được expected behavior dựa trên rule nào.

---

# 4. Runway integration gate - kết thúc ba tuần

Runway gate dùng practice app/disposable environment, không cần chờ Laundry hoàn thiện.

## Nhiệm vụ tích hợp

Chọn một business flow nhỏ có UI và API lab support:

1. Phân tích requirement thành risk map và decision/state tests.
2. Tạo test data isolated.
3. Viết một API test và một Playwright UI test, tránh duplicate coverage vô lý.
4. Dùng SQL read-only để xác minh một invariant thực sự cần DB oracle.
5. Commit thành 2-3 commits review được.
6. Chạy trên CI từ clean checkout, giữ artifact.
7. Khởi động dependency bằng Docker và chứng minh health/readiness.
8. Cài một failure, triage bằng trace/log/query.
9. Viết failure summary bằng English và giải thích oral 3 phút.

## Rubric

| Dimension | Fail | Pass | Strong |
|---|---|---|---|
| Test design | Script theo thao tác, không risk/oracle | Test truy về rule, có negative/boundary | Chọn đúng level, giảm duplicate E2E |
| Automation | Phụ thuộc order/shared data | Isolated, deterministic, web-first | Failure evidence và teardown/data strategy rõ |
| HTTP/API | Chỉ status | Contract + business invariant | Nối được UI request với server-side failure layer |
| SQL | Query copy, không hiểu join | Read-only oracle đúng | Chứng minh cardinality/time boundary/no-partial-write |
| Git | Một commit lộn xộn | Atomic commits, clean diff | Conflict/recovery được giải thích |
| CI | Chỉ local xanh | Clean runner xanh, artifact khi đỏ | Phân loại failure và loại flake root cause |
| Docker | Chỉ `up` | Hiểu port/env/health/log | Chẩn đoán ba failure không reset mù |
| English | Mơ hồ | Reproducible, evidence-led | Ngắn, đúng thuật ngữ, trả lời follow-up |

Pass yêu cầu tất cả dimensions đạt mức **Pass**. Mức Strong là mục tiêu trong hai tháng SWP, không phải điều kiện để bắt đầu dự án.

---

# 5. SWP integrated technical gate - cuối hai tháng

## Nhiệm vụ

Chọn một canonical Laundry vertical slice có đủ UI, business rule và persistence, ưu tiên flow order/payment/pickup:

```text
login
→ create/select customer
→ create mixed KG + ITEM order
→ verify snapshots/rounded total
→ record collection
→ transition/process issue
→ ready/pickup guard
→ verify history/ledger/report or public tracking
```

Không nhất thiết một người implement toàn hệ thống, nhưng người học phải tự trace và test được slice mình trình bày.

## Evidence pack kỹ thuật

- UC/BR risk and coverage map.
- Focused service/controller/repository proofs theo đúng test pyramid.
- Một Playwright critical-path test với semantic locators, web-first assertions, isolation và trace-on-failure.
- HTTP contract map cho form/session/CSRF/PRG.
- SQL oracle cho snapshot/history/ledger/report phù hợp.
- Git history review được.
- CI clean run và deliberate-failure triage artifact.
- Docker dependency topology/health proof.
- English technical walkthrough và một failure variant.

## Final oral gate

Không nhìn script, trả lời:

1. Risk quan trọng nhất của slice là gì?
2. Vì sao test này ở service/API/UI/repository level?
3. Browser gửi request nào và security/binding xử lý ra sao?
4. Business invariant nằm ở đâu và transaction boundary nào bảo vệ nó?
5. SQL evidence nào chứng minh success hoặc no-partial-write?
6. Nếu test chỉ fail trên CI, đọc evidence theo thứ tự nào?
7. Một thay đổi ngẫu nhiên nào sẽ làm coverage hiện tại thiếu?

Sau oral gate, mentor đưa một **random change/no-agent drill** nhỏ. Ví dụ: đổi collection boundary, thêm một invalid state, đổi locator text nhưng giữ accessible role, hoặc làm một test data collision. Chỉ đạt mastery khi người học tự dự đoán, sửa và giải thích được; AI-generated green code không được tính là bằng chứng hiểu.

## 6. Recovery khi lệch nhịp

Nếu nghỉ học hoặc fail gate:

- Không quay lại đọc toàn bộ module.
- Mở evidence gần nhất và chọn failure nhỏ nhất chưa giải thích được.
- Làm lại theo thứ tự: prediction → focused run → evidence → explanation.
- Nếu fail cùng nguyên nhân hai lần, dùng hint bậc 1; lần ba mới dùng worked patch/hint sâu.
- Không chuyển sang công nghệ mới để né nền tảng đang yếu.

Ưu tiên phục hồi:

```text
testing/oracle
→ JS/TS/Playwright core
→ HTTP/API
→ SQL/Git
→ CI
→ Docker
```

English QA tiếp tục 10-15 phút trong mọi ngày học vì nó dùng chính failure/evidence đang có, không cần một “buổi học tiếng Anh” tách rời.
