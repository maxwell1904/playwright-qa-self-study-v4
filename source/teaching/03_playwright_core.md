# PHẦN III - Playwright từ bài test đầu đến suite có thể tin

Phần này giả định m đã pass cả JS08 và TS04: đọc được function, object, destructuring,
Promise, `await`, type annotation và import. Nếu syntax vẫn chặn việc giải thích test, quay lại
đúng foundation gate; không copy thêm Playwright code để che lỗ hổng.

Mỗi chapter có một command <code>npm run lab:pXX</code>. Starter dùng
<code>test.fixme(...)</code> để không làm full suite đỏ trước khi đến bài, nhưng focused command cố ý
thoát non-zero khi marker còn tồn tại. Sau attempt thật, đổi đúng marker của bài thành
<code>test(...)</code>; test bị skip không bao giờ được tính là completion.

Playwright không chỉ là API click browser. Năng lực thật gồm bốn lớp:

```text
testing intent
-> browser/web mental model
-> Playwright synchronization + isolation
-> evidence-driven debug
```

Mỗi test phải trả lời được: risk nào đang được kiểm soát, state đầu vào thuộc về ai, action nào thay đổi hệ thống, oracle nào chứng minh outcome và failure evidence nằm ở đâu.

# P01 - Anatomy của một test và oracle

## Problem

Test sau chạy xanh:

```ts
test('create order', async ({ page }) => {
  await page.goto('/orders/new');
  await page.getByRole('button', { name: 'Tạo đơn' }).click();
});
```

Nó chỉ chứng minh browser đã thử click. Nó chưa chứng minh một đơn hợp lệ được tạo, URL đúng, dữ liệu persist, total đúng hay user thấy outcome.

## Mental model

Test runner đăng ký một test case. Khi chạy, runner tạo fixture, gọi async callback và quyết định pass/fail từ assertion/rejection.

```text
Arrange: tạo state và dữ liệu đầu vào có chủ
Act:     một hành vi hoặc command chính
Assert:  oracle gần outcome người dùng nhất
```

Một test có thể có nhiều check liên quan, nhưng tên test chỉ nên mô tả một behavior/risk. Nếu một assertion fail mà tên test không giúp biết contract nào hỏng, scope đang quá mơ hồ.

## Worked example

```ts
import { test, expect } from '@playwright/test';

test('visitor sees one active KG service with its VND price', async ({ page }) => {
  // Arrange is server seed plus navigation.
  await page.goto('/services');

  // Find the business object, not a screen coordinate.
  const row = page
    .getByRole('row')
    .filter({ hasText: 'Giặt sấy quần áo' });

  // Oracles prove the user-facing contract.
  await expect(row).toContainText('KG');
  await expect(row).toContainText('25.000 ₫');
});
```

## Prediction

Trước khi chạy:

1. Nếu heading đổi nhưng row đúng, test có fail không?
2. Nếu service bị ẩn khỏi DOM, assertion nào báo lỗi đầu tiên?
3. Nếu giá hiển thị `25000`, risk nào bị bắt?

## Completion task

Mở `tests/work/p01_anatomy.spec.ts`, đổi hai marker của bài từ <code>test.fixme</code> thành
<code>test</code>, rồi chạy <code>npm run lab:p01</code>. Điền ba chỗ:

- navigation;
- locator cho một service row theo tên;
- assertion unit và price.

Không dùng CSS, XPath, `nth()` hoặc snapshot cả trang.

## Independent task

Viết test cho `LD-002` trên `/orders?order=desc`:

- action “Chi tiết” xuất hiện ở nhiều row;
- test phải mở đúng order;
- oracle là heading business code ở trang detail.

Chỉ nhận contract này, không nhìn reference test.

## Failure injection

Đổi expected code thành `LD-003`. Trước khi chạy, dự đoán call log và first meaningful error. Sau đó phân biệt:

- locator không tìm thấy;
- locator match sai object;
- action thành công nhưng assertion sai.

## Transfer

### Công ty

Chọn một spec được phép đọc. Ghi bốn dòng, không chép source ra ngoài:

```text
Risk/behavior:
Owned starting state:
Main action:
Observable oracle:
```

Nếu không tìm thấy oracle, đó là câu hỏi review hợp lệ.

### Laundry

Với UC-05, oracle là active service name/unit/price. Với UC-09, oracle không chỉ là redirect: detail phải hiển thị order code, snapshots, rounded line amounts và total do server tính. Không automate UC-09 trước khi vertical slice tồn tại; viết test condition trước.

## Gate P01

Từ một manual checklist, tự viết một test có tên theo behavior, arrange có data owner, một act chính và oracle user-visible. Gây một assertion fail và chỉ đúng first meaningful line.

# P02 - Locator là query recipe, không phải tọa độ

## Problem

Selector sau rất cụ thể nhưng dễ gãy:

```ts
page.locator('main > div:nth-child(3) table tr:nth-child(2) td:last-child a')
```

Nó mô tả layout hiện tại chứ không mô tả user intent. Thêm một row hoặc wrapper có thể làm test click nhầm dù feature vẫn đúng.

## Mental model

Locator giữ **công thức tìm element tại thời điểm action/assertion**, không giữ sẵn một DOM node. Playwright dùng locator làm trung tâm cho auto-wait và retry. Ưu tiên locator theo cách người dùng/assistive technology nhận biết UI:

1. role + accessible name;
2. label cho form control;
3. text khi text chính là business identity;
4. test id khi semantics không đủ và team có contract;
5. CSS nhỏ, có chủ đích cho cấu trúc kỹ thuật không biểu diễn được bằng semantics.

Official reference: [Playwright Locators](https://playwright.dev/docs/locators).

## Accessible name vừa đủ

```html
<label for="phone">Số điện thoại</label>
<input id="phone" name="phone">
<button type="submit">Lưu</button>
```

```ts
page.getByLabel('Số điện thoại');
page.getByRole('button', { name: 'Lưu' });
```

`name` của role không nhất thiết là thuộc tính HTML `name`. Nó là accessible name được tính từ text, label, `aria-label`, `aria-labelledby` và các rule accessibility.

## Strictness

Action cần một target duy nhất. Nếu `getByRole('link', { name: 'Chi tiết' })` match ba link, Playwright báo strictness thay vì tự chọn đại. Đây là feedback rằng intent chưa đủ rõ.

Scope business object trước, action sau:

```ts
const row = page.getByRole('row').filter({ hasText: 'LD-002' });
await row.getByRole('link', { name: 'Chi tiết' }).click();
```

## Worked example

| Cách | Test đang nói gì | Chịu được |
| --- | --- | --- |
| `nth(1)` | lấy item DOM thứ hai | gần như không chịu reorder/filter |
| `.first()` | lấy match đầu | che ambiguity |
| row có `LD-002` rồi link | action thuộc business order nào | reorder, thêm row, filter |
| test id `order-LD-002` | UI có contract kỹ thuật | layout đổi, nhưng ít phản hồi semantics |

## Prediction

Trước khi chạy `/orders?order=desc`, dự đoán:

- `nth(1)` sẽ chọn code nào;
- row-scope chọn code nào;
- nếu hai row cùng chứa chuỗi `LD-002`, lỗi gì nên xảy ra.

## Completion task

Làm `tests/work/p02_locators.spec.ts`; sau attempt, enable đúng hai test và chạy
<code>npm run lab:p02</code>:

1. tìm row service theo name;
2. assert unit và price trong row;
3. đảo order rows;
4. mở đúng `LD-002`.

## Independent task

Tự tạo một HTML snippet hoặc dùng app được phép có:

- hai button cùng text ở hai section;
- một field có label;
- một status message.

Viết locator chịu được việc đổi thứ tự section.

## Failure injection

Xóa `<label>` khỏi sandbox copy hoặc đổi accessible name. Không lập tức chuyển sang CSS. Ghi:

- đây là test locator sai hay UI accessibility contract yếu;
- user nào bị ảnh hưởng;
- fix UI hay fix test là quyết định đúng trong context nào.

## Transfer

Order detail có nhiều financial/operational action. Scope bằng section và business effect, không dùng button index. List/search dùng `order_code`, customer snapshot và status label; numeric DB ID không phải user-facing identity.

## Gate P02

Sửa năm brittle selectors. Mỗi selector phải kèm một câu: “UI thay đổi nào test vẫn sống?” và một case cố ý gây strictness.

# P03 - Actionability, auto-wait và web-first assertion

## Problem

Khi test flaky, phản xạ thường là:

```ts
await page.waitForTimeout(3000);
```

Nếu app nhanh, test lãng phí ba giây. Nếu app chậm hơn, test vẫn fail. Nếu locator sai hoặc overlay vĩnh viễn, sleep không chữa nguyên nhân.

## Mental model

Trước action như click, Playwright chờ các điều kiện actionability phù hợp: locator resolve đúng số target, visible, stable, receives events và enabled khi cần. Assertion async như `toBeVisible` hoặc `toHaveText` lặp lại query/check cho tới khi condition đúng hoặc timeout.

Hai loại wait trả lời hai câu khác nhau:

```text
actionability: control đã có thể thao tác chưa?
assertion retry: outcome người dùng đã đạt chưa?
```

Official references: [Auto-waiting](https://playwright.dev/docs/actionability) và [Assertions](https://playwright.dev/docs/test-assertions).

## Worked example

```ts
await page.goto('/slow-form');
await page.getByLabel('Số điện thoại').fill('0912345678');
await page.getByRole('button', { name: 'Lưu' }).click();

await expect(page).toHaveURL(/saved=1/);
await expect(page.getByRole('status')).toHaveText('Đã lưu 0912345678');
```

Overlay ban đầu chặn click. Playwright đợi button nhận event. Sau POST/redirect, assertion đợi user-visible message. Không có timeout cứng tùy tiện.

## Locator re-resolution

Ở `/rerender`, button DOM cũ bị thay bằng node mới. Locator có thể resolve lại:

```ts
const save = page.getByRole('button', { name: 'Lưu' });
await expect(save).toHaveAttribute('data-generation', '2');
await save.click();
await expect(page.getByRole('status')).toHaveText('Đã lưu bởi node mới');
```

Đừng cache element handle khi không có lý do; handle có thể detached sau re-render.

## Prediction

Với từng tình huống, chọn evidence chứ chưa chọn fix:

| Symptom | Hypothesis A | Hypothesis B | Evidence phân biệt |
| --- | --- | --- | --- |
| click timeout | overlay chặn | locator match hidden duplicate | call log + trace snapshot |
| click pass, message timeout | backend fail | UI không render outcome | Network + console + DOM |
| local xanh, CI đỏ | environment/data | race | trace, worker/retry pattern, logs |

## Completion task

Làm `tests/work/p03_sync.spec.ts`: xóa sleep, dùng actionability và một user-visible assertion.
Enable ba test sau attempt và chạy <code>npm run lab:p03</code>.

## Independent task

Tạo một route/page nhỏ có button bị disable 400-800ms rồi enabled. Test không được biết delay cụ thể; phải đợi condition/outcome.

## Failure injection

Ba lần riêng biệt:

1. đổi locator thành target không tồn tại;
2. giữ overlay vĩnh viễn;
3. server trả 200 nhưng client không render success.

Ghi call log/trace khác nhau thế nào. Không dùng cùng một “tăng timeout” cho ba root cause.

## Transfer

POST thành công dùng PRG và one-request flash. Test cần quan sát POST/302/GET khi debug, nhưng oracle chính vẫn là detail/status/row người dùng thấy. Response 200 không chứng minh business outcome nếu view sai.

## Gate P03

Sửa một race mà không dùng `waitForTimeout`, giải thích actionability khác assertion retry, và chẩn đoán được một permanent blocker bằng trace.

# P04 - Form, table, file, dialog và browser context

## Problem

Biết `click()` chưa đủ để automate flow thật. Form có label, validation, select/checkbox, submit; table có nhiều business row; browser có upload/download, popup và dialog. Nhưng học mọi API theo danh sách sẽ nhanh quên vì không gắn risk.

## Mental model

Mỗi interaction có ba lớp:

```text
semantic target -> browser action -> observable outcome
```

Chọn action gần hành vi user và để Playwright phát event đúng cách:

- `fill()` thay giá trị text theo contract;
- `pressSequentially()` chỉ khi app phụ thuộc từng key event và m có evidence;
- `selectOption()` cho native select;
- `check()`/`uncheck()` cho checkbox/radio;
- `setInputFiles()` cho file input;
- chờ `download`/`popup` event khi action tạo object mới;
- đăng ký dialog handler trước action nếu dialog được mong đợi.

## Worked example

### Form

```ts
test('invalid phone is rejected beside the field', async ({ page }) => {
  await page.goto('/customers/new');
  await page.getByLabel('Họ tên').fill('Nguyễn An');
  await page.getByLabel('Số điện thoại').fill('abc');
  await page.getByRole('button', { name: 'Lưu khách hàng' }).click();

  await expect(page.getByText('Số điện thoại không hợp lệ')).toBeVisible();
  await expect(page.getByLabel('Họ tên')).toHaveValue('Nguyễn An');
});
```

Oracle không chỉ kiểm tra error; safe input phải được giữ để user sửa. Nếu app dùng browser native validation, xác định request có thực sự được gửi không trước khi kết luận server validation.

### Table

```ts
const row = page
  .getByRole('row')
  .filter({ hasText: 'LD-20260810-000123' });

await expect(row).toContainText('Sẵn sàng trả');
await row.getByRole('link', { name: 'Chi tiết' }).click();
```

Table test theo business row. Không assert toàn bộ table text nếu risk chỉ là filter/status của một row; assertion quá rộng tạo noise.

### File và download

```ts
const downloadPromise = page.waitForEvent('download');
await page.getByRole('link', { name: 'Xuất báo cáo' }).click();
const download = await downloadPromise;
expect(download.suggestedFilename()).toMatch(/revenue.*\.csv/);
```

Promise chờ event phải được tạo trước click để không bỏ lỡ event nhanh.

Với upload:

```ts
await page.getByLabel('Tệp đính kèm').setInputFiles('fixtures/sample.txt');
await expect(page.getByText('sample.txt')).toBeVisible();
```

Đừng automate upload nếu product không có risk đó. Canonical Laundry không cần upload chỉ để luyện tool; dùng sandbox.

## Prediction

Trước khi chạy code, ghi thứ tự cho hai case:

1. tạo download promise trước click so với sau click: case nào có thể bỏ lỡ event;
2. tìm “Chi tiết” bằng index sau khi đảo table so với scope row bằng business code: mỗi cách mở order nào.

Với form invalid, dự đoán request có được gửi và safe input nào phải còn lại. Sau run, dùng
Network/DOM evidence để sửa prediction, không sửa expected theo actual một cách máy móc.

## Completion task

Làm `tests/work/p04_controls.spec.ts`; enable hai test sau attempt và chạy
<code>npm run lab:p04</code>:

- fill phone;
- chọn unit `KG`;
- check acknowledgement;
- set một file nhỏ;
- assert summary theo label/status.

## Independent task

Viết hai test:

1. filter order table và mở đúng row khi DOM đảo thứ tự;
2. một invalid form giữ safe input và không tạo outcome success.

## Failure injection

- dùng `pressSequentially` không cần thiết và đo thời gian;
- tạo download promise sau click;
- dùng file path phụ thuộc current working directory;
- scope action bằng `nth()` rồi đảo row.

Mỗi failure ghi root cause thuộc event order, environment hay business selection.

## Transfer

### Công ty

Chỉ học iframe, popup, download hoặc mobile emulation khi task thật có chúng. Không biến roadmap thành bingo API.

### Laundry

Ưu tiên form/customer/order/table/status/print flows. Receipt có thể kiểm tra print-friendly content/route; không cần pixel-perfect PDF nếu app chỉ render HTML print view.

## Gate P04

Tự automate một form gồm happy + invalid case, một table row có duplicate action và một event-based interaction; không sleep, không index coupling.

# P05 - Isolation, hooks và data ownership

## Problem

Hai test đều pass khi chạy riêng nhưng fail khi chạy cả suite:

```text
Test A đổi phone của customer mặc định.
Test B giả định phone vẫn là giá trị seed.
```

Browser context mới chỉ cô lập cookie/local storage/cache của browser. Nó không reset PostgreSQL hoặc state backend.

## Mental model

Mọi state phải có owner và lifecycle:

| State | Ví dụ | Owner/reset thường dùng |
| --- | --- | --- |
| browser | cookie, localStorage | context/fixture per test |
| server | session, in-memory cache | app contract/test endpoint có kiểm soát |
| database | customer/order/payment | unique data + cleanup, transaction/seed reset |
| external | email/provider/queue | fake/sandbox/controlled environment |

Test isolation không đồng nghĩa reset toàn hệ thống sau mỗi test. Chọn strategy theo contract:

- unique identity per test;
- API/helper tạo và cleanup resource do test sở hữu;
- deterministic DB seed/reset trong test environment;
- serial execution chỉ khi business scenario thật sự có chuỗi state và trade-off được ghi rõ.

## Worked example

```ts
test('updates only its owned customer state', async ({ page, request }, testInfo) => {
  const owner = `customer-${testInfo.workerIndex}-${testInfo.title.replaceAll(/\W/g, '-')}`;
  await request.post(`/test-support/reset?owner=${encodeURIComponent(owner)}`);

  await page.goto(`/customer-state?owner=${encodeURIComponent(owner)}`);
  await page.getByLabel('Số điện thoại mới').fill('0987654321');
  await page.getByRole('button', { name: 'Cập nhật' }).click();

  await expect(page.getByTestId('current-phone')).toHaveText('0987654321');
});
```

Identity không chỉ dùng timestamp chung chung. Nó phải tránh collision giữa worker/retry và vẫn cho phép tìm cleanup target.

## Hook hay fixture?

`beforeEach` phù hợp setup đơn giản cho nhóm test. Custom fixture phù hợp khi dependency có contract, lifecycle, reuse hoặc cleanup rõ.

```ts
type OwnedFixtures = { owner: string };

export const test = base.extend<OwnedFixtures>({
  owner: async ({ request }, use, testInfo) => {
    const owner = `w${testInfo.workerIndex}-${testInfo.testId}`;
    await request.post(`/test-support/reset?owner=${encodeURIComponent(owner)}`);
    await use(owner);
    await request.post(`/test-support/reset?owner=${encodeURIComponent(owner)}`);
  },
});
```

Fixture này có setup -> `use` -> teardown. Helper bình thường chỉ là function; không cần biến mọi helper thành fixture.

## Prediction

Với mỗi state, trả lời trước khi code:

1. Ai tạo?
2. Identity nào phân biệt?
3. Test khác có thể nhìn/sửa không?
4. Retry có tạo trùng không?
5. Cleanup chạy khi assertion fail không?

## Completion task

`tests/work/p05_isolation.spec.ts` chứa hai test executable cố ý dùng cùng owner. Enable đúng hai
test đó, chạy trên server state mới: chạy riêng để lấy baseline rồi chạy chung để thấy pollution.
Chỉ sau evidence mới sửa bằng owner riêng + cleanup. Reference ownership proof nằm trong
<code>tests/reference/foundation/p05_isolation.reference.spec.ts</code> và chỉ mở ở H5.

Focused command sau khi enable: <code>npm run lab:p05</code>. Command phải đỏ ở baseline combined
run, rồi xanh sau repair; một lần chạy riêng xanh không đạt gate.

## Independent task

Thiết kế data contract cho ba test order:

- create order;
- search order;
- cancel order.

Không cho test B phụ thuộc order do test A tạo, trừ khi m chủ đích viết một scenario test duy nhất có toàn flow.

## Failure injection

- dùng `Date.now()` nhưng hai worker mock cùng clock;
- cleanup toàn bộ DB thay vì resource owned;
- lưu page/context vào biến global;
- retry tạo duplicate business code.

## Transfer

Canonical Laundry có state DB thật. Trong test suite, không copy production endpoint `/test-support/reset` vào app chính. Dùng test profile, fixture/migration/seed có kiểm soát hoặc unique business data; khóa endpoint test-only nếu thật sự cần. Payment/status history là immutable business history, cleanup không được trở thành production feature.

## Gate P05

Hai test chạy đơn, chạy chung, đảo thứ tự và repeat vẫn xanh. M giải thích browser isolation khác DB isolation và vẽ data owner/cleanup.

# P06 - Authentication, authorization, session và CSRF

## Problem

“Login thành công” không chứng minh authorization đúng. Một app có thể hiện menu đúng nhưng server vẫn cho STAFF gọi route Manager. Hoặc test lưu auth state nhưng bỏ qua forced-password/session rule.

## Mental model

Phân biệt bốn câu hỏi:

```text
Authentication: m là ai?
Authorization:  m được làm gì?
Session:        server nhớ identity giữa request bằng contract nào?
CSRF:           request thay đổi state có đến từ browser session hợp lệ không?
```

UI hide button chỉ là UX. Server route và service guard mới là authority.

## Prediction

| Actor/state | `/dashboard` | `/manager` | POST Manager có CSRF | POST thiếu CSRF |
| --- | ---: | ---: | ---: | ---: |
| Anonymous | 302 login | 302 login | không có session | 403/redirect theo stack |
| STAFF | 200 | 403 | 403 | 403 |
| MANAGER | 200 | 200 | success/redirect | 403 |

Expected status phải theo app contract, không học thuộc bảng chung cho mọi framework.

Trước khi chạy, điền cả matrix và dự đoán redirect chain, status cuối, button visibility. Sau đó
đánh dấu oracle nào chỉ chứng minh UI và oracle nào chạm server route.

## Worked example

```ts
async function login(page: Page, username: 'staff' | 'manager') {
  await page.goto('/login');
  await page.getByLabel('Tên đăng nhập').fill(username);
  await page.getByLabel('Mật khẩu').fill('lab');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page.getByRole('heading', { name: 'Bảng điều khiển' })).toBeVisible();
}
```

Helper không được nuốt assertion/diagnostic quan trọng. Type union ngăn typo actor trong compile-time, nhưng runtime server vẫn phải kiểm tra credentials.

## Storage state

Với suite lớn, setup project có thể login một lần cho mỗi role và lưu browser state vào ignored output. Không commit cookie/token thật.

```ts
await page.context().storageState({ path: authFile });
```

Storage state là snapshot browser-side. Nó không đảm bảo server session chưa expire, account còn active hoặc password-reset flag không đổi. Test nhạy auth vẫn cần negative/fresh-session coverage.

Official reference: [Playwright Authentication](https://playwright.dev/docs/auth).

## Completion task

Tách comment auth matrix trong v3 thành test độc lập tại `tests/work/p06_auth.spec.ts`:

1. anonymous redirect;
2. STAFF forbidden;
3. MANAGER allowed;
4. missing CSRF rejected.

Enable bốn test sau attempt và chạy <code>npm run lab:p06</code>.

## Independent task

Viết một config có setup project cho STAFF và MANAGER, hai dependent projects dùng state tương ứng. File state phải nằm trong ignored directory.

## Failure injection

- dùng MANAGER state cho STAFF test;
- commit auth file giả rồi chạy secret scan;
- reuse expired state;
- chỉ kiểm tra menu ẩn mà không gọi route;
- POST bằng request context thiếu cookie hoặc CSRF.

## Transfer

Canonical rules phải được test ở nhiều tầng:

- UC-01/02/03/04 và BR-01..05;
- MANAGER kế thừa Staff operations;
- temporary-password session chỉ vào change-password/logout/static;
- session ID rotate sau login/password change;
- mọi POST có CSRF;
- refund/manager routes trả 403 cho STAFF;
- actor ID lấy từ session, không tin form.

Playwright chứng minh behavior user-visible và route boundary; MockMvc/service tests chứng minh sâu hơn. Không bắt E2E gánh hết security matrix.

## Gate P06

Tự xây role matrix, automate ít nhất anonymous/STAFF/MANAGER/CSRF, giải thích storage state không phải authorization proof và tìm được một wrong-role setup bug.

# P07 - Config, project, fixture và suite architecture

## Problem

Suite năm test chưa cần framework lớn. Nhưng suite 30 test copy login, test data và selectors cũng không bền. Hai lỗi đối nghịch là không tách gì hoặc tạo Page Object cho mọi page từ ngày đầu.

## Mental model

Tách abstraction khi có một trong ba tín hiệu:

1. duplication có cùng meaning và thay đổi cùng nhau;
2. lifecycle/dependency cần fixture quản lý;
3. domain action cần tên rõ hơn low-level steps.

Không tách chỉ vì code dài ba dòng.

```text
config       policy toàn run: testDir, projects, retries, reporter, webServer
fixture      dependency + setup/use/teardown lifecycle
helper       function thuần hoặc action nhỏ
data builder tạo data shape có default/override
page object  interface theo user task khi page behavior đủ ổn định
```

## Worked example

### Config

```ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
```

`retries=1` không phải thuốc chữa flake. Nó cho thêm evidence và giảm noise có kiểm soát trong CI; root cause vẫn phải được xử lý.

### Task helper

```ts
async function openOrder(page: Page, orderCode: string) {
  await page.goto('/orders');
  const row = page.getByRole('row').filter({ hasText: orderCode });
  await row.getByRole('link', { name: 'Chi tiết' }).click();
  await expect(page.getByRole('heading', { name: `Đơn ${orderCode}` })).toBeVisible();
}
```

Helper giữ oracle để không silently click nhầm. Nếu behavior thay đổi, một contract có chỗ sửa rõ.

### Data builder

```ts
type CustomerInput = { fullName: string; phone: string; note?: string };

function customerInput(overrides: Partial<CustomerInput> = {}): CustomerInput {
  return {
    fullName: 'Nguyễn An',
    phone: '0912345678',
    ...overrides,
  };
}
```

Builder không sinh magic random data không debug được. Override phải nhìn ra case intent.

## Prediction

Cho từng abstraction định thêm, ghi trước: duplication/lifecycle nào chứng minh nó cần tồn tại,
ai gọi nó và failure sẽ hiện ở đâu. Nếu không chỉ được evidence, giữ code tại chỗ. Dự đoán thêm
<code>test.only</code> sẽ làm local run và CI <code>forbidOnly</code> khác nhau thế nào.

## Completion task

Sau khi có tối thiểu tám test, mở `tests/work/p07_refactor/`. Tìm đúng ba duplication có meaning, tách helper/builder/fixture phù hợp; giữ assertion gần behavior.
Enable ba starter tests theo thứ tự ghi trong file và chạy <code>npm run lab:p07</code> sau mỗi
refactor nhỏ.

## Independent task

Thiết kế folder cho portfolio suite khoảng 25 test. Giải thích vì sao mỗi abstraction tồn tại. Không dùng `utils.ts` chứa mọi thứ.

## Failure injection

- mega Page Object vừa query DB vừa click UI vừa assert mọi thứ;
- fixture auto chạy nặng cho mọi test;
- environment variable thiếu nhưng config silently dùng production URL;
- helper catch error rồi return `false`, khiến test false green;
- `test.only` lọt CI.

## Transfer

### Công ty

Đọc convention repo hiện tại trước. Không refactor architecture trong task đầu. Sửa tối thiểu, hỏi reviewer về fixture/data/selector contract và lưu diff nhỏ.

### Laundry

Không tạo Playwright Page Object mirror toàn bộ 16 views. Bắt đầu bằng domain task helper ở flow lặp thật: login, select owned customer, open order by business code. Business rules vẫn nằm trong Spring service, không copy vào test helper làm source of truth.

## Gate P07

Từ suite có duplication thật, tách đúng một fixture, một data builder và tối đa hai task helpers; test behavior không đổi, chạy repeat/reorder được, m giải thích lifecycle.

# P08 - APIRequestContext và UI-API hybrid

## Boundary quan trọng

API testing là kỹ năng nghề nghiệp có giá trị, nhưng canonical Laundry là Spring MVC server-rendered, không có REST-first UI. Không dựng `/api/*` vào Laundry chỉ để tick box. P08 dùng API sandbox của lab hoặc API công ty được phép.

## Mental model

UI test chứng minh browser/user flow. API test chứng minh HTTP contract nhanh và trực tiếp. Hybrid thường dùng API để setup/cleanup data rồi UI để chứng minh outcome, hoặc UI act rồi API/DB evidence để debug.

```text
API arrange -> UI act/assert
UI act -> HTTP/API inspect -> UI assert
```

Đừng thay toàn bộ user flow bằng API rồi tuyên bố UI được test.

Official reference: [Playwright API testing](https://playwright.dev/docs/api-testing).

## Worked example

```ts
test('active services API returns stable business fields', async ({ request }) => {
  const response = await request.get('/api/services');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body: unknown = await response.json();
  const services = parseServices(body); // runtime validation from TS03
  expect(services).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ code: 'GIAT_SAY_KG', unit: 'KG' }),
    ]),
  );
});
```

Type annotation không validate JSON runtime. `parseServices` phải narrow/validate `unknown` hoặc dùng schema library nếu project đã chọn.

## Contract dimensions

| Dimension | Example oracle |
| --- | --- |
| status | 200/201/400/401/403/404/409 theo contract |
| headers | content type, location, cache, correlation ID |
| shape | required/optional fields and types |
| semantics | active only, correct calculation, authorization |
| side effect | resource actually created/changed once |
| privacy | fields/records not leaked |
| timing | only when explicit SLA/risk exists |

Không assert mọi field trong mọi test. Chọn dimension theo risk.

## Prediction

Không chạy request, điền matrix cho success, invalid phone, missing token và not-found: expected
status, minimal body shape, side effect có/không và cleanup owner nào. Với một body sai shape nhưng
status 200, dự đoán cast-only parser và runtime validator cho hai kết quả khác nhau thế nào.

## Completion task

Làm `tests/work/p08_api.spec.ts`:

- GET services status/header/shape;
- invalid customer update trả 400;
- owned customer update rồi UI thấy đúng phone;
- cleanup đúng owner.

Enable bốn test sau attempt và chạy <code>npm run lab:p08</code>.

## Independent task

Từ một API contract nhỏ, thiết kế matrix positive, boundary, invalid shape, unauthorized và not-found. Implement tối thiểu sáu case không duplicate boilerplate quá mức.

## Failure injection

- cast JSON bằng `as Service[]` dù body sai;
- hardcode shared resource;
- chỉ assert 200;
- cleanup toàn bộ state;
- reuse auth context sai role;
- retry POST không idempotent mà không hiểu side effect.

## Transfer

Với Laundry, dùng Network/Playwright request để hiểu form POST/redirect/status/CSRF, không thêm JSON adapter. API portfolio có thể nằm ở sandbox/repo riêng. SQL/service/MockMvc mới là proof sâu của Laundry.

## Gate P08

Tự viết một API matrix có runtime shape check, negative auth/input case, owned data và một UI-API hybrid flow. Giải thích rõ layer nào được và chưa được chứng minh.

# P09 - Debug bằng evidence, không bằng ritual

## Problem

Test fail ở dòng click không có nghĩa click là root cause. Login trước đó có thể fail, data không tồn tại, overlay che button, locator match sai, app trả 500 hoặc CI thiếu environment.

## Mental model

```text
1. Read the first meaningful error
2. State expected versus actual
3. Classify likely layer
4. Write 2-3 falsifiable hypotheses
5. Choose the cheapest decisive evidence
6. Reproduce narrowly
7. Apply the smallest fix
8. Run regression proportional to risk
```

### Evidence map

| Layer | Evidence chính | Câu hỏi |
| --- | --- | --- |
| test code | stack, assertion diff, call log | test đang yêu cầu gì? |
| locator/DOM | trace snapshot, accessibility view | match 0, 1 hay nhiều? |
| timing/actionability | action log, video/trace timeline | check nào chưa pass? |
| browser JS | console, page error | client crash? |
| HTTP | Network, status, redirect, request body | request/response contract? |
| server | structured log/correlation ID | handler/service nào fail? |
| DB/data | owned records/query evidence | seed/state/constraint? |
| environment | versions/env/ports/artifacts | local và CI khác gì? |

### Trace workflow

1. mở trace từ failure, không click ngẫu nhiên;
2. chọn action đầu tiên lệch prediction;
3. so DOM before/after, call log và Network;
4. ghi một evidence loại trừ ít nhất một hypothesis;
5. chỉ sau đó mở source/patch.

Official references: [Trace Viewer](https://playwright.dev/docs/trace-viewer) và [Debugging tests](https://playwright.dev/docs/debug).

## Worked diagnosis

Symptom:

```text
Timeout 5000ms exceeded while waiting for getByRole('button', { name: 'Lưu' })
```

Reasoning không hợp lệ: “CI chậm, tăng lên 30s.”

Reasoning kiểm chứng được:

```text
Expected: one enabled visible Lưu button after login.
Actual: locator resolved zero nodes.
H1: still on login because auth state expired.
H2: accessible name changed to Cập nhật.
H3: route returned error page.
Evidence: current URL + trace DOM + response status.
```

Nếu URL là `/login`, locator không phải vấn đề chính.

### Flake taxonomy

| Nhóm | Ví dụ | Fix class |
| --- | --- | --- |
| test race | missing await, wrong signal | dependency/assertion |
| app race | async save/duplicate command | product synchronization/idempotency rule |
| shared data | order reused across workers | ownership/reset |
| selector | DOM order/duplicate text | semantic scope |
| environment | timezone/version/secret/port | reproducible config |
| external dependency | unstable service | fake/contract/environment strategy |

Retry pattern là evidence: pass ở retry có thể là flake, nhưng cũng có thể là test data side effect khiến lần hai khác lần một.

## Prediction

Trước khi mở source của từng seeded bug, ghi expected/actual, hai hypothesis và một evidence rẻ
nhất có thể loại trừ ít nhất một hypothesis. Mười phút đầu chỉ được đọc error, trace, URL/DOM,
Network hoặc state evidence; chưa patch.

## Completion task

Lab `tests/work/p09_seeded_bugs/` có ít nhất bốn bug:

- missing await;
- duplicate locator;
- shared owner;
- wrong environment/base URL.

Mỗi bug có note riêng trong <code>tests/work/p09_seeded_bugs/bug-notes/</code>: expected, actual,
hypotheses, decisive evidence, root cause, smallest fix, regression scope. Không gộp bốn root cause vào một file chung.

Chạy riêng bằng <code>npm run lab:p09:missing-await</code>,
<code>npm run lab:p09:duplicate-locator</code>, <code>npm run lab:p09:shared-owner</code> và
<code>npm run lab:p09:wrong-environment</code>. Sau khi cả bốn đã được enable/sửa, chạy regression
<code>npm run lab:p09</code>.

## Independent task

Lấy một failure thật được phép ở internship hoặc Laundry. Không gửi source/secret ra ngoài. Viết postmortem đủ để một teammate hiểu cách tái hiện và lý do fix.

## Transfer

Chuyển triage card sang một failure mới nhưng giữ bí mật: chỉ ghi symptom đã sanitize, layer,
evidence, root cause class và regression. Với Laundry, map evidence qua browser → controller/service
→ PostgreSQL thay vì mặc định đổ cho locator.

## Failure injection

Sau khi sửa, tự gây lại lỗi bằng cách đảo một biến. Nếu regression test vẫn xanh khi bug quay lại, oracle chưa bắt đúng failure.

## Gate P09

Trong 30 phút, chẩn đoán một seeded bug lạ. Không patch trong mười phút đầu. Diagnose đạt 2 khi evidence loại trừ được hypothesis và regression fail đúng trước/fix xanh sau.

# P10 - CI cho test automation ở mức đi làm

## Mental model

CI là một máy/runner bắt đầu gần clean state và thực hiện workflow lặp lại. Nó không phải phép màu làm test chuyên nghiệp hơn.

```text
checkout
-> install pinned dependencies
-> install browser/system dependencies
-> start target or point to safe environment
-> run typecheck/tests
-> preserve report/trace/log when needed
-> publish pass/fail signal
```

## Worked GitHub Actions baseline

```yaml
name: Playwright checks
on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run typecheck
      - run: npm run check:kit
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report
```

Pin action major versions per current official guidance and review third-party action trust. Secrets đi qua repository/environment secrets, không echo ra log và không commit `.env`.

## CI không dạy gì thay test design

- Cache sai có thể giữ artifact/dependency cũ.
- `workers=1` là baseline chẩn đoán, không chứng minh suite parallel-safe.
- Retry che noise tạm thời nhưng phải track flake.
- Artifact `if: always()` giúp debug cả failure; retention phải phù hợp dữ liệu.
- Test trên production cần explicit approval/risk boundary, không phải default.

## Prediction

Đọc workflow broken nhưng chưa sửa. Với từng branch, dự đoán stage fail đầu tiên, log đặc trưng và
artifact nào còn/không còn. Phân biệt “test đỏ” với “runner chưa đủ dependency để chạy test”.

## Completion task

Phân biệt hai workflow trước khi sửa:

- <code>labs/ci/broken/playwright.yml</code> và <code>fixed/</code> là vật liệu chẩn đoán;
- executable starter kiểm tra contract YAML ở <code>tests/work/p10_ci.spec.ts</code>;
- <code>.github/workflows/playwright.yml</code> là baseline an toàn chỉ gate reference, vì work specs
  còn <code>fixme</code>. Trong bài P10, m enable một work spec trên branch disposable để chứng minh
  deliberate red + artifact, rồi phục hồi; không commit một pipeline luôn đỏ vào pack.

Workflow lab có ba failure branch:

1. bỏ browser install;
2. dùng `npm install` khi lockfile drift;
3. chỉ upload report khi success.

Sửa từng branch và ghi failure nằm ở infrastructure hay test.

Enable ba contract tests trong <code>tests/work/p10_ci.spec.ts</code> sau attempt và chạy
<code>npm run lab:p10</code>.

## Independent task

Từ clean clone/folder mới, chạy đúng command README. Sau đó dựng một pipeline xanh và tải artifact của một run cố ý đỏ.

## Failure injection

- thiếu env;
- port collision/webServer không ready;
- Node version khác local;
- timezone khác;
- `test.only` lọt branch;
- artifact path sai;
- secret in log.

## Transfer

### Docker ở đây dùng thế nào?

Nếu Laundry dùng Compose để chạy PostgreSQL/app, CI hoặc local setup có thể gọi file đã được project kiểm soát. M chỉ cần đọc service, image/build, port, env, volume, healthcheck và logs. Không dành tuần riêng tối ưu image hoặc học orchestration.

## Gate P10

Pipeline chạy từ clean checkout, typecheck + test, giữ artifact khi fail. M cố ý làm đỏ, chỉ đúng stage/root cause và sửa mà không thử mò YAML.

# P11 - Company-style capstone ticket

Artifact bắt buộc đã có sẵn: <code>tests/work/p11_capstone.spec.ts</code> và bốn card trong
<code>labs/p11/</code>. Chạy focused bằng <code>npm run lab:p11</code>; không viết test trước khi
<code>REQUIREMENT_PARAPHRASE.md</code>, <code>RISK_AND_ORACLE.md</code> và
<code>DATA_OWNERSHIP.md</code> có attempt thật.

## Mental model

Capstone không thêm API mới; nó buộc m ghép cùng một chain đã học:

```text
ticket -> paraphrase -> risk/oracle -> owned state -> focused tests
       -> failure evidence -> smallest fix -> regression/CI -> teach-back
```

Mỗi artifact khóa một kiểu brainrot: code trước khi hiểu requirement, expected lấy từ actual, data
không owner, debug thử mò hoặc “CI xanh” vì test bị skip.

## Worked example

Với một ticket khác “user đổi display name”, một paraphrase tốt phải nói actor, precondition,
command, observable success và forbidden outcome. Risk card tách happy save, invalid input,
unauthorized actor và duplicate submit. Đây chỉ là mẫu cách suy nghĩ; không dùng nó làm answer cho
order/phone ticket bên dưới.

## Prediction

Trước code, ghi expected route/status/UI outcome cho ba actor: anonymous, STAFF và MANAGER. Vẽ
POST → redirect → GET cho happy path, rồi dự đoán test nào sẽ bắt wrong order, shared owner,
missing await và server authorization bị bỏ quên.

## Completion task

### Ticket

Sandbox nhận một thay đổi: “Staff tìm order theo business code, mở detail, cập nhật phone thuộc data owner và thấy success sau PRG. Anonymous không được vào protected route; STAFF không được gọi Manager action.”

M không được bắt đầu bằng code. Tạo artifact theo thứ tự:

1. requirement paraphrase;
2. risk/test-condition matrix;
3. data ownership plan;
4. locator/oracle plan;
5. implementation tối thiểu;
6. một seeded failure và bug journal;
7. CI evidence;
8. teach-back ba phút.

### Constraints

- TypeScript strict;
- semantic locators;
- không `waitForTimeout`;
- test chạy độc lập/reordered;
- auth state không commit;
- API dùng cho setup chỉ khi boundary rõ;
- ít nhất một case âm;
- trace/report khi fail;
- không mega-POM.

### 120-minute simulation

| Phần | Thời gian | Output |
| --- | ---: | --- |
| đọc ticket + test design | 15 phút | conditions/risks |
| code happy + negative | 45 phút | focused specs |
| seeded bug | 25 phút | evidence note |
| clean/repeat/CI | 20 phút | commands/artifact |
| teach-back | 15 phút | explanation |

Sau attempt thật ở ba test, bỏ marker <code>fixme</code> và chạy <code>npm run lab:p11</code>. Không
được coi command bị block hoặc test skipped là tiến độ.

## Independent task

Giữ cùng contract nhưng đổi một dimension không có trong starter: DOM order đảo, phone invalid hoặc
session hết hạn. Viết một test condition mới từ risk trước khi thêm code và nói regression scope nào
đủ, scope nào quá rộng.

## Failure injection

Sau khi suite xanh, tự cài đúng một lỗi trong bốn nhóm: locator theo index, shared owner, missing
await hoặc UI-only authorization. Ghi vào <code>labs/p11/BUG_JOURNAL.md</code>, chứng minh test đỏ,
restore fix rồi chạy focused + typecheck. Không giữ bug trong learner work sau evidence.

## Transfer

Lấy một ticket được phép ở công ty, sanitize mọi name/URL/secret, rồi tái dùng bốn card requirement,
risk/oracle, ownership và bug journal. Không copy canonical Laundry behavior sang hệ thống công ty.

## Gate P11 - Graduation Playwright

Pass khi:

- không AI trong prediction và transfer;
- tự viết được flow mới 6-10 bước;
- locator chịu reorder/duplicate text;
- assertion chứng minh outcome;
- data owner rõ và repeat/reorder xanh;
- auth negative đúng;
- tìm seeded bug bằng evidence;
- pipeline có artifact;
- giải thích code, state và failure path.

Nếu test xanh nhưng không giải thích được missing `await`, fixture lifecycle hoặc root cause seeded bug, quay lại đúng P lesson bị lộ.
