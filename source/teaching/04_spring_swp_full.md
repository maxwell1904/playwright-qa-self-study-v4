# PHẦN IV - Java/Spring reverse và tự làm toàn bộ SWP391 Laundry

Mục tiêu phần này không phải biến m thành Java backend specialist trong ba tuần. Mục tiêu là đủ Java/Spring để tự xây, test, lần trace và defense toàn bộ canonical Laundry trong kỳ SWP hai tháng.

Đây là một khối lượng lớn nếu vừa internship vừa học từ zero. Vì vậy mỗi feature đi theo vertical slice và Definition of Done; không scaffold 30 controller rỗng rồi gọi là tiến độ.

## Evidence cards khi repo Laundry thật xuất hiện

Part IV không scaffold một Spring app giả. Các completion chỉ chạy trên repo Laundry thật m cung
cấp, nhưng card ghi evidence đã có trong <code>lab-kit/labs/spring-reverse/</code>:

| Module | Card thật |
|---|---|
| J00 | <code>J00_JAVA_READING.md</code> |
| S01 | <code>S01_HTTP_CONTAINER_TRACE.md</code> |
| S02 | <code>S02_MVC_PRG_TRACE.md</code> |
| S03 | <code>S03_TRANSACTION_TRACE.md</code> |
| S04 | <code>S04_PERSISTENCE_TRACE.md</code> |
| S05 | <code>S05_SECURITY_TRACE.md</code> |
| S06 | <code>S06_TEST_LAYER_MATRIX.md</code> |
| S07 | <code>S07_FULL_VERTICAL_TRACE.md</code> |

Card compact <code>REVERSE_TRACE_CARD.md</code> và disturbance card UC-09 vẫn được giữ. Chưa có
repo thì chỉ làm reading/model task; không giả vờ completion đã có implementation evidence.

# J00 - Java reading bridge cho người zero

## Mental model

- TypeScript chạy automation tests.
- Java chạy production Laundry.

M học cả hai qua cùng mental model: values, types, functions/methods, objects, errors và modules/packages. Không cố dịch từng cú pháp một-một.

## Worked example

```java
public OrderDetailView getOrderDetail(String orderCode) {
    LaundryOrder order = orderRepository.findByOrderCode(orderCode)
        .orElseThrow(() -> new OrderNotFoundException(orderCode));
    return orderViewMapper.toDetail(order);
}
```

Đọc từ ngoài vào:

- `public`: method được gọi từ object khác;
- `OrderDetailView`: kiểu trả về;
- `getOrderDetail`: tên hành vi;
- `(String orderCode)`: input typed;
- local variable `order` giữ reference tới entity;
- repository trả `Optional`; thiếu thì throw domain exception;
- mapper tạo deliberate view model;
- `return` gửi result về caller.

Prediction: nếu code không tồn tại, dòng mapper có chạy không? Exception đi về tầng nào?

### Class, record, interface

```java
public record CustomerForm(
    @NotBlank String fullName,
    @NotBlank String phone,
    String note
) {}
```

Record phù hợp data carrier bất biến theo field reference. Annotation cung cấp metadata cho framework/validator; annotation không tự chạy nếu pipeline không kích hoạt nó.

```java
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findById(Long id);
}
```

Interface mô tả contract. Spring Data tạo implementation runtime cho pattern được hỗ trợ; query phức tạp vẫn cần contract rõ và test PostgreSQL.

### Constructor injection

```java
@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
}
```

Object không tự `new` repository. Spring container tạo bean và đưa dependency vào constructor. Lợi ích: dependency explicit, test thay bằng fake/mock khi phù hợp, object không giấu global lookup.

### Collections và stream vừa đủ

```java
BigDecimal total = items.stream()
    .map(OrderLine::lineAmount)
    .reduce(BigDecimal.ZERO, BigDecimal::add);
```

Đây là pipeline array-like: source -> map -> reduce. Nhưng money rule không được viết kiểu ngắn đến mức mất rounding/validation. Với code khó giải thích, loop rõ có thể tốt hơn stream clever.

### Exception mental model

Expected business conflict khác system failure:

- invalid shape: binding/Bean Validation, trả field error;
- business conflict: service thấy state không hợp lệ, map thành page-level 409;
- not found: 404;
- wrong role/CSRF: 403;
- unexpected persistence/system error: generic 500 + correlation log.

Không catch `Exception` rồi return `null`. Exception phải giữ meaning và transaction rollback contract.

## Prediction

Không chạy code, đọc method mẫu rồi ghi: mapper có chạy khi repository không tìm thấy không;
exception đi qua caller nào; dependency nào là field, value nào là local; đổi return type hoặc quên
return tạo compile feedback ở đâu. Với stream money snippet, tự tính hai line trước khi tin output.

## Completion task

Từ một Controller/service/repository thật, gạch:

Ghi vào <code>lab-kit/labs/spring-reverse/J00_JAVA_READING.md</code>.

- input type;
- return type;
- dependency;
- branch;
- side effect;
- exception path.

## Independent task

Viết Java thuần cho `PhoneNormalizer.normalizeStoredPhone` với tests: trim, remove space/dot/hyphen, `+84` -> `0`, đúng 10 digits bắt đầu `0`, invalid throw. Chưa dùng Spring.

## Failure injection

- thiếu `return`;
- dùng `double` cho VND;
- field mutable per-request trong singleton service;
- catch exception và nuốt;
- `Optional.get()` không check;
- entity dùng làm form.

## Transfer

Chọn một class Java thật được phép đọc ở internship hoặc Laundry. Lập bảng “Java symbol → vai trò”
cho constructor, field, method, parameter, return/throw và test caller. Không copy source riêng tư vào
card; chỉ ghi symbol/path và flow đã sanitize.

## Gate J00

Đọc được class khoảng 40-80 dòng, kể dependency/call flow, viết một method + JUnit test và sửa compile error mà không nhờ AI viết patch.

# S01 - Từ browser tới Servlet container

## Problem

Browser không “gọi Controller”. Nó gửi HTTP bytes tới port. Controller chỉ xuất hiện sau khi server/container/filter/framework đã xử lý nhiều bước.

## Mental model

```text
Browser
-> TCP/HTTP listener trong embedded Servlet container
-> HttpServletRequest / HttpServletResponse
-> Servlet FilterChain
-> DispatcherServlet
-> Spring MVC delegates
-> Controller
-> Service
-> Repository/JPA
-> PostgreSQL
-> Model/ViewResolver/Thymeleaf
-> HTTP response
-> DOM
```

Spring Boot auto-configure hạ tầng; nó không xóa Servlet API. Container quản lifecycle và concurrency. Nhiều request có thể đi qua cùng singleton Controller/Service bean, nên không lưu per-request mutable data trong bean field.

## Worked example

Với `GET /services`:

1. browser gửi method/path/headers/cookie;
2. container tạo request/response objects;
3. filters chạy;
4. DispatcherServlet tìm handler;
5. `PublicCatalogController.listActiveServices` gọi `CatalogService`;
6. repository query active services;
7. Controller đưa typed view data vào model;
8. Thymeleaf render HTML;
9. browser parse thành DOM;
10. Playwright locator/assertion quan sát DOM.

### Evidence card

```text
User outcome:
HTTP method/path/query/body:
Request status/redirect/headers:
Selected handler:
Bound input object:
Service command/query:
Transaction boundary:
Repository/query/table:
Rendered view/redirect:
Playwright oracle:
```

## Prediction

Với một GET public và một GET protected, dự đoán method/path, filter outcome, handler có/không được
gọi, status/redirect và DOM oracle. 404, 302, 403, 500 phải có first differing layer riêng.

## Completion task

Chạy một GET thật. Dùng Network và breakpoint/log ở Controller. Ghi method, URI, status, selected method, SQL/query và view.

Ghi vào <code>lab-kit/labs/spring-reverse/S01_HTTP_CONTAINER_TRACE.md</code>.

## Independent task

Trace một GET có query filter như `/orders?status=RECEIVED&page=1`. Chỉ rõ query parameter khác path và body.

## Failure injection

- route 404;
- unauthenticated 302;
- wrong role 403;
- Controller throw 500;
- view template missing;

Mỗi case phải chỉ tầng đầu tiên tạo khác biệt.

## Transfer

Từ một Network entry ở app được phép, kể chain tới handler và response mà không dùng câu “Spring tự
lo”. Nếu chưa có repo Laundry thật, chỉ điền prediction/model; không tự tạo Controller giả để lấy điểm.

## Gate S01

Không dùng câu “Spring tự map”. Kể container -> request/response -> filters -> DispatcherServlet -> handler -> response bằng object/tầng cụ thể và evidence.

# S02 - DispatcherServlet, binding, validation và PRG

## Mental model

DispatcherServlet là front controller. Nó dùng delegate:

```text
HandlerMapping -> chọn handler
HandlerAdapter -> invoke phù hợp
Argument resolvers/data binding -> tạo input
Validator -> shape validation
Controller -> navigation/delegation
ViewResolver -> view rendering
Exception resolvers -> error mapping
```

## Worked example

```java
@PostMapping("/customers")
public String createCustomer(
        @Valid @ModelAttribute("form") CustomerForm form,
        BindingResult bindingResult,
        RedirectAttributes redirectAttributes) {
    if (bindingResult.hasErrors()) {
        return "customers/form";
    }

    long customerId = customerService.createCustomer(form);
    redirectAttributes.addFlashAttribute("success", "Đã lưu khách hàng");
    return "redirect:/customers/detail?id=" + customerId;
}
```

Controller xử lý binding/navigation. Service revalidate business truth. Form không gửi trusted actor ID, calculated money, status hoặc timestamps.

### Shape versus business validation

| Layer | Câu hỏi | Ví dụ |
| --- | --- | --- |
| binding/conversion | text có đổi được sang kiểu? | `abc` thành `BigDecimal` thất bại |
| Bean Validation | field shape đúng? | blank, length, pattern |
| service | state/trust/cross-row đúng? | service active, status eligible, amount <= remaining |
| database | integrity cuối | check, FK, unique |

Database constraint không thay user-facing validation. Browser validation không thay server validation.

### PRG

Successful mutation:

```text
POST /orders
-> 302 Location: /orders/detail?code=...
-> browser GET detail
-> 200 HTML
```

Refresh lặp GET, không resubmit POST. Flash sống đúng một request redirect. PRG giảm duplicate submit nhưng không phải distributed idempotency; service vẫn khóa/revalidate.

## Prediction

Với ba input: malformed number, field blank và value hợp shape nhưng vi phạm business state, dự đoán
tầng reject đầu, service có được gọi không, response 200/302/409 và safe field nào còn lại. Vẽ riêng
POST response và redirect GET; đừng gộp thành một request.

## Completion task

Với `CustomerForm`, implement shape error giữ safe values và không gọi service. Valid input gọi command một lần rồi redirect.

Ghi request/binding/redirect evidence vào
<code>lab-kit/labs/spring-reverse/S02_MVC_PRG_TRACE.md</code>.

## Independent task

Với `CreateOrderForm`, vẽ field nào browser submit và field nào server phải reload/derive. Unit price, total, actor, status, order code và time không được trusted từ form.

## Failure injection

- đặt `BindingResult` sai vị trí;
- redirect khi binding error làm mất field error;
- dùng entity làm form;
- tin `staffId` từ hidden input;
- return 200 success page sau POST thay vì PRG;
- persistent toast trong session.

## Transfer

Đọc một form flow công ty/Laundry được phép và tách browser-owned text khỏi server-derived actor,
money, code, status và time. Ghi route/form/service conflict/PRG oracle; không đổi app chỉ để khớp mẫu.

## Gate S02

Tự implement một GET form + POST form với typed input, field error, service conflict, PRG và one-request flash. Trace được 200 validation versus 302 success versus 409 conflict.

# S03 - Service, transaction và business invariant

## Mental model

Service method biểu diễn một business command, không phải collection CRUD tùy ý. Transaction là all-or-nothing boundary cho command.

```java
@Transactional
public OrderCode createOrder(CreateOrderCommand command, CurrentOperator actor) {
    // reload authoritative rows
    // validate active service and quantities
    // calculate/snapshot line values
    // persist order/items/initial history atomically
    // return business code
}
```

Controller không bắt đầu nửa transaction, repository không tự commit từng phần của cùng command.

## Worked example

### Canonical money model

Mọi amount dùng `BigDecimal`; VND scale 0. Line:

```text
lineAmount = round(unitPrice * quantity, scale 0, HALF_UP)
orderTotal = sum(already-rounded positive line amounts)
```

Browser display không phải pricing source. Payment ledger immutable:

```text
collected = sum(COLLECTION)
refunded  = sum(REFUND)
netPaid   = collected - refunded
remaining = max(orderTotal - netPaid, 0)
refundDue = cancelled ? netPaid : 0
```

Không persist `paid_amount`, `refunded_amount`, `remaining_amount` trên order.

### Lifecycle

```text
RECEIVED -> PROCESSING -> READY_FOR_PICKUP -> COMPLETED
    |
    -> CANCELLED
```

Chỉ RECEIVED được cancel. Không backward transition. Open issue chặn ready/pickup. Pickup cần READY + remaining zero + no open issue.

### Concurrency

Command trên existing order phải lock row `laundry_order` bằng pessimistic write trước khi đọc lại status/ledger/issue guards. Hai full-balance collection không được cùng pass stale check.

UC-09 chưa có order row để lock. Nó lock selected active catalogue rows theo ascending `service_id`, validate/snapshot và insert order/items/history atomically.

## Prediction

Trước code, điền decision table cho amount zero/negative/exceeds, terminal status, open issue và hai
submit đồng thời. Với mỗi row, dự đoán lock/reload/guard/write order, exception và số history/ledger
row sau failure.

## Completion task

Viết service test cho `recordCollection`:

Ghi transaction/lock/no-partial-write evidence vào
<code>lab-kit/labs/spring-reverse/S03_TRANSACTION_TRACE.md</code>.

- positive eligible amount;
- zero/negative;
- exceeds remaining;
- cancelled/completed;
- two concurrent full-balance submits exactly one succeeds.

## Independent task

Implement `completePickup` từ tests trước: lock -> reload balance/issues/status -> validate -> transition/history/operator/time atomically.

## Failure injection

- validate trước khi lock;
- controller tính total;
- update status bằng generic `updateStatus(status)`;
- catch conflict rồi commit partial history;
- dùng `double`;
- lưu remaining duplicate;
- issue resolution tự move order backward.

## Transfer

Chọn một command mutation khác trong repo thật. Viết invariant, authoritative rows, transaction
boundary, lock target/order và no-partial-write oracle trước khi đọc implementation; sau đó đối chiếu.

## Gate S03

Từ BR viết service tests và command có transaction/lock đúng order. Gây exception giữa hai writes và chứng minh rollback, rồi giải thích invariant chứ không chỉ annotation.

# S04 - Repository, JPA, PostgreSQL và Flyway

## Mental model

JPA mapping không phải schema source. Flyway migration sở hữu DDL; Hibernate `ddl-auto=validate` chỉ kiểm tra mapping tương thích.

```text
Flyway versions -> PostgreSQL schema
JPA entity/repository -> mapping/query contract
Service transaction -> when reads/writes commit or rollback
```

Không sửa entity rồi chờ production database tự thay.

### Chín bảng canonical

| Table | Business purpose |
| --- | --- |
| `user_account` | Staff/Manager credentials/state |
| `customer` | counter contact, no login |
| `laundry_service` | catalogue/current price |
| `laundry_order` | order header/contact snapshot/total/status |
| `laundry_order_item` | immutable service/price snapshot per line |
| `order_status_history` | transition audit |
| `payment_transaction` | immutable collection/refund ledger |
| `order_issue` | operational problem/resolution |
| `store_setting` | singleton display/receipt info |

Không thêm table vì generator gợi ý. Mỗi table mới cần business purpose + UC trace và baseline change approval.

## Worked example

Một vertical persistence trace tối thiểu là: Flyway tạo table/constraint → entity map đúng column/type
→ repository query có grain/order rõ → service dùng trong transaction → PostgreSQL test chứng minh edge.
Nếu chỉ thấy entity compile, schema/query contract vẫn chưa được chứng minh.

### Query contract

Repository test cần PostgreSQL khi semantics phụ thuộc:

- `ILIKE`/escaped filters;
- timezone grouping;
- pessimistic lock;
- aggregate ledger/report;
- half-open instant range;
- stable ordering/pagination.

Trivial single-row CRUD không cần persistence test chỉ để tăng count.

### Time

Business zone duy nhất `Asia/Ho_Chi_Minh`. Persist event instant bằng `timestamptz`/Java `Instant`, DB session UTC. Browser local datetime chuyển bằng shop zone. Local date report thành range `[start, nextDayStart)`.

Tests inject fixed `Clock`; không dựa máy dev/CI default timezone.

## Prediction

Với query order có items + transactions + history, dự đoán JOIN nào nhân row; viết output grain và
stable sort trước SQL. Với local-date report, chuyển ngày shop thành range half-open và dự đoán hai
event sát nửa đêm thuộc ngày nào.

## Completion task

Tạo migration V1 cho identity/customer/catalog, entity mappings và repository smoke. App phải build empty database từ V1 và validate schema.

Ghi migration/query/cardinality evidence vào
<code>lab-kit/labs/spring-reverse/S04_PERSISTENCE_TRACE.md</code>.

## Independent task

Viết repository query + PostgreSQL test cho payment aggregate hoặc order search có stable sort. Tự giải thích count query/page boundary.

## Failure injection

- edit applied migration;
- `ddl-auto=update`;
- enum ordinal;
- eager mọi association;
- fetch join items x transactions x history gây cartesian product;
- group revenue theo order creation date;
- dùng server timezone mặc định;
- unique customer phone.

## Transfer

Mở migration/entity/repository test của một feature thật và lập trace ba chiều schema ↔ mapping ↔
query. Nếu repo chưa có, dừng ở thiết kế card; không invent table/class để completion giả.

## Gate S04

Từ empty DB chạy toàn migrations, Hibernate validate, repository query đúng edge cases. Chỉ table/index/constraint nào phục vụ BR/UC và chỉ ra SQL evidence.

# S05 - Spring Security filter chain

## Mental model

Security chạy trong Servlet FilterChain trước DispatcherServlet cho nhiều quyết định. Spring Security thường dùng `DelegatingFilterProxy`/`FilterChainProxy` để chọn security chain.

```text
request
-> container filter chain
-> Spring Security filters
   authentication/session/CSRF/authorization
-> DispatcherServlet only if allowed/continued
```

403 có thể xuất hiện trước Controller breakpoint. 302 login có thể do entry point, không phải Controller redirect.

## Worked example

### Canonical boundary

- public GET `/`, `/services`, `/track`, `/login` và static/error;
- public POST `/track`, `/login` theo contract;
- remaining routes authenticated;
- `/manager/**` và refund Manager-only;
- MANAGER vẫn dùng Staff operations;
- every state-changing POST keeps CSRF;
- inactive account cannot start new session;
- temporary-password session restricted;
- actor derived from authenticated session;
- no remember-me; inactivity timeout 30 minutes.

## Prediction

Điền actor × route × method × CSRF matrix trước test. Với mỗi 302/403, dự đoán Controller breakpoint
có hit không và evidence filter/entry-point/access-denied nào phân biệt. Menu visibility chỉ là thêm
UX oracle, không thay server oracle.

## Completion task

MockMvc tests: anonymous redirect, STAFF 403 Manager route, MANAGER access, missing CSRF 403, valid CSRF reaches handler.

Ghi matrix vào <code>lab-kit/labs/spring-reverse/S05_SECURITY_TRACE.md</code>.

## Independent task

Trace one login through filter/provider/user details/success handler/session fixation to dashboard. Trace forced-password redirect and session ID rotation after password change.

## Failure injection

- permit all then hide menu;
- disable CSRF to make test easy;
- trust role in form;
- expose hash/log password;
- different error for unknown versus wrong password;
- reset Manager through Staff admin;
- stale principal keeps `mustChangePassword=true` after success.

## Transfer

Trace một protected flow từ cookie/session qua filter/provider/authorization đến handler. Sanitize
credential/cookie; không lưu auth state thật vào evidence hay portfolio.

## Gate S05

Từ 302/403 symptom, chỉ đúng filter/authorization/CSRF layer bằng evidence. Viết security matrix ở MockMvc và one Playwright smoke without duplicating every case E2E.

# S06 - Test pyramid của Laundry

## Mental model

Một UI happy path rất có giá trị nhưng chậm và khó bao phủ mọi invariant/concurrency/query edge. Chọn tầng thấp nhất vẫn chứng minh đúng contract.

| Tầng | Proof phù hợp | Không phù hợp |
| --- | --- | --- |
| Java unit/service | pricing, transition, ledger cap, issue/pickup guards, rollback | HTML/route/real query semantics |
| MockMvc/web | auth, CSRF, binding, status, redirect, view, service delegation | JPA locks/report SQL thật |
| PostgreSQL repository | filters, aggregates, lock, timezone, sorting | user-visible navigation |
| Spring integration | components + transaction + DB | mọi permutation UI |
| Playwright | critical user journey, semantics, browser/session/PRG | toàn bộ BR matrix |

## Worked example

```text
Service:
- eligible statuses
- positive amount/cap
- actor server-owned
- lock then recompute
- concurrent full balance

MockMvc:
- anonymous/role/CSRF
- invalid shape
- business conflict 409
- success redirect + flash

Repository:
- collection/refund aggregate order and exact sum

Playwright:
- Staff records a valid payment and sees derived balance
- one negative role/state smoke if high risk
```

Test names nói behavior, không lặp method name chung chung.

## Prediction

Cho BR-31, UC-25 và một report query, điền trước layer rẻ nhất đủ chứng minh, oracle, failure layer và
reason không chọn E2E cho mọi permutation. Sau đó đánh dấu một critical journey thực sự cần browser.

## Completion task

Lấy BR-31 pickup và phân tầng test. Tạo ít nhất một case fail-before/pass-after cho mỗi layer cần thiết.

Ghi layer/oracle vào <code>lab-kit/labs/spring-reverse/S06_TEST_LAYER_MATRIX.md</code>.

## Independent task

Thiết kế full proof cho UC-25 public tracking privacy: exact code+phone, generic mismatch, limited fields, no Staff/internal issue leak, cancelled money wording.

## Failure injection

- mock repository quá mức nên transaction/SQL never tested;
- repository test chạy H2 thay PostgreSQL;
- E2E chỉ assert URL;
- service test verify implementation calls thay business outcome;
- test fixture seed contradict canonical rules;
- suite order dependency.

## Transfer

Lấy một test matrix công ty/Laundry và tìm một case đang ở layer quá đắt hoặc quá mock. Đề xuất move
với trade-off rõ; không refactor repo nếu chưa được giao quyền.

## Gate S06

Từ một BR, chọn đúng layer cho từng risk và giải thích trade-off. Full build + relevant Playwright proof chạy từ clean state.

# S07 - Full reverse trace và random change

Dùng <code>lab-kit/labs/spring-reverse/S07_FULL_VERTICAL_TRACE.md</code> cho full chain và
<code>UC09_DISTURBANCE_MATRIX.md</code> cho disturbance evidence; không để output chỉ nằm trong chat.

## Mental model

Full trace không phải liệt kê framework. Nó nối một outcome/UC/BR với object/symbol/evidence thật ở
mỗi boundary, rồi chỉ first rejecting layer khi một input thay đổi.

### Full trace template

```text
1. Actor + observable outcome + UC/BR
2. Browser DOM/action
3. HTTP request: method/path/query/body/cookie/CSRF
4. Servlet container + request/response
5. Security filters and decision
6. DispatcherServlet + mapping/adapter
7. Binding/conversion/validation
8. Controller navigation/delegation
9. Service command/query + transaction + lock
10. Repository/JPA/query
11. PostgreSQL tables/constraints/rows
12. Response: status/Location/model/view
13. Thymeleaf HTML -> DOM
14. Test oracle at each needed layer
```

## Worked example

### Disturb matrix

Với cùng một POST, đổi từng biến riêng:

| Disturbance | Expected first rejecting layer | Evidence |
| --- | --- | --- |
| missing CSRF | Security filter | 403, Controller not hit |
| malformed number | binding/conversion | field error, service not hit |
| well-shaped but excessive payment | service | 409, no ledger row |
| concurrent stale balance | transaction/lock/service | one success, one conflict |
| DB constraint violation bug | persistence/rollback | generic error, zero partial commit |
| template missing after successful command | view on redirect GET | DB changed, GET 500; regression must expose navigation issue |

Hai row đầu minh họa cùng endpoint nhưng missing CSRF dừng trước Controller còn excessive payment
đi tới service và phải để ledger unchanged. Đây là cách kể failure path, không chỉ happy arrows.

## Prediction

Chọn một GET và một POST chưa trace. Điền full chain và disturbance matrix bằng prediction trước khi
đặt breakpoint/chạy test; ít nhất một disturbance phải dừng ở security, một ở binding/service và một
ở persistence/view.

## Completion task

Hoàn thành <code>S07_FULL_VERTICAL_TRACE.md</code> bằng symbol/path thật cho một GET + POST và
<code>UC09_DISTURBANCE_MATRIX.md</code> bằng evidence fail-before/pass-after. Chưa có implementation
repo thì task vẫn open; planning/card không thay runtime evidence.

## Independent task

### Random change drill

Ví dụ: “Receipt phải hiển thị normalized phone bên cạnh entered phone cho Staff, nhưng public tracking vẫn chỉ dùng snapshot phone và không lộ internal IDs.”

Trước code:

1. affected UC/BR/screens;
2. trusted source/data model;
3. migration needed hay projection-only;
4. Controller/service/repository/view/tests;
5. privacy risk;
6. docs/traceability impacted.

Không sửa file đầu tiên AI gợi ý. Vẽ propagation trước.

## Failure injection

Disturb đúng một variable mỗi lần: CSRF, malformed input, business guard, concurrent balance,
constraint hoặc template. Ghi first differing layer và no-partial-write/response evidence; restore
trước case kế.

## Transfer

Trong defense hoặc code review, bốc ngẫu nhiên một route và kể actor → HTTP → security → MVC →
service/transaction → DB → view → oracle trong ba phút. Với company repo, dùng terminology thật của
repo, không ép canonical Laundry lên nó.

## Gate S07

Trong 45 phút, trace một GET và một POST không note. Trong 45 phút khác, implement một approved random change nhỏ, run focused + related tests và explain blast radius.

# PHẦN V - Tám tuần tự làm full canonical Laundry

## Ranh giới cố định

Production stack:

```text
Java 21
Spring Boot 4.1.x Maven JAR
Spring MVC + Thymeleaf
Spring Security session + CSRF
Spring Data JPA/Hibernate
Jakarta Bean Validation
PostgreSQL + Flyway
JUnit 5 + Spring Boot Test + MockMvc
Bootstrap 5 + small project CSS
```

UI tiếng Việt; code/schema/formal docs tiếng Anh. Không JSP/Servlet controllers/JDBC adapter, React/SPA, JWT, REST-first UI, customer account, delivery, promotion, payment provider, notification, multi-branch, inventory, IoT hoặc AI feature.

Canonical baseline có 30 UC, 39 BR, 9 core tables, 5 order statuses và 2 issue statuses. Đây là scope contract, không phải danh sách feature để chia đều cho đẹp.

## Solo-full không có nghĩa code một mình trong im lặng

M muốn tự làm toàn bộ để hiểu. Trong team SWP, vẫn phải tuân contribution/process thật và không giành/xóa phần người khác. “Solo-full learning” nghĩa là:

- tự trace và tái hiện được mỗi vertical slice;
- có thể review/test/giải thích toàn bộ hệ thống;
- tự build một branch/lab copy hợp lệ khi team cho phép;
- không tuyên bố tác giả phần teammate làm;
- không đưa code team lên public portfolio khi chưa có quyền.

Nếu team chia task, m hoàn thành ownership trước rồi dùng thời gian học để reproduce/trace các slice khác.

## Definition of Done cho mỗi UC

```text
catalogue ID/name/actor
-> acceptance + BR
-> screen/navigation
-> route + typed form/query/view
-> Controller
-> business-named Service
-> Repository/entity/migration
-> tests đúng tầng
-> Playwright critical proof khi cần
-> demo seed
-> traceability/document update
-> no-agent teach-back
```

Page render hoặc CRUD row save chưa đủ.

## Wave execution card - bắt buộc trước khi chấm gate

Mỗi wave có một card thật trong <code>lab-kit/labs/swp-waves/</code>:

| Wave | Evidence artifact |
|---|---|
| W1 | <code>W1_EVIDENCE.md</code> |
| W2 | <code>W2_EVIDENCE.md</code> |
| W3 | <code>W3_EVIDENCE.md</code> |
| W4 | <code>W4_EVIDENCE.md</code> |
| W5 | <code>W5_EVIDENCE.md</code> |
| W6 | <code>W6_EVIDENCE.md</code> |
| W7 | <code>W7_EVIDENCE.md</code> |
| W8 | <code>W8_EVIDENCE.md</code> |

Card bắt đầu <code>Status: OPEN</code>. Chỉ đổi gate khi có repo/commit thật, command + test evidence,
failure variation và teach-back tương ứng; planning, reference hoặc patch do Agent tạo không tính là
learner mastery. Command cụ thể phải lấy từ repo implementation đã inspect, không invent ở coursebook.

# W1 - Scaffold và vertical core đầu tiên

## Scope

Tuần SWP 1 dựng project một stack và làm vertical slice public catalogue trước, sau đó login skeleton:

- fixed Maven/Spring stack;
- PostgreSQL/Flyway from empty DB;
- feature-package skeleton;
- timezone/Clock configuration;
- security baseline;
- shared layout/error pages;
- UC-05 public active services;
- bắt đầu UC-01 login.

## Tại sao UC-05 trước?

Nó nhỏ nhưng đi đủ view -> Controller -> service -> repository -> table -> migration -> test -> Playwright. M học pipeline thật mà chưa gánh transaction phức tạp.

## Evidence bắt buộc

- `STACK_PROFILE.txt` là `spring-boot`;
- no alternative frontend/adapter;
- V1 migration build empty PostgreSQL;
- inactive service hidden;
- VND/unit rendered Vietnamese;
- one service/repository/web/Playwright proof phù hợp;
- full reverse trace GET `/services`.

## Failure drills

- schema/entity mismatch;
- inactive row leaked;
- enum raw label;
- timezone machine default;
- service query in Controller.

## Gate W1

Clean clone builds, DB migrates, `/services` works and m trace được toàn chain. Chưa qua gate thì không scaffold 29 UC rỗng.

# W2 - Identity, Staff, customer và catalogue management

## UC coverage

- UC-01 Login;
- UC-02 Logout;
- UC-03 Change own password;
- UC-04 Manage Staff accounts;
- UC-06 Manage services/prices;
- UC-07 Manage customers;
- UC-08 Customer order history.

## High-value rules

- only STAFF/MANAGER accounts; Manager inherits Staff;
- session actor server-owned;
- active login and generic failure;
- temporary password + forced route + rotation;
- bootstrap Manager protected;
- phone normalized for search but not unique;
- customers have no login;
- catalogue history not rewritten after edit/deactivation.

## Build order

1. UserAccount/Flyway/security user details.
2. Login/logout and route matrix.
3. Own password/forced password.
4. Staff management Manager-only.
5. Customer normalization/search/history.
6. Manager catalogue commands.

## Tests

- service password/phone/catalogue rules;
- MockMvc session/CSRF/roles/forms;
- repository customer search/history stable order;
- Playwright login/role + customer/catalogue critical flow.

## Random change

“Phone input chấp nhận khoảng trắng/dấu chấm/dấu gạch, nhưng stored/public value phải đúng normalization; partial search không được persist.”

## Gate W2

STAFF/MANAGER matrix, temporary-password flow, customer duplicate phone và catalogue deactivation đều được chứng minh. M không dùng navigation visibility làm security proof.

# W3 - Order intake, search, detail và receipt

## UC coverage

- UC-09 Create laundry order;
- UC-10 View/search order list;
- UC-11 View order detail;
- UC-14 Print/reprint order receipt.

## Đây là vertical core quan trọng nhất

UC-09 phải:

- select existing customer;
- accept one or more KG/ITEM lines;
- lock selected active services ordered by ID;
- validate quantity and active state;
- snapshot contact/service/unit/price;
- round each line HALF_UP scale 0 then sum;
- generate global-sequence business code with shop-local date;
- insert order/items/initial status history atomically;
- **không ghi payment**;
- redirect detail, rồi UC-20 mới là payment action riêng.

## UI/HTTP boundary

Browser không submit trusted unit price, line amount, total, actor, time, status hay code. New Order customer-first; create/edit contact returns through allowlisted context, not arbitrary URL.

## Query/detail

Search combines filters and stable sort `received_at DESC, order_code DESC`, fixed page 20. Detail uses focused projections/child queries để tránh items x transactions x history x issues cartesian product.

Receipt dùng business code/snapshots/derived balance/store setting, không raw IDs.

## Tests

- pricing/quantity/rounding/atomic snapshot;
- catalogue lock/concurrent edit;
- form tampering ignored/rejected;
- order search filters/range/order;
- detail no N+1/repeated SQL contract;
- Playwright mixed KG + ITEM create and detail/receipt.

## Failure drills

- payment fields accidentally in new-order form;
- client total trusted;
- line rounds zero;
- duplicate service lines;
- one write succeeds before later failure;
- receipt uses current catalogue price instead of snapshot.

## Gate W3

From empty seeded environment, Staff creates mixed order, detail/receipt show exact snapshots/total and no payment row. M trace UC-09 fully and sửa một validation without AI.

# W4 - Revision, cancellation và processing lifecycle

## UC coverage

- UC-12 Update received order;
- UC-13 Cancel received order;
- UC-15 View processing queue;
- UC-16 Start processing;
- UC-17 Mark ready.

## Revision semantics

Submitted lines are complete desired list:

- existing line carries `orderItemId`; must belong to route order;
- service ID for existing line cannot change;
- retain old snapshots even if catalogue now inactive;
- new line needs active service/current snapshot;
- omitted existing line removed;
- changing service = remove old + add new;
- no duplicate service;
- recalculated total cannot fall below net paid;
- RECEIVED only.

## Lifecycle/queue

Queue contains RECEIVED/PROCESSING, promised time then code. Open issue blocks ready. Every transition locks order and writes immutable status history with actor/time.

## Tests

- exact complete-list revision matrix;
- retained inactive snapshot/new inactive rejected;
- foreign/tampered IDs;
- cancellation refund-due behavior/history reason;
- legal/illegal transition table;
- stable queue ordering/overdue display;
- Playwright revise/cancel/processing smoke.

## Random change

“Cho phép sửa care note của RECEIVED order nhưng không đổi service/quantity trong một quick-edit form.” Phải quyết định đây là route/form mới hay reuse command; giữ one business command, no generic action dispatcher.

## Gate W4

Lifecycle không backward, revision không reprice history, cancellation không delete. Concurrency/lock path được giải thích và tested.

# W5 - Issues, immutable money và pickup

## UC coverage

- UC-18 Record issue;
- UC-19 Resolve issue;
- UC-20 Record collection;
- UC-21 View payment history;
- UC-22 Print transaction receipt;
- UC-23 Record refund;
- UC-24 Complete pickup.

## Invariants

- issue only on RECEIVED/PROCESSING/READY;
- OPEN -> RESOLVED only; no rewash status;
- open issue blocks ready/pickup;
- ledger entries immutable positive collection/refund;
- CASH or BANK_TRANSFER_MANUAL only;
- collection on active order, amount <= remaining;
- refund Manager-only, cumulative <= collected, reason required;
- no money after COMPLETED;
- pickup READY + zero remaining + no open issue;
- same-order commands serialize.

## Tests

Service decision tables and concurrent collection are primary. MockMvc covers role/CSRF/status/PRG. PostgreSQL covers ledger aggregation/history order. Playwright covers one deposit -> issue -> resolve -> ready -> remaining payment -> pickup happy path plus selected negative.

## Failure drills

- mutable transaction row;
- refund as negative collection;
- money in UC-09 transaction;
- two collection submits both succeed;
- ready with open issue;
- completion leaves balance;
- Manager-only enforced only in UI.

## Gate W5

Full money/issue/pickup flow and each guard pass. Derived values match independent SQL/service oracle; no duplicate balance columns.

# W6 - Public tracking, dashboard, reports, settings và schedule

## UC coverage

- UC-25 Public tracking;
- UC-26 Operational dashboard;
- UC-27 Revenue report;
- UC-28 Order performance report;
- UC-29 Store settings;
- UC-30 Daily pickup schedule.

## Privacy/time/query risks

Public tracking uses exact order code + normalized snapshot phone, same generic mismatch and limited view. No IDs, Staff, internal issue note or other customer.

Revenue filters transaction timestamp in half-open local-date range:

```text
gross = COLLECTION sum
refund = REFUND sum
net = gross - refund
```

Order performance cohort uses `received_at`; completion denominator excludes cancelled. Service demand groups distinct service ID + snapshot name + unit; never combine KG and ITEM.

Pickup schedule uses selected local date non-cancelled rows plus carry-over only for today, stable promise/code order.

## Tests

- exact/generic public mismatch and privacy;
- fixed Clock dashboard six metrics/attention order;
- timezone boundary near midnight;
- refund on order from another receipt date still counted by transaction date;
- zero/empty denominator;
- distinct services same snapshot name not merged;
- selected-date/carry-over pagination;
- settings display-only.

## Failure drills

- revenue by order date/status;
- inclusive `23:59:59` end instead of next-day exclusive;
- OS timezone;
- cancelled order tells customer to pay mathematical remainder;
- public leak issue details;
- opening hours used as hidden promise validation.

## Gate W6

All report numbers reproducible by fixed seed/SQL; public view privacy proven; time tests pass in non-Vietnam machine timezone.

# W7 - Full regression, documentation và demo integrity

## Freeze before document generation

Freeze behavior/schema/routes before final backlog, RDS, SDS, screenshots and diagrams. Source-of-truth order:

```text
scope + UC + BR
-> screen/route/form/data contracts
-> code + Flyway + tests
-> verified traceability
-> backlog/RDS/SDS
-> diagrams/final package
```

Do not invent class/sequence diagrams before code exists. Use real symbols/flows.

## Regression package

- service transition/money/rule matrix;
- MockMvc auth/binding/CSRF/error/redirect;
- PostgreSQL query/lock/time/report tests;
- one full Spring integration path;
- 20-30 high-value Playwright scenarios, not 30 UCs blindly;
- clean migration seed/demo;
- CI artifacts.

## Demo route

```text
login -> customer -> mixed order -> deposit -> processing
-> issue -> resolve -> ready -> remaining collection -> pickup
-> public track -> manager reports
```

Use alternate seeded order for cancellation/refund so main flow remains coherent.

## Documentation evidence

Every UC name/actor/BR/route/service/table/test agrees. UI screenshots Vietnamese, formal identifiers English. No raw IDs, stale flash, empty report or debug panel.

## Gate W7

Plan/code/docs audit green is minimum. M chọn ngẫu nhiên five UCs and trace across every artifact. Clean environment runs without hand-edit DB.

# W8 - Defense và graduation

## 150-minute no-agent simulation

| Part | Time | Evidence |
| --- | ---: | --- |
| closed-book canonical map | 15 | actors, states, tables, critical rules |
| unfamiliar UC trace | 25 | browser-to-DB map |
| random approved change | 45 | small diff + tests |
| seeded bug | 30 | hypothesis/evidence/regression |
| Playwright flow | 20 | independent stable test |
| teach-back | 15 | defense answer |

## Questions m phải trả lời được

- Vì sao customer không có account?
- Vì sao Manager inherit Staff nhưng refund vẫn Manager-only?
- Vì sao UC-09 không ghi payment?
- Vì sao snapshot contact/service/price?
- Vì sao line round trước sum?
- Vì sao balance derive từ immutable ledger?
- Vì sao lock trước reload guards?
- Vì sao no backward status?
- Vì sao report dùng hai cohort timestamp khác nhau?
- Vì sao DB UTC nhưng business zone Việt Nam?
- Vì sao Playwright không thay service/repository tests?
- Vì sao không thêm REST/React/JWT/Docker feature chỉ để “đủ stack”? 

## Final canonical coverage ledger

| Wave | Use cases |
| --- | --- |
| W1-W2 | UC-01, UC-02, UC-03, UC-04, UC-05, UC-06, UC-07, UC-08 |
| W3 | UC-09, UC-10, UC-11, UC-14 |
| W4 | UC-12, UC-13, UC-15, UC-16, UC-17 |
| W5 | UC-18, UC-19, UC-20, UC-21, UC-22, UC-23, UC-24 |
| W6 | UC-25, UC-26, UC-27, UC-28, UC-29, UC-30 |

## Graduation verdict

Pass SWP course và pass v4 không giống nhau.

- **Course pass:** team deliverables meet school rubric.
- **V4 learned:** m explain, modify, test and debug unfamiliar slice without AI patch.

Nếu course đã pass nhưng random-change/seeded-bug gate rớt, giữ project làm phòng gym thêm. Nếu gate đạt nhưng hồ sơ chưa có job, kỹ năng vẫn có giá trị; job timing không được dùng để phủ nhận learning evidence.
