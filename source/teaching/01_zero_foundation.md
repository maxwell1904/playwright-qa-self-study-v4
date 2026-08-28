# Part I - Nền tảng JavaScript/TypeScript cho Automation Tester từ zero

> Draft cho Self-Study Edition v4. File này là learner volume, chưa phải đáp án. Các bài completion và independent phải được làm trong lab kit; lời giải đầy đủ chỉ mở ở H5 sau timebox.

## Part I giúp m làm được gì?

Part này không cố biến m thành frontend developer. Nó xây đúng lượng JavaScript và TypeScript cần để m:

- đọc một Playwright spec mà không bị từng ký hiệu làm nghẽn;
- tự viết helper, test data và assertion có chủ đích;
- hiểu Promise, <code>async</code>, <code>await</code> thay vì thêm <code>await</code> theo cảm giác;
- đọc TypeScript error và dùng type để chặn sai sót trước khi chạy;
- phân biệt lỗi môi trường, syntax, type, test và lỗi behavior;
- debug từ expected/actual/hypothesis/evidence thay vì sửa mò;
- chuyển kiến thức sang flow Laundry và suite ở công ty.

Ví dụ trong Part I dùng service, order, status, phone và transaction của miền Laundry để giảm số context m phải giữ. Đây vẫn là **foundation sandbox**. Production Laundry giữ nguyên Java 21, Spring Boot, Thymeleaf, PostgreSQL và các business rule canonical. TypeScript chỉ là ngôn ngữ của automation suite. Không copy phép tính JavaScript thành nguồn giá chính thức ở browser, không thêm REST endpoint chỉ để bài test dễ viết.

## Cách học mỗi chapter

Mỗi chapter chạy theo cùng một vòng:

1. Đọc mental model và tự kể lại bằng lời của m.
2. Đọc worked example theo từng bước, không copy vội.
3. Ghi prediction trước khi chạy bất kỳ snippet nào.
4. Làm completion task với khung có sẵn.
5. Đóng example và làm independent task.
6. Kích hoạt failure injection, ghi expected/actual/hypothesis/evidence.
7. Làm transfer sang một ngữ cảnh khác.
8. Chấm gate và đặt review D+1, D+3, D+7.

Thời lượng ghi ở mỗi chapter là **active practice**, đã gồm prediction, bug và transfer. Nó không phải thời gian đọc lướt. Một chapter 4 giờ nên được chia thành bốn đến sáu phiên. Khi mệt, chỉ làm một prediction hoặc một failure case rồi ghi restart line.

## Bản đồ artifact executable - authority cho Part I

Mọi path dưới đây tính từ root <code>lab-kit/</code>. Nếu text bài học và file tree không đồng ý,
dừng lại và chạy validator; không tự đoán một tên file khác. <code>work/</code> là chỗ m sửa,
<code>reference/</code> chỉ mở ở H5. Starter được phép đỏ vì TODO; reference bắt buộc xanh.

| ID | Completion/independent artifact thật | Focused command |
|---|---|---|
| QA00 | <code>foundations/work/qa00.mjs</code> | <code>npm run lab:qa00</code> |
| JS01 | <code>foundations/work/js01.mjs</code>, <code>foundations/work/js01_service_snapshot.mjs</code> | <code>npm run lab:js01</code> |
| JS02 | <code>foundations/work/js02.mjs</code> | <code>npm run lab:js02</code> |
| JS03 | <code>foundations/work/js03.mjs</code> | <code>npm run lab:js03</code> |
| JS04 | <code>foundations/work/js04.mjs</code> | <code>npm run lab:js04</code> |
| JS05 | <code>foundations/work/js05.mjs</code> và ba module <code>js05-*.mjs</code> cạnh nó | <code>npm run lab:js05</code> |
| JS06 | <code>foundations/work/js06.mjs</code> | <code>npm run lab:js06</code> |
| JS07 | production helper <code>foundations/work/js07.mjs</code>; m viết <code>foundations/work/js07.learner.test.mjs</code> | <code>npm run lab:js07</code> |
| JS08 | helper/plan <code>foundations/work/js08.mjs</code> và browser spec <code>tests/work/foundation/js08_bridge.spec.ts</code> | <code>npm run lab:js08</code> |
| TS01 | <code>foundations/work/ts01.ts</code> và <code>foundations/type-tests/ts01.learner-errors.ts</code> | <code>npm run lab:ts01</code> |
| TS02 | <code>foundations/work/ts02.ts</code> và <code>foundations/type-tests/ts02.learner-errors.ts</code> | <code>npm run lab:ts02</code> |
| TS03 | <code>foundations/work/ts03.ts</code> | <code>npm run lab:ts03</code> |
| TS04 | helper <code>foundations/work/ts04.ts</code>, type-test <code>foundations/type-tests/ts04.learner-errors.ts</code> và browser spec <code>tests/work/foundation/ts04_bridge.spec.ts</code> | <code>npm run lab:ts04</code> |

Các file <code>foundations/tests/</code> là executable contract, không phải chỗ sửa để ép bài xanh.
Riêng JS08/TS04 có hai tầng: giải helper bằng
<code>npm run foundation:test:work -- JS08</code>/<code>-- TS04</code>, sau attempt browser mới đổi
<code>test.fixme</code> thành <code>test</code> và chạy focused command. Focused command còn skip/fixme
sẽ đỏ có chủ đích.

## Evidence tối thiểu cho Part I

Mỗi chapter chỉ được đánh dấu pass khi có:

- file bài làm chạy được;
- prediction viết trước lần chạy đầu;
- ít nhất một failure note;
- independent task không dựa vào walkthrough;
- transfer task khác tên biến hoặc data shape của worked example;
- teach-back từ ba đến năm câu.

Không tính là đã học nếu chỉ đọc hiểu, xem đáp án, hoặc làm test xanh sau khi AI đưa full patch.

## Calibration cá nhân: zero thật, đã lệ thuộc AI lâu, còn ba tuần trước SWP

Part I giả định m **chưa có nền lập trình đáng tin để dựa vào**. Không có placement skip. Tất cả QA00, JS01-JS08 và TS01-TS04 đều bắt buộc vì chúng tạo cùng một chain: chạy code → hiểu data/control flow → tách function/module → hiểu async → viết test → dùng type → đọc Playwright.

Ba tuần không đủ để “học xong JavaScript” theo nghĩa rộng. Nó đủ để tạo một runway có kiểm chứng trước khi SWP bắt đầu, nếu m dành khoảng **55-63 giờ active practice tổng**, tức một sprint khá nặng 18-21 giờ mỗi tuần:

| Tuần | Chapters bắt buộc | Sản phẩm cuối tuần | Giờ mục tiêu |
|---|---|---|---:|
| 1 | QA00, JS01-JS04 | Chạy lab độc lập; viết helper và xử lý order/service data; một no-AI drill 30-45 phút | 18-20 |
| 2 | JS05-JS08, retrieval JS01-04 | Module + error journal; async repair; unit-test mini suite; no-AI drill 45 phút | 19-22 |
| 3 | TS01-TS04, Foundation capstone | Strict typecheck; typed Playwright spec; seeded-bug diagnosis; no-AI capstone 90 phút | 18-21 |

Nếu quỹ giờ thực tế thấp hơn, m vẫn đi đúng thứ tự và mang phần chưa pass sang tuần đầu SWP; không tuyên bố runway hoàn tất giả. Nếu một gate chưa pass, m không giả vờ “xong chapter” để giữ lịch. Trong ba tuần, ưu tiên giữ đủ independent/failure/transfer và cắt bớt số biến thể phụ. Khi SWP bắt đầu, repair queue tiếp tục chạy song song; không reset và không bỏ lỗ hổng.

## Anti-brainrot contract

Vì m đã dùng AI thay suy nghĩ trong thời gian dài, v4 dùng constraint mạnh hơn một khóa học bình thường:

1. **Prediction luôn no-AI.** Viết output/nhánh/type trước khi chạy và trước khi hỏi.
2. **Hai mươi phút đầu của completion là no-AI.** Được đọc error, docs trong pack và code m đã viết.
3. **Independent task và transfer là no-AI cho tới khi có một attempt chạy được hoặc một bug note đầy đủ.**
4. Không paste code do AI sinh vào lab. Nếu đã xem snippet H4/H5, đóng nó rồi tự gõ lại từ mental model.
5. Trước khi xin hint phải đưa: expected, actual, hypothesis, evidence và câu hỏi hẹp. Chỉ xin H1/H2 trước.
6. Một patch có AI hỗ trợ chỉ được giữ khi m giải thích từng decision, xóa một phần quan trọng và tự dựng lại, rồi làm variation khác không AI.
7. Không dùng câu “AI làm cho t”. Bug journal phải ghi root cause ở code/runtime/data nào.
8. Mỗi tuần có một random drill không AI, không note, không autocomplete chat. Thời gian hết thì dừng và ghi gap; không lén hoàn tất bằng AI rồi tự chấm pass.

AI vẫn hữu ích cho evidence review, đặt câu hỏi Socratic, kiểm tra reasoning và review diff sau attempt. Mục tiêu không phải cấm công cụ; mục tiêu là lấy lại khả năng tự tạo hypothesis và giữ một mental model trong đầu.

## Definition of ready khi SWP bắt đầu

Sau ba tuần, m chưa cần thuộc mọi API. M cần chứng minh được:

- từ file trắng viết function xử lý data nhỏ và test nó;
- đọc code có object, array, callback, module, Promise và <code>await</code> mà không đoán từng ký hiệu;
- sửa một syntax/module/type/test failure bằng first meaningful error;
- dùng TypeScript strict để model một data shape và narrow <code>unknown</code>;
- đọc một Playwright spec và kể runner, callback, fixture, locator, action, assertion;
- làm một variation 90 phút không AI và giải thích chỗ chưa biết.

Đây là minimum entry gate để vừa học SWP theo full browser-to-database chain vừa tiếp tục Playwright, không phải giấy chứng nhận “đã giỏi JavaScript”.

---

# QA00 - Máy của m đang chạy cái gì?

**Thời lượng thường gặp:** 2-3 giờ  
**Prerequisite:** Không có.  
**Exit outcome:** M có thể đứng đúng thư mục, chạy đúng lệnh, đọc error theo tầng và lưu evidence đầu tiên mà không cần hiểu JavaScript trước.

## Mental model

Khi m gõ một lệnh, máy không hiểu ý định chung chung như “chạy bài học”. Nó nhận một command cụ thể trong một thư mục cụ thể.

~~~text
Terminal
→ shell tìm command
→ Node/npm đọc file hoặc package.json
→ parser đọc syntax
→ module loader tìm import
→ chương trình/test runner chạy
→ assertion so actual với expected
~~~

Một lỗi ở tầng trên làm tầng dưới chưa bao giờ chạy. Nếu npm báo không tìm thấy <code>package.json</code>, việc sửa locator là vô nghĩa. Nếu parser báo thiếu dấu ngoặc, assertion chưa được đăng ký. Nếu assertion fail, điều đó lại cho biết runtime và test runner đã chạy đủ xa.

Năm loại feedback m phải tập phân biệt:

| Tầng | Dấu hiệu thường gặp | Câu hỏi đầu tiên |
|---|---|---|
| Shell/thư mục | command not found, file not found | M đang đứng ở đâu và command có tồn tại không? |
| npm/package | missing script, package.json not found | Script tên gì và package hiện tại là package nào? |
| Syntax/module | SyntaxError, module not found, export mismatch | File có parse được và import có trỏ đúng không? |
| Type/test collection | TypeScript error, no tests found | Code có đạt contract compile và test có được đăng ký không? |
| Behavior/assertion | expected X, received Y | Actual khác expected ở đâu, evidence nào giải thích? |

Terminal không phải nơi “dành cho hacker”. Nó là một cửa sổ đưa command cho máy và nhận feedback có thể copy lại. Ba command định vị cơ bản trên macOS/Linux:

~~~sh
pwd
ls
node --version
~~~

- <code>pwd</code> cho biết thư mục hiện tại.
- <code>ls</code> cho biết các entry ở đó.
- <code>node --version</code> xác nhận runtime có thể được gọi.

npm là công cụ đọc <code>package.json</code>, cài dependency và gọi các script đã được project đặt tên. <code>npm run lab:qa00</code> không phải câu thần chú của npm; nó chỉ tìm key <code>lab:qa00</code> trong phần <code>scripts</code> rồi chạy command tương ứng.

## Worked example

Lab kit thật giữ worked example ở:

~~~text
lab-kit/
├── package.json
└── foundations/
    └── worked/
        └── qa00.mjs
~~~

Một worked example tối thiểu có thể in các tầng feedback như <code>foundations/worked/qa00.mjs</code>.
Đoạn rút gọn:

~~~js
console.log('QA00 ready');
console.log('Current lesson: runtime and feedback');
~~~

Trong <code>package.json</code> có script:

~~~json
{
  "scripts": {
    "lab:qa00": "node foundations/scripts/run-suite.mjs work QA00"
  }
}
~~~

Khi đứng trong <code>lab-kit</code> và chạy:

~~~sh
npm run lab:qa00
~~~

npm đọc script, gọi Node, Node đọc file và thực hiện hai lệnh <code>console.log</code> theo thứ tự từ trên xuống. Expected output phần chương trình là:

~~~text
QA00 ready
Current lesson: runtime and feedback
~~~

Nếu m đứng ở thư mục cha không có <code>package.json</code>, chương trình chưa chạy. Nếu script ghi sai tên file, npm đã chạy nhưng Node không load được module. Hai lỗi có symptom khác nhau vì dừng ở hai tầng khác nhau.

## Prediction - ghi trước khi chạy

Không chạy lệnh trong ba phút đầu. Viết câu trả lời:

1. Nếu đổi thứ tự hai dòng <code>console.log</code>, output thay đổi thế nào?
2. Nếu đổi tên file target thành <code>qa00-old.mjs</code> nhưng không sửa script/contract, tầng nào fail?
3. Nếu đứng ở <code>foundations/work</code> rồi chạy <code>npm run lab:qa00</code>, npm sẽ tìm <code>package.json</code> nào?
4. Nếu Node in đủ hai dòng rồi terminal vẫn báo exit code 1, “thấy output” có đủ để kết luận bài pass không?

Sau khi chạy, ghi thêm một dòng: prediction nào đúng, prediction nào khác runtime.

## Completion task

Mở starter thật <code>foundations/work/qa00.mjs</code> (đây là bài receipt, không có file
<code>starter/receipt.mjs</code> ẩn ở nơi khác):

~~~js
export const receiptLines = [
  'Order code: TODO',
  'Customer: TODO',
  'Status: TODO'
];

for (const line of receiptLines) console.log(line);
~~~

Hoàn thành sao cho exact output là:

~~~text
Order code: LD-001
Customer: Nguyễn An
Status: Đã tiếp nhận
~~~

Constraints:

- Không đổi tên file.
- Không sửa executable contract <code>foundations/tests/qa00.test.mjs</code>.
- Chạy bằng npm script, không double-click file.
- Lưu command và output vào evidence note.

Mục tiêu không phải học biến ở đây; m chỉ tập edit → run → compare → record.

## Independent task

Không nhìn lại worked example trong mười phút:

1. Dùng <code>pwd</code> và <code>ls</code> để tìm lab kit.
2. Tìm script kiểm tra reference suite trong <code>package.json</code>.
3. Chạy script đó.
4. Ghi bốn thứ: command, exit status, first meaningful output, artifact hoặc folder được tạo.
5. Viết restart line đủ cụ thể để ngày mai m biết mở file nào và làm gì.

Một restart line yếu: “Mai học tiếp JS.”  
Một restart line tốt: “Mở <code>foundations/work/js01.mjs</code>, ghi prediction cho ba biểu thức rồi chạy <code>npm run lab:js01</code>.”

## Failure injection

Lần lượt gây bốn lỗi, mỗi lần chỉ đổi một thứ:

1. Chạy script từ thư mục không chứa package hiện tại.
2. Gõ sai một ký tự trong tên npm script.
3. Xóa dấu nháy đóng của một chuỗi.
4. Đổi tên file nhưng giữ script cũ.

Với mỗi lỗi, ghi:

~~~text
Expected:
Actual:
Failure layer:
First meaningful line:
Smallest correction:
Proof after correction:
~~~

Không chụp mỗi dòng cuối màu đỏ. Dòng cuối thường chỉ nói process thất bại; first meaningful line mới nói vì sao.

## Transfer

Trong một repo thật m đang dùng ở công ty hoặc SWP391, chỉ làm read-only:

- xác định root dựa trên file build/package;
- tìm command khởi động hoặc command test đã được project định nghĩa;
- kể project dùng runtime/build tool nào;
- không tự cài hoặc nâng version nếu chưa biết contract của repo.

Nếu repo là Spring Maven, m có thể thấy <code>pom.xml</code> thay vì <code>package.json</code>. Mental model vẫn giống: đứng đúng root, gọi đúng tool, đọc lỗi theo tầng.

## Gate QA00

Pass khi m làm được tất cả mà không có walkthrough:

- đứng đúng lab root và chứng minh bằng output;
- giải thích npm script đến từ đâu;
- gây và phân loại được ít nhất ba lỗi khác tầng;
- sửa đúng một biến mỗi lần và rerun;
- lưu một evidence note và restart line rõ;
- sau D+1, chạy lại completion task không nhìn hướng dẫn.

Nếu fail, repair đúng tầng bị yếu. Không cài lại toàn bộ Node chỉ vì một script bị gõ sai.

### No-AI drill QA00 - 20 phút

Từ terminal mới, không mở chat: tìm lab root, chạy QA00, gây một module-not-found, sửa, rồi viết restart line. Chỉ dùng output của terminal làm evidence.

---

# JS01 - Value, variable và biểu thức: chương trình đang giữ dữ liệu gì?

**Thời lượng thường gặp:** 3-4 giờ  
**Prerequisite:** QA00  
**Exit outcome:** M phân biệt được value với variable, chọn <code>const</code>/<code>let</code>, dự đoán type và kết quả biểu thức cơ bản trước khi chạy.

## Mental model

Value là dữ liệu runtime đang xử lý. Variable là một cái tên trỏ tới value để code có thể dùng lại.

Các primitive m gặp nhiều trong automation:

| Loại | Ví dụ | Dùng cho |
|---|---|---|
| string | <code>'LD-001'</code> | text, code, URL, label |
| number | <code>25000</code> | count, timeout, số tiền lab |
| boolean | <code>true</code> | điều kiện có/không |
| undefined | chưa có value | property/return chưa được cung cấp |
| null | chủ động biểu diễn không có | API/domain contract cho phép rỗng |

<code>const</code> nghĩa là binding không được trỏ sang value khác. Nó không có nghĩa mọi object phía sau đều bất biến; phần đó học ở JS04. Dùng <code>const</code> mặc định. Chỉ dùng <code>let</code> khi chính binding cần đổi trong flow.

~~~js
const orderCode = 'LD-001';
let attempt = 1;
attempt = attempt + 1;
~~~

Operator tạo expression mới:

- số học: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>;
- so sánh: <code>===</code>, <code>!==</code>, <code>&gt;</code>, <code>&lt;=</code>;
- logic: <code>&amp;&amp;</code>, <code>||</code>, <code>!</code>;
- nối chuỗi: <code>'Order ' + orderCode</code>.

Ưu tiên strict equality <code>===</code>. JavaScript có coercion: nó đôi khi tự đổi type để thực hiện phép toán. Coercion có thể tiện nhưng nguy hiểm khi test data từ HTML luôn bắt đầu là text.

Phép so sánh **tự tạo ra một boolean**; chưa cần <code>if/else</code> để có
<code>true</code> hoặc <code>false</code>:

~~~js
const orderTotal = 120000;
const collectedAmount = 50000;
const remainingAmount = orderTotal - collectedAmount;
const fullyPaid = remainingAmount === 0;

console.log(remainingAmount); // 70000
console.log(fullyPaid);       // false
~~~

Đọc dòng cuối như một câu hỏi: “<code>remainingAmount</code> có bằng đúng 0 không?”.
JavaScript trả lời câu hỏi đó bằng boolean. JS02 mới dùng boolean để chọn hành động bằng
<code>if/else</code>.

~~~js
console.log('2' + 3); // '23'
console.log('2' * 3); // 6
console.log('2' === 2); // false
~~~

Một test đáng tin không dựa vào việc nhớ ngẫu nhiên operator nào coercion theo cách nào. Khi boundary trả string, parse hoặc validate có chủ đích.

## Worked example

Ta tạo summary cho một service item trong sandbox:

~~~js
const serviceCode = 'UI_QUAN_AO';
const serviceName = 'Ủi quần áo';
const unitPrice = 12000;
const quantity = 3;
const active = true;

const lineAmount = unitPrice * quantity;
const summary = serviceCode + ' | ' + serviceName + ' | ' + lineAmount + ' VND';

console.log(summary);
console.log(typeof serviceCode);
console.log(typeof lineAmount);
console.log(active === true);
~~~

Đọc theo data flow:

1. Năm binding giữ input.
2. <code>lineAmount</code> phụ thuộc hai number.
3. Khi nối với string, number được biểu diễn thành text trong summary.
4. <code>typeof</code> giúp quan sát type runtime, không thay validation.
5. Biểu thức cuối tạo boolean.

Expected output:

~~~text
UI_QUAN_AO | Ủi quần áo | 36000 VND
string
number
true
~~~

Trong production Laundry, server Java/<code>BigDecimal</code> mới là pricing authority. Phép tính trên chỉ là bài data-flow và test fixture, không cấp quyền đưa giá authoritative ra browser.

## Prediction

Ghi exact value và type, rồi mới chạy:

~~~js
const priceText = '25000';
const quantity = 2;

console.log(priceText + quantity);
console.log(Number(priceText) + quantity);
console.log(priceText * quantity);
console.log(priceText === 25000);
console.log(Boolean('false'));
~~~

Giải thích từng dòng bằng rule, không dùng câu “JavaScript kỳ vậy”. Đặc biệt: string <code>'false'</code> không phải boolean <code>false</code>.

## Completion task

Hoàn thành starter, chỉ thay phần <code>TODO</code>:

Artifact: <code>foundations/work/js01.mjs</code>. Independent task tiếp tục ở
<code>foundations/work/js01_service_snapshot.mjs</code>; chạy cả hai bằng <code>npm run lab:js01</code>.

~~~js
const orderCode = 'LD-20260813-000123';
const customerName = 'Trần Thu Hà';
const collectedAmount = 50000;
const orderTotal = 120000;

const remainingAmount = TODO;
const fullyPaid = TODO;
const label = TODO;

console.log(remainingAmount);
console.log(fullyPaid);
console.log(label);
~~~

Expected:

~~~text
70000
false
LD-20260813-000123 | Trần Thu Hà | remaining 70000 VND
~~~

Constraints:

- Không ghi thẳng <code>70000</code> vào <code>remainingAmount</code>.
- Không ghi thẳng <code>false</code> vào <code>fullyPaid</code>.
- Label phải dùng các variable đã có.
- Không dùng <code>if/else</code>; task này chỉ tạo value mới bằng expression.
- Trong starter thật, từ khóa <code>export</code> chỉ là test glue để lab đọc value. Không xóa,
  không sửa và chưa cần hiểu nó ở JS01; module được dạy ở JS05.

## Independent task

Mở file **đã có sẵn** <code>foundations/work/js01_service_snapshot.mjs</code>; không tạo
<code>service-snapshot.mjs</code> khác. “Snapshot” ở đây chỉ là một nhóm value ghi lại tên,
đơn vị và giá tại một thời điểm. Trong JS01, m chỉ luyện data flow; chưa học object.

File gồm bảy binding riêng:

- <code>serviceCode</code>: mã dạng string;
- <code>serviceName</code>: tên tiếng Việt dạng string;
- <code>pricingUnit</code>: chọn string <code>'KG'</code> hoặc <code>'ITEM'</code>;
- <code>unitPrice</code>: number;
- <code>quantity</code>: number;
- <code>lineAmount</code>: expression lấy <code>unitPrice * quantity</code>, không ghi thẳng kết quả;
- <code>active</code>: boolean.

Các từ khóa <code>export</code> là test glue; không sửa và chưa cần hiểu. Bài này không yêu
cầu m tự viết function, array hay module.

Làm đúng thứ tự sau:

1. Chọn value cho sáu input binding và hoàn thành expression <code>lineAmount</code>.
2. Trước khi chạy, dự đoán chính xác bốn dòng: identity, unit, line amount và type của quantity.
3. Chạy <code>npm run lab:js01</code>. Trạng thái number đúng phải xanh.
4. Ghi prediction mới, rồi **tạm thời** đổi <code>quantity</code> từ number <code>3</code> thành
   string <code>'3'</code>; không sửa phép nhân.
5. Chạy <code>node foundations/work/js01_service_snapshot.mjs</code>. Quan sát line amount có
   thể vẫn trông đúng do coercion, nhưng dòng type đã thành <code>string</code>.
6. Ghi failure note: expected, actual và vì sao output số đúng chưa chứng minh input đúng type.
7. **Đổi <code>quantity</code> lại thành number**, rồi chạy lại <code>npm run lab:js01</code>.
   Đây mới là trạng thái cuối để chấm gate.

## Failure injection

Dùng playground chính thức <code>foundations/work/js01_failure_playground.mjs</code> để không
làm bẩn hai artifact đang được chấm. Đứng tại <code>lab-kit/</code>, ghi prediction rồi chạy:

~~~bash
node foundations/work/js01_failure_playground.mjs
~~~

Mỗi lần chỉ gây **một** lỗi. Sau khi ghi expected, actual và first meaningful error/output,
khôi phục block đó trước khi chuyển sang block kế tiếp. JS01 chỉ quan sát value, type, binding
và expression; không thêm <code>if</code>, function, <code>return</code> hoặc <code>throw</code>.

### Failure A - nối chuỗi ngoài ý muốn

~~~js
const quantityFromInput = '2';
const nextQuantity = quantityFromInput + 1;
console.log(nextQuantity);
~~~

Ghi expected trước. Sau đó conversion có chủ đích và quan sát riêng hai boolean, chưa cần
<code>if/else</code> hoặc <code>throw</code>:

~~~js
const convertedQuantity = Number(quantityFromInput);
const isFiniteNumber = Number.isFinite(convertedQuantity);
const isPositive = convertedQuantity > 0;

console.log(convertedQuantity);
console.log(isFiniteNumber);
console.log(isPositive);
~~~

Lặp lại với <code>'abc'</code>. <code>Number.isFinite(...)</code> trả <code>false</code>, nên m
đã có evidence rằng conversion không tạo một number hữu hạn. Cách **chọn hành động** khi flag
false thuộc JS02; cách ném/bắt error thuộc JS05.

### Failure B - reassign const

~~~js
const status = 'RECEIVED';
status = 'PROCESSING';
~~~

Đây là lỗi binding, chưa phải business rule về transition.

### Failure C - typo tên variable

~~~js
const serviceName = 'Giặt sấy quần áo';
console.log(servceName);
~~~

Đây là <code>ReferenceError</code>: code hỏi một binding chưa từng được khai báo. Ghi đúng tên
identifier mà runtime báo và phân biệt nó với value của <code>serviceName</code>. Property typo
trên object được để sang JS04; TypeScript sẽ bắt nhiều typo trước runtime từ TS01.

## Transfer

Đọc một Playwright spec có các value sau và phân loại chúng mà chưa giải thích API:

~~~js
const orderCode = 'LD-001';
const expectedStatus = 'Đã tiếp nhận';
const timeout = 5000;
const shouldBeVisible = true;
~~~

Trả lời:

- value nào là test input;
- value nào là expected outcome;
- value nào là execution configuration;
- vì sao không nên đổi <code>expectedStatus</code> dựa trên text thực tế vừa đọc từ trang.

Nếu expected được tính từ actual của chính UI, test có thể tự đồng ý với bug.

## Gate JS01

Pass khi m:

- giải thích value khác variable thế nào;
- chọn <code>const</code> mặc định và đưa ví dụ thật cần <code>let</code>;
- dự đoán đúng ít nhất 4/5 coercion cases;
- chuyển string input sang number và quan sát validity flag thay vì tin coercion ngầm;
- hoàn thành independent task không copy worked example;
- kể một cách type sai có thể tạo false confidence trong automation.

Review D+1: <code>'2' + 1</code> và <code>'2' * 1</code>.  
Review D+3: <code>const</code> khóa cái gì?  
Review D+7: Viết lại completion task từ file trắng.

### No-AI drill JS01 - 25 phút

Từ file trắng, tạo sáu binding cho một service line, tính một derived value và in type của ba expression. Sau đó tự cài string-number bug, conversion có chủ đích và in validity flag. Chưa dùng <code>if/else</code> hoặc <code>throw</code>.

---

# JS02 - Condition và loop: chương trình chọn nhánh nào?

**Thời lượng thường gặp:** 4 giờ  
**Prerequisite:** JS01  
**Exit outcome:** M dự đoán được nhánh <code>if</code>, dùng boolean rõ nghĩa, lặp qua một danh sách nhỏ và không viết assertion thay đổi theo actual behavior.

## Mental model

Chương trình chạy tuần tự cho tới khi control flow yêu cầu chọn nhánh hoặc lặp.

~~~text
input values
→ boolean condition
→ đúng thì chạy branch A
→ sai thì chạy branch B
~~~

Một condition tốt đọc như câu hỏi có đáp án yes/no:

~~~js
const isReceived = status === 'RECEIVED';
const canStartProcessing = isReceived && accountActive;
~~~

<code>if</code> không “biết” business rule. Nó chỉ đánh giá expression. Chính code của m phải biểu diễn rule đúng.

~~~js
if (canStartProcessing) {
  console.log('Allowed');
} else {
  console.log('Rejected');
}
~~~

JavaScript có khái niệm truthy/falsy. Các value như <code>false</code>, <code>0</code>, chuỗi rỗng, <code>null</code>, <code>undefined</code> là falsy. Nhiều value khác là truthy, kể cả chuỗi <code>'false'</code> và <code>'0'</code>. Với business decision, ưu tiên comparison rõ thay vì dựa vào truthiness mơ hồ.

Loop dùng khi cùng một operation áp dụng cho nhiều item. Ở chapter này chỉ dùng <code>for...of</code>; array methods sâu hơn nằm ở JS04.

~~~js
const statuses = ['RECEIVED', 'PROCESSING', 'READY_FOR_PICKUP'];

for (const currentStatus of statuses) {
  console.log(currentStatus);
}
~~~

Mỗi vòng, <code>currentStatus</code> giữ một value từ danh sách. Loop không tự tạo assertion hoặc oracle; m vẫn phải quyết định outcome nào đúng.

## Worked example

Ta kiểm tra một command “start processing” ở mức logic sandbox:

~~~js
const role = 'STAFF';
const accountActive = true;
const orderStatus = 'RECEIVED';

const roleAllowed = role === 'STAFF' || role === 'MANAGER';
const statusAllowed = orderStatus === 'RECEIVED';
const commandAllowed = accountActive && roleAllowed && statusAllowed;

if (commandAllowed) {
  console.log('Start processing is allowed');
} else {
  console.log('Start processing is rejected');
}
~~~

Điểm quan trọng:

- OR dùng cho hai role đều hợp lệ.
- AND dùng vì cả ba guard phải pass.
- Ta đặt tên cho từng boolean để failure dễ giải thích.
- Đây là model học tập; production authority vẫn ở Spring service sau authentication/authorization.

Nếu đổi status thành <code>PROCESSING</code>, <code>statusAllowed</code> false và command bị reject. Không cần đợi UI ẩn button mới biết rule; UI hiding không thay server guard.

## Prediction

Không chạy, điền bảng output:

~~~js
const cases = [
  true,
  false,
  0,
  1,
  '',
  'false',
  null,
  undefined
];

for (const value of cases) {
  if (value) {
    console.log('T');
  } else {
    console.log('F');
  }
}
~~~

Sau đó trả lời: tại sao form value <code>'false'</code> không nên được dùng trực tiếp như boolean?

Prediction thứ hai:

~~~js
const status = 'READY_FOR_PICKUP';
const remainingAmount = 0;
const hasOpenIssue = false;

const ready = status === 'READY_FOR_PICKUP';
const paid = remainingAmount === 0;
const clear = hasOpenIssue === false;

console.log(ready && paid && clear);
console.log(ready && paid || clear);
~~~

Hai expression khác nhau về grouping và business meaning. Viết thêm ngoặc để ý định rõ.

## Completion task

Hoàn thành role matrix:

Artifact: <code>foundations/work/js02.mjs</code>; command: <code>npm run lab:js02</code>.

File này cố ý là một script chạy từ trên xuống. M chưa cần <code>function</code>,
<code>export</code>, <code>return</code> hay <code>throw</code>; các khái niệm đó lần lượt đến ở
JS03 và JS05. Lab chấm các dòng được in ra khi chạy file.

~~~js
const roles = ['ANONYMOUS', 'STAFF', 'MANAGER'];

for (const role of roles) {
  const authenticated = TODO;
  const managerRouteAllowed = TODO;

  if (managerRouteAllowed) {
    console.log(role + ': 200');
  } else if (authenticated) {
    console.log(role + ': 403');
  } else {
    console.log(role + ': 302 login');
  }
}
~~~

Expected:

~~~text
ANONYMOUS: 302 login
STAFF: 403
MANAGER: 200
~~~

Không hard-code output theo từng index. Condition phải dựa trên <code>role</code>.

## Independent task

Ngay dưới role matrix trong cùng starter có danh sách status:

~~~js
const statuses = [
  'RECEIVED',
  'PROCESSING',
  'READY_FOR_PICKUP',
  'COMPLETED',
  'CANCELLED',
  'UNKNOWN'
];
~~~

Viết script in đúng một action khả dụng cho mỗi status theo canonical forward lifecycle:

- RECEIVED: start hoặc cancel;
- PROCESSING: mark ready;
- READY_FOR_PICKUP: complete nếu các guard khác pass;
- COMPLETED/CANCELLED: terminal.

Viết một chuỗi <code>if / else if / else</code>, gán action rồi in đúng một dòng cho mỗi status.
Case <code>UNKNOWN</code> đã được đặt sẵn để ép nhánh cuối in
<code>ERROR unknown status</code>, thay vì coi unknown là terminal hợp lệ. Không cần tự nghĩ cách
chia function ở bài này.

## Failure injection

### Failure A - assignment thay comparison

~~~js
let status = 'PROCESSING';

if (status = 'RECEIVED') {
  console.log('Start allowed');
}

console.log(status);
~~~

Dự đoán cả hai output. Root cause không phải “if bị sai”; nó là expression đã thay đổi binding và trả một string truthy.

### Failure B - assertion thích nghi với bug

~~~js
const actualStatus = 'Đã hủy';
let expectedStatus;

if (actualStatus === 'Đã hủy') {
  expectedStatus = 'Đã hủy';
} else {
  expectedStatus = 'Đã tiếp nhận';
}

console.log(actualStatus === expectedStatus);
~~~

Đoạn này luôn dễ pass theo actual. Hãy viết lại để expected xuất phát từ scenario/business rule, không xuất phát từ UI vừa quan sát.

### Failure C - loop che case thiếu

Xóa <code>CANCELLED</code> khỏi test data rồi thấy toàn bộ case còn lại pass. Giải thích vì sao loop chạy xanh không chứng minh danh sách case đầy đủ. Coverage là quyết định của tester, không phải property tự nhiên của loop.

## Transfer

Đọc requirement: “MANAGER thừa hưởng thao tác STAFF, nhưng chỉ MANAGER được refund.” Tạo decision table bằng text trước khi code:

| Role | Collect | Refund |
|---|---:|---:|
| Anonymous | ? | ? |
| Staff | ? | ? |
| Manager | ? | ? |

Sau đó viết condition cho từng cột và một loop in matrix. Transfer tiếp theo: chuyển matrix đó thành tên ba Playwright tests, chưa cần viết locator.

## Gate JS02

Pass khi m:

- dự đoán đúng truthy/falsy cases quan trọng;
- dùng comparison rõ nghĩa cho role/status;
- giải thích AND khác OR trong một business guard;
- viết <code>for...of</code> qua toàn bộ list;
- phát hiện assignment-inside-condition;
- chỉ ra vì sao expected không được suy ra từ actual;
- tạo decision table rồi mới code independent task.

Review D+1: chuỗi <code>'false'</code> truthy hay falsy?  
Review D+3: Viết role matrix từ file trắng.  
Review D+7: Nhận một status mới và chỉ ra nơi cần thay đổi/test.

### No-AI drill JS02 - 30 phút

Nhận ngẫu nhiên một role và một order status. Tạo decision table nhỏ, code outcome, thêm một unknown case và giải thích vì sao expected không được lấy từ actual UI.

---

# JS03 - Function: đặt tên cho một việc và kiểm soát input/output

**Thời lượng thường gặp:** 4 giờ  
**Prerequisite:** JS01-JS02  
**Exit outcome:** M tự viết function có parameter, return và guard; phân biệt định nghĩa với gọi; đọc callback ở mức cơ bản.

## Mental model

Function là một value chứa một quy trình có thể gọi lại. Một function hữu ích có contract:

~~~text
input qua parameters
→ validate/transform/decide
→ output qua return hoặc throw
~~~

~~~js
function add(a, b) {
  return a + b;
}

const total = add(2, 3);
~~~

- <code>function add...</code> định nghĩa function.
- <code>a</code>, <code>b</code> là parameter, tên dùng trong definition.
- <code>2</code>, <code>3</code> là argument ở call site.
- <code>return</code> đưa value về caller và dừng function.
- <code>total</code> nhận output.

<code>console.log</code> không thay <code>return</code>. In một value cho con người thấy khác với đưa value cho code gọi tiếp.

Scope là vùng một name tồn tại. Parameter và variable khai báo trong function không tự tồn tại bên ngoài. Function nên lấy dependency qua parameter thay vì âm thầm đọc và sửa global state; điều này làm test dễ dự đoán hơn.

Function cũng có thể được truyền như value. Khi một function khác nhận nó và gọi sau, nó là callback:

~~~js
function announce(value) {
  console.log(value);
}

function runJob(job) {
  job('done');
}

runJob(announce);
~~~

Ai gọi callback? Trong ví dụ, <code>runJob</code>. Trong Playwright, test runner gọi callback m truyền vào <code>test(...)</code> khi fixture sẵn sàng.

Arrow function là cú pháp ngắn thường thấy:

~~~js
const double = value => value * 2;
~~~

Đừng học arrow như một loại phép thuật khác. Trước hết đọc nó là “function nhận value, trả value nhân hai”.

Trong file lab, một số definition bắt đầu bằng <code>export</code>. Ở JS03, chỉ cần đọc
<code>export function name(...)</code> như <code>function name(...)</code>; từ khóa đó là móc để test runner
gọi function của m. JS05 mới giải thích module/import/export đầy đủ. Đừng xóa <code>export</code> khỏi starter.

## Worked example

Phone normalization là ví dụ tốt vì có input, transform và invalid boundary rõ:

~~~js
function normalizeStoredPhone(rawPhone) {
  const trimmed = rawPhone.trim();
  const withoutSeparators = trimmed.replaceAll(/[.\s-]/g, '');
  const local = withoutSeparators.startsWith('+84')
    ? '0' + withoutSeparators.slice(3)
    : withoutSeparators;

  const valid = /^0\d{9}$/.test(local);

  if (!valid) {
    throw new Error('Phone must contain 10 digits and start with 0');
  }

  return local;
}

const normalized = normalizeStoredPhone(' +84 912-345-678 ');
console.log(normalized);
~~~

Data flow:

1. Caller đưa raw string.
2. Function tạo intermediate values, mỗi name giải thích một transform.
3. Ternary chỉ chọn conversion cho prefix <code>+84</code>.
4. Guard throw nếu contract không đạt.
5. Chỉ valid value mới return.

Regex có thể chưa quen; ở chapter này m không cần tự thiết kế regex. Hãy đọc nó như một dependency đang kiểm tra “0 rồi chín digit”. Điều quan trọng là contract và flow.

## Prediction

Không chạy:

~~~js
function describe(status) {
  if (status === 'RECEIVED') {
    return 'Đã tiếp nhận';
  }

  console.log('unknown status');
}

const first = describe('RECEIVED');
const second = describe('PROCESSING');
console.log(first);
console.log(second);
~~~

Ghi exact output và value của <code>second</code>. Tại sao log “unknown” không phải return?

Prediction callback:

~~~js
function execute(task) {
  console.log('before');
  const result = task(4);
  console.log(result);
  console.log('after');
}

execute(value => value * 3);
~~~

Ai gọi arrow callback? Argument <code>4</code> đến từ đâu? Callback return gì?

## Completion task

Hoàn thành ba function:

Artifact: <code>foundations/work/js03.mjs</code>; cùng file chứa khung independent
<code>canCompletePickup</code>; command: <code>npm run lab:js03</code>.

~~~js
function lineAmount(unitPrice, quantity) {
  // TODO: reject non-positive inputs, then return multiplication
}

function remainingAmount(orderTotal, collectedAmount, refundedAmount) {
  // TODO: net paid = collected - refunded
  // TODO: remaining cannot be below zero
}

function statusLabel(status) {
  // TODO: support all five canonical order statuses
  // TODO: throw for unknown value
}
~~~

Starter tests sẽ gọi function bằng nhiều argument. Không đọc expected file rồi hard-code đúng data mẫu. Với mỗi function, viết contract một câu trước code.

## Independent task

Viết từ file trắng:

~~~text
canCompletePickup(status, remainingAmount, hasOpenIssue) → boolean
~~~

Canonical outcome: chỉ true khi status là <code>READY_FOR_PICKUP</code>, remaining bằng 0 và không có open issue.

Bắt buộc:

- không đọc global variable;
- không mutate argument;
- return boolean ở mọi path;
- tạo tối thiểu năm calls, mỗi call đổi đúng một guard;
- giải thích case nào là happy path và case nào chứng minh từng guard.

Sau đó đổi tên các local variable nhưng giữ contract. Nếu logic vỡ chỉ vì đổi tên, m đang dựa vào copy/pattern chứ chưa hiểu flow.

## Failure injection

### Failure A - missing return

~~~js
function add(a, b) {
  const result = a + b;
}

console.log(add(2, 3));
~~~

### Failure B - return quá sớm

~~~js
function requirePositive(value) {
  return value;

  if (value <= 0) {
    throw new Error('positive required');
  }
}
~~~

### Failure C - shadowing

~~~js
const status = 'RECEIVED';

function printStatus(status) {
  const statusLabel = status === 'RECEIVED' ? 'Đã tiếp nhận' : 'Khác';
  console.log(statusLabel);
}

printStatus('PROCESSING');
console.log(status);
~~~

Ghi value nào thuộc scope nào. Shadowing không luôn là bug, nhưng name trùng làm beginner dễ kể sai state.

### Failure D - gọi thay vì truyền callback

~~~js
function greet() {
  console.log('hello');
}

function register(callback) {
  console.log('registered');
  callback();
}

register(greet());
~~~

So sánh <code>greet</code> và <code>greet()</code>. Một cái là function value, một cái là kết quả của call.

## Transfer

Đọc anatomy:

~~~ts
test('visitor sees services', async ({ page }) => {
  await page.goto('/services');
});
~~~

Trả lời không cần biết Playwright API sâu:

- <code>test</code> là function hay keyword?
- Có bao nhiêu argument được truyền vào <code>test</code>?
- Argument thứ hai là function definition hay function call?
- Ai sẽ gọi callback?
- <code>{ page }</code> là input runner cung cấp, không phải page m tự tạo trong callback; tại sao?

## Gate JS03

Pass khi m:

- viết function từ contract thay vì từ sample output;
- phân biệt parameter/argument và definition/call;
- dùng return ở mọi path phù hợp;
- giải thích scope cho hai name trùng;
- phát hiện callback được gọi sớm;
- hoàn thành <code>canCompletePickup</code> và variation không AI.

### No-AI drill JS03 - 30 phút

Từ file trắng, viết <code>canCollect(status, amount, remaining)</code>, năm examples và một callback runner. Gây missing-return rồi dùng output/test để tìm, không hỏi AI.

---

# JS04 - Array và object: model data, không bám index

**Thời lượng thường gặp:** 5 giờ  
**Prerequisite:** JS01-JS03  
**Exit outcome:** M đọc/ghi object property, lặp và transform array, hiểu reference/shallow copy, chọn item bằng business identity thay vì vị trí.

## Mental model

Object gom các field có tên thành một data shape:

~~~js
const order = {
  code: 'LD-001',
  status: 'RECEIVED',
  total: 100000
};
~~~

Đọc property bằng dot hoặc bracket:

~~~js
console.log(order.code);
console.log(order['status']);
~~~

Array là sequence có thứ tự:

~~~js
const services = ['Giặt sấy', 'Ủi quần áo'];
console.log(services[0]);
~~~

Index bắt đầu từ 0 nhưng index hiếm khi là business identity. “Row thứ hai” có thể đổi khi sort/filter; “order có code LD-002” giữ ý nghĩa.

Các operation cần cho automation:

- <code>find</code>: lấy item đầu tiên thỏa condition;
- <code>filter</code>: lấy danh sách item thỏa condition;
- <code>map</code>: đổi mỗi item thành representation khác;
- <code>some</code>: có ít nhất một item thỏa condition;
- <code>every</code>: mọi item đều thỏa;
- <code>reduce</code>: tích lũy thành một result.

Chúng nhận callback. Callback được array method gọi cho từng item.

Object và array là reference values. Hai variable có thể trỏ cùng object:

~~~js
const original = { status: 'RECEIVED' };
const alias = original;
alias.status = 'PROCESSING';
console.log(original.status); // PROCESSING
~~~

Spread tạo shallow copy:

~~~js
const copy = { ...original };
~~~

Nhưng nested object/array bên trong vẫn có thể dùng chung reference. “Có spread” không đồng nghĩa deep immutable.

Destructuring lấy field ra bằng name:

~~~js
const { code, status } = order;
~~~

## Worked example

~~~js
const transactions = [
  { code: 'TX-001', type: 'COLLECTION', amount: 70000 },
  { code: 'TX-002', type: 'COLLECTION', amount: 50000 },
  { code: 'TX-003', type: 'REFUND', amount: 20000 }
];

const collections = transactions.filter(tx => tx.type === 'COLLECTION');
const hasRefund = transactions.some(tx => tx.type === 'REFUND');
const transactionCodes = transactions.map(tx => tx.code);

const collectedAmount = collections.reduce(
  (sum, tx) => sum + tx.amount,
  0
);

const refundedAmount = transactions
  .filter(tx => tx.type === 'REFUND')
  .reduce((sum, tx) => sum + tx.amount, 0);

const netPaid = collectedAmount - refundedAmount;

console.log(transactionCodes);
console.log(hasRefund);
console.log(netPaid);
~~~

Đọc callback <code>tx => tx.type === 'COLLECTION'</code> là: array method đưa từng transaction vào parameter <code>tx</code>; callback trả boolean để quyết định giữ item.

Với <code>reduce</code>, accumulator <code>sum</code> bắt đầu từ 0. Mỗi vòng trả accumulator mới. Nếu quên <code>return</code> trong block callback, accumulator trở thành <code>undefined</code>.

Production Laundry derive money bằng ledger ở server/DB theo canonical rule. Lab này chỉ rèn data manipulation và oracle reasoning.

## Prediction

### Reference

~~~js
const order = {
  code: 'LD-001',
  customer: { name: 'Nguyễn An' },
  items: [{ service: 'Giặt sấy', quantity: 2 }]
};

const alias = order;
const shallow = { ...order };

alias.code = 'LD-CHANGED';
shallow.customer.name = 'Trần Bình';
shallow.items.push({ service: 'Ủi', quantity: 1 });

console.log(order.code);
console.log(order.customer.name);
console.log(order.items.length);
~~~

Ghi exact output và vẽ ba arrow reference. Vì sao <code>shallow.code = ...</code> sẽ khác <code>shallow.customer.name = ...</code>?

### Array methods

~~~js
const values = [1, 2, 3, 4];
console.log(values.filter(value => value % 2 === 0));
console.log(values.map(value => value * 10));
console.log(values.find(value => value > 2));
console.log(values.some(value => value === 5));
~~~

## Completion task

Cho data:

Artifact: <code>foundations/work/js04.mjs</code>; command: <code>npm run lab:js04</code>.

~~~js
const orders = [
  { code: 'LD-001', status: 'RECEIVED', total: 75000 },
  { code: 'LD-002', status: 'PROCESSING', total: 120000 },
  { code: 'LD-003', status: 'READY_FOR_PICKUP', total: 80000 },
  { code: 'LD-004', status: 'RECEIVED', total: 50000 }
];
~~~

Hoàn thành:

~~~js
const target = orders.find(TODO);
const receivedOrders = orders.filter(TODO);
const codes = orders.map(TODO);
const totalValue = orders.reduce(TODO, 0);
const allHaveCodes = orders.every(TODO);
~~~

Expected contracts:

- target có code <code>LD-003</code>;
- receivedOrders có hai item;
- codes giữ đúng order hiện tại;
- totalValue là tổng bốn total;
- allHaveCodes true khi mọi code không rỗng.

Không dùng <code>orders[2]</code> để tìm LD-003.

## Independent task

Tạo model:

~~~text
order
  code
  status
  customer snapshot: name, phone
  items[]: serviceCode, serviceName, unit, unitPrice, quantity
  transactions[]: code, type, amount
~~~

Viết các function:

- <code>findOrderByCode(orders, code)</code>;
- <code>activeOrderCodes(orders)</code> loại terminal statuses;
- <code>hasOpenIssue(order)</code> dựa trên <code>issues</code> m tự thêm;
- <code>deriveLedger(transactions)</code> trả object gồm collected/refunded/netPaid;
- <code>snapshotSummary(order)</code> trả một object mới, không mutate input.

Starter tests sẽ reorder array. Code dùng business identity phải vẫn pass.

## Failure injection

### Failure A - index coupling

~~~js
const detailOrder = orders[1];
~~~

Reverse array rồi chứng minh test chọn nhầm. Sửa bằng <code>find</code> và handle explicit khi không tìm thấy.

### Failure B - mutate fixture dùng chung

~~~js
const baseOrder = { code: 'LD-001', items: [] };

function addItem(order, item) {
  order.items.push(item);
  return order;
}
~~~

Gọi hai scenario liên tiếp trên <code>baseOrder</code>. Scenario sau thấy state của scenario trước. Sửa bằng factory hoặc copy đúng depth; giải thích ai sở hữu data.

### Failure C - missing return trong reduce

~~~js
const total = [10, 20, 30].reduce((sum, value) => {
  sum + value;
}, 0);
~~~

### Failure D - typo property

<code>order.costumer.name</code> trả gì hoặc throw ở đâu tùy shape? Ghi first meaningful line. TS01 sẽ chuyển nhiều typo như vậy thành compile-time feedback.

## Transfer

Từ data sang locator reasoning:

~~~ts
const row = page.getByRole('row').filter({ hasText: orderCode });
~~~

Giải thích sự tương đồng:

- <code>array.find(item =&gt; item.code === code)</code> chọn bằng business identity;
- locator scope row bằng order code cũng chọn business object;
- <code>nth(1)</code> giống index coupling và có thể vỡ khi DOM reorder.

Sau đó thiết kế test data cho hai orders cùng action text “Chi tiết” nhưng khác code. Chưa cần biết toàn bộ locator API; chỉ cần nêu selection contract.

## Gate JS04

Pass khi m:

- model được nested object/array từ requirement;
- dùng <code>find/filter/map/some/every/reduce</code> đúng purpose;
- giải thích callback do ai gọi;
- dự đoán alias và shallow-copy mutation;
- sửa test bám index thành business identity;
- viết data factory hoặc copy strategy tránh shared mutation;
- làm independent task và reorder variation không AI.

### No-AI drill JS04 - 45 phút

Nhận một file JSON-like gồm orders và transactions. Viết ba query và một ledger derivation, sau đó cài reorder + shared-mutation bug và ghi root cause.

---

# JS05 - Module, package, JSON và stack trace: code được ghép lại thế nào?

**Thời lượng thường gặp:** 4 giờ  
**Prerequisite:** QA00, JS01-JS04  
**Exit outcome:** M tách/nhập module có chủ đích, đọc JSON, throw/catch ở boundary phù hợp và tìm frame đầu tiên thuộc code của mình.

## Mental model

Khi mọi helper nằm trong một file, dependency bị che. Module tạo boundary rõ:

~~~text
module A export contract
→ module B import đúng name/path
→ module loader nối dependency
→ caller dùng value/function đã import
~~~

ES module thường dùng named export:

~~~js
// phone.mjs
export function normalizePhone(raw) {
  return raw.trim();
}
~~~

~~~js
// app.mjs
import { normalizePhone } from './phone.mjs';
~~~

Ba thứ phải đồng ý: file path, export name và module system. Một import error xảy ra trước khi test behavior chạy.

<code>package.json</code> mô tả package, scripts và dependency. <code>package-lock.json</code> khóa dependency tree để install lặp lại hơn. Không sửa lockfile thủ công để “cho hết đỏ”.

JSON là data format, không phải JavaScript đầy đủ:

~~~json
{
  "code": "LD-001",
  "active": true
}
~~~

JSON yêu cầu double quotes cho key/string, không có comment, function hay <code>undefined</code>. <code>JSON.parse</code> đổi text thành runtime value; parsed value vẫn cần validation nếu đến từ bên ngoài.

Error là một value mô tả failure. <code>throw</code> dừng normal flow và đưa error lên caller. <code>catch</code> chỉ nên xử lý khi layer đó có thể thêm meaning, recover hoặc translate. Catch rồi im lặng làm mất evidence.

Stack trace là dấu vết các call frames. Khi dependency có nhiều frame, bắt đầu ở message và frame đầu tiên thuộc file của m, không sửa frame sâu trong thư viện theo cảm giác.

## Worked example

<code>src/status-labels.mjs</code>:

~~~js
const labels = {
  RECEIVED: 'Đã tiếp nhận',
  PROCESSING: 'Đang xử lý',
  READY_FOR_PICKUP: 'Sẵn sàng trả',
  COMPLETED: 'Đã hoàn tất',
  CANCELLED: 'Đã hủy'
};

export function statusLabel(status) {
  const label = labels[status];

  if (label === undefined) {
    throw new Error('Unknown order status: ' + status);
  }

  return label;
}
~~~

<code>src/order-summary.mjs</code>:

~~~js
import { statusLabel } from './status-labels.mjs';

export function orderSummary(order) {
  return order.code + ' | ' + statusLabel(order.status);
}
~~~

<code>run.mjs</code>:

~~~js
import { readFileSync } from 'node:fs';
import { orderSummary } from './src/order-summary.mjs';

const raw = readFileSync(new URL('./data/order.json', import.meta.url), 'utf8');
const order = JSON.parse(raw);
console.log(orderSummary(order));
~~~

Dependency chain là run → JSON/file API + order-summary → status-labels. Nếu status unknown, stack cho biết call site qua chain. Nếu JSON syntax sai, <code>orderSummary</code> chưa được gọi.
JS05 cố ý dùng API đọc file đồng bộ để dependency flow vẫn tuần tự; Promise và <code>await</code>
chỉ bắt đầu ở JS06.

## Prediction

Cho module:

~~~js
// math.mjs
export function add(a, b) {
  return a + b;
}
~~~

Với từng import, dự đoán parse/load/run:

~~~js
import { add } from './math.mjs';
import { sum } from './math.mjs';
import add from './math.mjs';
import { add } from './math';
~~~

Không cần nhớ wording error tuyệt đối, nhưng phải phân loại được name mismatch, default/named mismatch và path mismatch.

Prediction JSON:

~~~js
const raw = '{"amount":"25000","active":true}';
const value = JSON.parse(raw);
console.log(typeof value.amount);
console.log(typeof value.active);
~~~

## Completion task

Starter có một file lớn chứa:

Monolith thật ở <code>foundations/work/js05-monolith.mjs</code>; chạy baseline bằng
<code>npm run lab:js05:monolith</code>. Target main là <code>foundations/work/js05.mjs</code>. Ba module starter
<code>js05-phone.mjs</code>, <code>js05-status.mjs</code>, <code>js05-orders.mjs</code> nằm cạnh nó;
fixture ở <code>foundations/fixtures/js05-orders.json</code>. Chạy <code>npm run lab:js05</code>.

- <code>normalizePhone</code>;
- <code>statusLabel</code>;
- <code>findOrderByCode</code>;
- main code đọc <code>orders.json</code>.

Tách thành ba modules theo contract, rồi main import chúng. Bắt buộc:

- named exports;
- relative imports có extension;
- không duplicate helper để tránh import;
- khi không tìm thấy order, throw error có code được tìm;
- npm script chạy file main.
- dùng <code>readFileSync</code> trong bài này; chưa tự đổi sang API Promise trước JS06.

## Independent task

Tạo package mini <code>laundry-data-tools</code>:

Starter thật nằm ở <code>labs/js05/laundry-data-tools/starter/</code>; chạy bằng
<code>npm run lab:js05:independent</code>. H5 nằm ở folder <code>reference/</code> cạnh starter,
không mở trước timebox.

~~~text
src/
  phone.mjs
  ledger.mjs
  orders.mjs
data/
  scenario.json
run.mjs
~~~

<code>run.mjs</code> phải đọc scenario, normalize phone, tìm order, derive ledger và in summary. Tự thiết kế exports. Sau khi chạy xanh, vẽ dependency graph và trả lời module nào không nên biết filesystem.
Starter đã dùng <code>readFileSync</code>; giữ flow đồng bộ để bài độc lập với JS06.

## Failure injection

Gây lần lượt:

1. Named export/import mismatch.
2. Relative path sai một cấp.
3. JSON trailing comma hoặc single quote.
4. Property bắt buộc bị thiếu nhưng parse vẫn thành công.
5. Catch rồi chỉ log <code>'failed'</code> và tiếp tục exit 0.

Với lỗi 4, phân biệt parse success với domain validation success. Với lỗi 5, sửa sao cho automation/CI có thể nhận biết failure.

Stack-trace drill: tạo chain <code>run → loadScenario → validateOrder → requireCode</code>, cài missing code và khoanh:

- error message;
- first frame thuộc code m;
- call path;
- nơi hợp lý nhất để sửa;
- regression test cần thêm.

## Transfer

Đọc một Playwright import:

~~~ts
import { test, expect } from '@playwright/test';
import { loginAs } from './support/auth';
~~~

Phân biệt package import và relative import. Tìm module boundary hợp lý cho:

- static test data;
- reusable pure calculation;
- browser action có assertion;
- environment secret.

Không tách helper chỉ vì “file dài hai dòng”. Boundary phải làm dependency/contract rõ hơn hoặc loại duplication có thật.

## Gate JS05

Pass khi m:

- tách và import ba modules không walkthrough;
- giải thích named/default mismatch;
- phân biệt JSON parse với validation;
- không nuốt error làm process pass giả;
- đọc stack từ message tới first own frame;
- hoàn thành dependency graph và một import-error variation.

### No-AI drill JS05 - 35 phút

Từ starter sai, sửa module-not-found, export mismatch và invalid JSON. Mỗi lần ghi hypothesis trước sửa. Kết thúc bằng một npm script exit 0 thật sự.

---

# JS06 - Promise và async/await: công việc hoàn tất ở tương lai

**Thời lượng thường gặp:** 6 giờ  
**Prerequisite:** JS01-JS05  
**Exit outcome:** M đọc được Promise lifecycle, dùng <code>await</code> theo dependency, propagate/catch error có chủ đích và phân biệt sequential với concurrent work.

## Mental model

Một synchronous call trả kết quả trước khi caller đi tiếp. Một asynchronous operation thường trả ngay một Promise - object đại diện cho kết quả tương lai.

~~~text
Promise
├── pending
├── fulfilled(value)
└── rejected(error)
~~~

Function khai báo <code>async</code> luôn trả Promise. <code>return value</code> trong async function trở thành fulfilled Promise; <code>throw error</code> trở thành rejected Promise.

~~~js
async function loadOrder() {
  return { code: 'LD-001' };
}

const promise = loadOrder();
const order = await promise;
~~~

<code>await</code> tạm dừng continuation của async function hiện tại cho tới khi Promise settle. Nó không block toàn bộ JavaScript runtime.

Dependency quyết định thứ tự:

~~~text
Nếu B cần output A: await A rồi B.
Nếu A và B độc lập: có thể start cùng lúc rồi await Promise.all.
~~~

<code>Promise.all</code> không phải “tối ưu mặc định”. Hai browser actions trên cùng page thường có dependency/state và không nên song song chỉ vì cú pháp cho phép.

Event loop tối thiểu cần nhớ:

- current synchronous stack chạy hết;
- Promise continuations/microtasks đã queue chạy;
- timer/task tiếp theo mới chạy.

Mục tiêu là dự đoán timeline, không thuộc khẩu hiệu “Promise nhanh hơn timer”.

## Worked example

~~~js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadCatalog() {
  await delay(30);
  return ['Giặt sấy', 'Ủi quần áo'];
}

async function loadStoreSettings() {
  await delay(20);
  return { shopName: 'Laundry Demo' };
}

async function buildPageModel() {
  const catalogPromise = loadCatalog();
  const settingsPromise = loadStoreSettings();

  const [catalog, settings] = await Promise.all([
    catalogPromise,
    settingsPromise
  ]);

  return { catalog, settings };
}

const model = await buildPageModel();
console.log(model.settings.shopName);
console.log(model.catalog.length);
~~~

Hai loaders độc lập, nên start cả hai trước rồi await chung là hợp lệ. Nếu settings cần một ID từ catalog, chúng không còn độc lập.

Error propagation:

~~~js
async function requireOrder(code) {
  await delay(5);
  throw new Error('Order not found: ' + code);
}

try {
  await requireOrder('LD-X');
} catch (error) {
  console.error(error.message);
}
~~~

Catch chỉ vì entry point muốn chuyển error thành user-facing/evidence output. Helper sâu hơn có thể để rejection propagate.

## Prediction

### Timeline A

~~~js
console.log('A');
setTimeout(() => console.log('T'), 0);
Promise.resolve().then(() => console.log('P'));
console.log('B');
~~~

Ghi exact order và vẽ stack → microtask → timer.

### Timeline B

~~~js
async function f() {
  console.log('F1');
  await 0;
  console.log('F2');
}

console.log('A');
f();
console.log('B');
~~~

<code>f()</code> chạy sync tới đâu trước khi caller tiếp tục?

### Missing await

~~~js
async function valueLater() {
  return 42;
}

const value = valueLater();
console.log(value === 42);
~~~

<code>value</code> là 42 hay Promise? Dùng evidence gì để chứng minh?

Sau khi đã khóa cả ba prediction trên giấy, chạy sandbox
<code>npm run lab:js06:predict</code> (artifact <code>labs/js06/predict.mjs</code>) để đối chiếu.
Command này thuộc JS06; không chạy nó khi đang học JS02.

## Completion task

Starter có ba functions:

Artifact: <code>foundations/work/js06.mjs</code>; command: <code>npm run lab:js06</code>.

~~~js
async function fetchOrder(code) { /* provided */ }
async function fetchTransactions(code) { /* provided */ }
async function fetchCustomer(customerId) { /* provided */ }
~~~

Hoàn thành <code>buildOrderDetail</code>:

1. Fetch order trước vì cần <code>customerId</code>.
2. Sau khi có order, transactions theo code và customer theo ID là độc lập; start cùng lúc.
3. Return object tổng hợp.
4. Nếu order không tồn tại, error phải propagate với code.

Trước khi code, vẽ dependency graph. Starter test đo call order và result, không chỉ thời gian tổng.

## Independent task

Viết một command simulation:

~~~text
recordCollection(orderCode, amount)
→ load order
→ derive remaining from transactions
→ reject invalid amount/status
→ save transaction
→ return receipt
~~~

Các provided async dependency cố tình delay/reject. M phải:

- await theo dependency;
- không catch rồi giả success;
- tạo happy path và ba rejection cases;
- ghi timeline cho một case;
- giải thích operation nào tuyệt đối không chạy nếu guard fail.

Đây là sandbox reasoning, không phải implementation transaction của Spring.

## Failure injection

### Failure A - quên await assertion-like Promise

~~~js
async function assertEventually() {
  await delay(10);
  throw new Error('Expected ready, received processing');
}

async function testCase() {
  assertEventually();
  console.log('test ended');
}

await testCase();
~~~

Quan sát false completion/unhandled rejection. Sửa ở caller và chứng minh process exit khác.

### Failure B - helper không return Promise

~~~js
function waitForSave() {
  delay(20).then(() => console.log('saved'));
}

await waitForSave();
console.log('after wait');
~~~

### Failure C - Promise.all sai dependency

Start <code>fetchCustomer(order.customerId)</code> trước khi có <code>order</code>. Root cause là dependency graph sai, không phải Promise.all “bị flaky”.

### Failure D - swallowed error

~~~js
async function login() {
  try {
    await Promise.reject(new Error('401'));
  } catch (error) {
    console.log('login issue');
  }
}
~~~

Caller nhận fulfilled Promise <code>undefined</code>. Quyết định: recover thật, translate rồi throw, hay để propagate.

## Transfer

Phân loại từng Playwright call theo dependency:

~~~ts
await page.goto('/orders');
await page.getByRole('link', { name: 'Chi tiết' }).click();
await expect(page.getByRole('heading')).toContainText('LD-001');
~~~

- Click phụ thuộc navigation/DOM nào?
- Assertion phụ thuộc outcome nào?
- Vì sao chạy ba Promise trong <code>Promise.all</code> là sai mental model?
- Bỏ await ở action và assertion có thể cho symptom khác nhau thế nào?

## Gate JS06

Pass khi m:

- vẽ Promise pending/fulfilled/rejected;
- dự đoán đúng hai event-loop snippets;
- nhận ra async function luôn trả Promise;
- sắp xếp task dựa trên dependency graph;
- dùng Promise.all chỉ cho work độc lập;
- sửa missing-return/missing-await/swallowed-error bằng evidence;
- làm independent command và one variation không AI.

### No-AI drill JS06 - 45 phút

Nhận ba async dependencies chưa biết delay. Vẽ graph, implement aggregator, cài một missing await và một rejection, rồi ghi actual timeline/root cause.

---

# JS07 - Test tự động cơ bản: arrangement, action và oracle

**Thời lượng thường gặp:** 4-5 giờ  
**Prerequisite:** JS01-JS06  
**Exit outcome:** M viết test nhỏ bằng Node test runner, chọn oracle độc lập với implementation, đọc diff và tránh test chỉ chứng minh code của test.

## Mental model

Automated test là một chương trình chạy code khác và quyết định pass/fail. Cấu trúc tối thiểu:

~~~text
Arrange: tạo input/precondition
Act: gọi behavior
Assert: so actual với expected oracle
~~~

Test runner đăng ký test callbacks, gọi từng callback, thu Promise/error và báo kết quả. Assertion throw khi contract không đạt. Test xanh chỉ có ý nghĩa bằng contract nó kiểm tra; một assertion yếu cho confidence yếu.

~~~js
import test from 'node:test';
import assert from 'node:assert/strict';

test('adds two values', () => {
  const actual = 2 + 3;
  assert.equal(actual, 5);
});
~~~

Tên test nên mô tả observable behavior, không mô tả method được gọi. “rejects collection above remaining amount” hữu ích hơn “test recordCollection”.

Oracle là nguồn xác định expected. Nó có thể đến từ requirement, calculation độc lập, known seed hoặc protocol contract. Nếu expected gọi lại chính function đang test, bug có thể xuất hiện ở cả actual và expected.

Một case mạnh thường đổi đúng một dimension để biết guard nào được chứng minh. Hai mươi cases copy/paste mà không có reason không tự động tốt hơn năm cases có boundary rõ.

## Worked example

Production function:

~~~js
export function canCompletePickup(status, remaining, hasOpenIssue) {
  return status === 'READY_FOR_PICKUP'
    && remaining === 0
    && hasOpenIssue === false;
}
~~~

Tests:

~~~js
import test from 'node:test';
import assert from 'node:assert/strict';
import { canCompletePickup } from '../src/pickup.mjs';

test('allows pickup when ready, fully paid and issue-free', () => {
  const actual = canCompletePickup('READY_FOR_PICKUP', 0, false);
  assert.equal(actual, true);
});

test('rejects pickup with remaining balance', () => {
  const actual = canCompletePickup('READY_FOR_PICKUP', 1, false);
  assert.equal(actual, false);
});

test('rejects pickup with an open issue', () => {
  const actual = canCompletePickup('READY_FOR_PICKUP', 0, true);
  assert.equal(actual, false);
});

test('rejects pickup from processing status', () => {
  const actual = canCompletePickup('PROCESSING', 0, false);
  assert.equal(actual, false);
});
~~~

Mỗi negative case giữ hai guard valid và đổi một guard. Khi fail, ta biết dimension nào đang thiếu.

Với error contract:

~~~js
assert.throws(
  () => statusLabel('UNKNOWN'),
  /Unknown order status/
);
~~~

Với async rejection:

~~~js
await assert.rejects(
  () => recordCollection('LD-001', -1),
  /positive/
);
~~~

## Prediction

Test nào hữu ích, test nào tautology?

~~~js
const actual = lineAmount(25000, 2);

assert.equal(actual, 50000);
assert.equal(actual, lineAmount(25000, 2));
assert.equal(typeof actual, 'number');
assert.ok(actual);
~~~

Không phải assertion sai cú pháp là vô ích; hãy nói chính xác contract mỗi assertion chứng minh và cái gì nó bỏ sót.

Prediction runner:

~~~js
test('async failure', async () => {
  assert.rejects(
    () => Promise.reject(new Error('boom')),
    /boom/
  );
});
~~~

Thiếu <code>await</code> trước <code>assert.rejects</code> tạo risk gì?

## Completion task

Viết tests cho <code>normalizeStoredPhone</code> có sẵn:

Production helper được cấp ở <code>foundations/work/js07.mjs</code>. M chỉ viết assertion trong
<code>foundations/work/js07.learner.test.mjs</code>; chạy <code>npm run lab:js07</code>.

- plain local phone;
- spaces/dots/hyphens;
- <code>+84</code> conversion;
- shorter than 10 digits;
- wrong first digit;
- alphabetic input;
- input không mutate.

Mỗi case phải có tên behavior. Không loop toàn bộ cases ngay lần đầu; viết ba cases rõ, sau đó mới cân nhắc table-driven tests nếu readability tốt hơn.

## Independent task

Cho canonical-like ledger function <code>deriveBalance(orderTotal, transactions)</code>. Từ requirement, tự lập decision table rồi viết suite chứng minh:

- no transactions;
- one collection;
- multiple collections;
- collection + refund;
- overpaid mathematical remaining clamped at zero;
- unknown transaction type bị reject;
- input transaction array không mutate.

Sau đó cố ý đổi production code từ subtract refund thành add refund. Suite phải đỏ đúng case và message giúp xác định contract.

## Failure injection

### Failure A - expected từ actual

~~~js
const actual = statusLabel('RECEIVED');
const expected = actual;
assert.equal(actual, expected);
~~~

### Failure B - assertion quá rộng

~~~js
assert.ok(order);
~~~

Nếu requirement là đúng code/status/total, truthy object không đủ.

### Failure C - test phụ thuộc thứ tự

Test A mutate shared array; Test B mong array sạch. Chạy B riêng, cả suite, đảo declaration order. Ghi evidence khác nhau.

### Failure D - catch làm test pass

~~~js
test('rejects invalid phone', () => {
  try {
    normalizeStoredPhone('abc');
  } catch (error) {
    console.log(error.message);
  }
});
~~~

Test pass cả khi không throw. Sửa bằng assertion đúng contract.

### Failure E - chỉ test happy path

Cài production code luôn return true. Nếu suite chỉ có happy path, nó xanh. Thêm smallest negative case khiến mutation bị bắt.

## Transfer

Map Node test sang Playwright:

~~~text
Node test callback      ↔ Playwright test callback
function input          ↔ page/data/precondition
function call           ↔ browser action
assert.equal            ↔ web-first expect
returned/error value    ↔ user-visible outcome/network/state
~~~

Cho flow “Staff mở order LD-002”, viết test contract trước locator:

- Arrange nào cần seed/login?
- Action duy nhất là gì?
- Observable outcome nào chứng minh đúng order, không chỉ “page có mở”?
- Negative case nào chứng minh wrong role hoặc wrong code?

## Gate JS07

Pass khi m:

- viết Arrange-Act-Assert rõ;
- giải thích test runner gọi callback;
- tạo expected từ requirement độc lập;
- dùng assert cho value, throw và rejection;
- làm mutation khiến suite phải đỏ;
- chứng minh shared state bằng order variation;
- hoàn thành ledger suite no-AI.

### No-AI drill JS07 - 45 phút

Nhận một pure function chưa có tests. Viết decision table, tối thiểu một happy + ba negative/boundary cases, cài mutation và chứng minh suite bắt được.

---

# JS08 - Cầu nối vào Playwright: đọc một spec từ trái sang phải

**Thời lượng thường gặp:** 4-5 giờ  
**Prerequisite:** JS01-JS07  
**Exit outcome:** M đọc anatomy một Playwright spec, biết runner/callback/fixture/locator/action/assertion, tự hoàn thành spec nhỏ và phân loại failure.

## Mental model

Playwright Test là test runner + browser automation library. Một spec TypeScript vẫn là chương trình dùng function, callback, object destructuring, Promise và assertions đã học.

~~~ts
import { test, expect } from '@playwright/test';

test('visitor sees active services', async ({ page }) => {
  await page.goto('/services');

  const row = page
    .getByRole('row')
    .filter({ hasText: 'Giặt sấy quần áo' });

  await expect(row).toContainText('KG');
  await expect(row).toContainText('25.000 ₫');
});
~~~

Đọc từng layer:

1. Import lấy named exports từ package.
2. <code>test</code> nhận title và async callback.
3. Runner đăng ký rồi gọi callback sau, cung cấp fixtures.
4. <code>{ page }</code> destructure property <code>page</code> từ fixture object.
5. <code>page.goto</code> trả Promise; callback await navigation.
6. Locator là query recipe, chưa phải cached DOM node.
7. <code>filter</code> scope row theo business text.
8. <code>expect(locator)</code> tạo web-first assertion retry condition.
9. Test outcome là đúng service row hiển thị unit/price, không chỉ URL mở được.

Test code có ba loại intent:

~~~text
Setup/precondition → action → observable assertion
~~~

Đừng giấu assertion vào generic action helper quá sớm. Khi beginner không nhìn thấy outcome, suite dễ thành script click qua UI.

## Worked example

~~~ts
test('staff opens order LD-002 from the order list', async ({ page }) => {
  await page.goto('/orders?order=desc');

  const targetOrder = page
    .getByRole('row')
    .filter({ hasText: 'LD-002' });

  await targetOrder
    .getByRole('link', { name: 'Chi tiết' })
    .click();

  await expect(
    page.getByRole('heading', { name: 'Đơn LD-002' })
  ).toBeVisible();
});
~~~

Tại sao không dùng <code>getByRole('link', { name: 'Chi tiết' }).nth(1)</code>? Vì position không phải identity; DOM đã đảo order. Scope row giống <code>array.find</code> bằng <code>code</code> ở JS04.

Tại sao vẫn assert heading sau click? Click không chứng minh navigation tới đúng order hoặc render đúng detail.

## Prediction

Đọc, không chạy:

~~~ts
test('save phone', async ({ page }) => {
  page.goto('/slow-form');
  page.getByLabel('Số điện thoại').fill('0912345678');
  page.getByRole('button', { name: 'Lưu' }).click();
  expect(page.getByRole('status')).toHaveText('Đã lưu 0912345678');
});
~~~

Cho từng dòng:

- return value là gì?
- dependency sau cần outcome nào?
- missing await có thể tạo race, teardown hay false green nào?
- tại sao symptom không nhất thiết giống nhau mỗi lần?

Prediction locator:

Trang có ba link tên “Chi tiết”. Locator link toàn trang resolve bao nhiêu element? Assertion/click có thể báo loại lỗi nào? Scope business object nên dùng text nào?

## Completion task

Completion có hai artifact, làm đúng thứ tự:

1. Hoàn thành <code>foundations/work/js08.mjs</code>: <code>buildOrderTestPlan(code)</code> phải mô tả
   fixture, row theo exact business-code cell, action semantic, visible-heading oracle và ba awaited
   steps; <code>openOrderByCode(page, code)</code> phải thực thi đúng dependency đó. Chạy
   <code>npm run foundation:test:work -- JS08</code> cho tới khi Node contract xanh.
2. Sau khi tự viết browser attempt, đổi hai marker trong
   <code>tests/work/foundation/js08_bridge.spec.ts</code> từ <code>test.fixme</code> thành
   <code>test</code>, rồi chạy <code>npm run lab:js08</code>. Command này chấm lại cả helper và browser.

Artifact browser thật: <code>tests/work/foundation/js08_bridge.spec.ts</code>; command:
<code>npm run lab:js08</code>. Không dùng fake Page contract thay bài này.

~~~ts
test('visitor sees the ironing service', async ({ page }) => {
  // TODO 1: navigate to service page
  // TODO 2: locate row by service name, not index
  // TODO 3: assert ITEM and 12.000 ₫ inside that row
});
~~~

Bắt buộc:

- semantic locator;
- mọi Promise được await;
- ít nhất hai assertions cùng scoped row;
- gây một assertion fail rồi ghi call log/first own line;
- reorder table vẫn pass.

## Independent task

Không nhìn worked example trong 25 phút:

1. Mở order list ở descending DOM order.
2. Tìm <code>LD-001</code> bằng business code.
3. Click đúng link “Chi tiết” trong row.
4. Assert heading chứa đúng code.
5. Assert page không hiển thị detail của <code>LD-002</code> bằng contract hợp lý.
6. Chạy riêng test và lặp lại ít nhất ba lần.

Viết teach-back: test runner làm gì, browser object nào được dùng, locator giữ gì, assertion chờ gì.

## Failure injection

### Failure A - syntax/import

Xóa closing brace hoặc đổi <code>expect</code> thành named import không tồn tại. Test callback có được chạy không?

### Failure B - no tests collected

Đổi file/name/path ngoài <code>testDir</code>. Phân biệt “0 tests” với “tests pass”.

### Failure C - locator zero/multiple

Đổi accessible name sai, rồi bỏ row scope. So sánh call log.

### Failure D - missing await

Bỏ await lần lượt khỏi goto, fill/click và expect. Mỗi lần chạy isolated, ghi symptom thực tế; không khẳng định cả ba luôn fail giống nhau.

### Failure E - weak oracle

Chỉ assert URL chứa <code>/orders/detail</code>. Server trả detail nhầm code vẫn pass. Thêm user-visible business identity.

## Transfer

Cho một màn Laundry thật (chỉ read requirement/screenshot nếu repo chưa chạy), thiết kế spec skeleton:

~~~text
Title:
Actor/precondition:
Business object identity:
Action:
Observable outcome:
Negative oracle:
Data owner:
~~~

Không thêm REST/test-support endpoint vào canonical app. Nếu chưa có deterministic data contract, ghi đó là blocker/design question chứ không hard-code row position.

## Gate JS08

Pass khi m:

- annotate đúng registration/callback/fixture/action/assertion;
- giải thích destructuring <code>{ page }</code>;
- viết hai specs không copy;
- chọn row bằng business identity;
- phân biệt collection/import, locator, action và assertion failures;
- sửa missing await từ evidence;
- làm transfer skeleton cho Laundry.

### No-AI drill JS08 - 45 phút

Từ prompt business một đoạn, viết spec, chạy, tự cài strictness và missing-await bugs, sửa bằng call log. Không mở reference spec hoặc chat.

---

# TS01 - TypeScript strict: feedback trước khi chạy

**Thời lượng thường gặp:** 4-5 giờ  
**Prerequisite:** JS01-JS08  
**Exit outcome:** M giải thích TypeScript nằm ở đâu trong toolchain, dùng inference/annotation cho variable, function, array/object và sửa type error thay vì né bằng <code>any</code>.

## Mental model

TypeScript là JavaScript có static type checker và thêm syntax cho types. Browser/Node cuối cùng chạy JavaScript; toolchain kiểm tra/transpile TypeScript trước hoặc trong quá trình test.

~~~text
.ts source
→ TypeScript parser + type checker
→ nếu type contract sai: feedback trước runtime
→ nếu đạt: JavaScript/runtime behavior
→ test/assertion vẫn có thể fail
~~~

TypeScript không chứng minh business behavior đúng. Nó có thể chặn <code>order.costumer</code> nếu type chỉ có <code>customer</code>, nhưng không biết giá 25.000 ₫ có đúng requirement hay không.

<code>tsconfig.json</code> định nghĩa project type-check như thế nào. V4 dùng strict baseline. Không tắt <code>strict</code> hoặc thêm <code>// @ts-ignore</code> chỉ để hết đỏ.

Inference nghĩa là TypeScript suy type từ value:

~~~ts
const orderCode = 'LD-001'; // inferred string
const amount = 25000;       // inferred number
const active = true;        // inferred boolean
~~~

Annotation ghi contract khi inference không đủ rõ hoặc tại boundary:

~~~ts
let currentStatus: string = 'RECEIVED';

function lineAmount(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}
~~~

Object type mô tả shape:

~~~ts
const service: {
  code: string;
  name: string;
  price: number;
  active: boolean;
} = {
  code: 'GIAT_SAY_KG',
  name: 'Giặt sấy quần áo',
  price: 25000,
  active: true
};
~~~

Array type:

~~~ts
const orderCodes: string[] = ['LD-001', 'LD-002'];
~~~

Function type kiểm tra input/output ở call site và implementation. Nếu function hứa return number nhưng một path trả undefined, strict checking giúp lộ lỗ hổng.

## Worked example

Từ JavaScript:

~~~js
function findOrderByCode(orders, code) {
  return orders.find(order => order.code === code);
}
~~~

Sang TypeScript bước đầu:

~~~ts
type Order = {
  code: string;
  status: string;
  total: number;
};

function findOrderByCode(orders: Order[], code: string): Order | undefined {
  return orders.find(order => order.code === code);
}

const orders: Order[] = [
  { code: 'LD-001', status: 'RECEIVED', total: 75000 },
  { code: 'LD-002', status: 'PROCESSING', total: 120000 }
];

const target = findOrderByCode(orders, 'LD-002');

if (target !== undefined) {
  console.log(target.status);
}
~~~

Tại sao return là <code>Order | undefined</code>? Vì <code>find</code> có thể không thấy. Type checker buộc caller xử lý khả năng đó trước khi đọc property. Đây là honest contract, không phải TypeScript gây khó.

Lưu ý: <code>type</code> alias được giới thiệu nhẹ ở đây để đặt tên shape; TS02 sẽ học sâu hơn về domain types.

## Prediction

Không chạy typecheck. Với từng dòng, dự đoán pass/type error/runtime-only risk:

~~~ts
const code: string = 'LD-001';
const amount: number = '25000';
const active = true;
active = false;

function double(value: number): number {
  return String(value * 2);
}

const order = { code: 'LD-001', total: 50000 };
console.log(order.status);
~~~

Phân biệt lỗi <code>const</code> reassignment do JavaScript rule và mismatch do TypeScript contract.

Prediction inference:

~~~ts
let value = 1;
value = 2;
value = 'two';
~~~

Type được suy ở declaration là gì? <code>let</code> không có nghĩa variable chấp nhận mọi type.

## Completion task

Starter JavaScript ở <code>foundations/fixtures/ts01-starter.mjs</code> có object services và ba
helpers. Đọc/chạy input đó, rồi chuyển contract sang target <code>foundations/work/ts01.ts</code>
và hoàn thành types:

Input command: <code>npm run lab:ts01:input</code>. Target command: <code>npm run lab:ts01</code>.

~~~ts
type Service = {
  code: TODO;
  name: TODO;
  unitPrice: TODO;
  active: TODO;
};

function activeServices(services: TODO): TODO {
  return services.filter(service => service.active);
}

function findService(services: TODO, code: TODO): TODO {
  return services.find(service => service.code === code);
}

function displayPrice(service: TODO): TODO {
  return service.name + ': ' + service.unitPrice + ' VND';
}
~~~

Bắt buộc chạy:

~~~sh
npm run typecheck
npm run lab:ts01
~~~

Hai command trả lời hai câu hỏi khác nhau. Ghi cả hai outputs.

## Independent task

Tiếp tục trong phần khung independent đã có sẵn ở cuối
<code>foundations/work/ts01.ts</code>; “từ file trắng” ở đây nghĩa là tự viết logic từ contract,
không phải tạo thêm file hay đoán đường dẫn. Model:

~~~text
CustomerSnapshot: name, phone
OrderItem: serviceCode, serviceName, unitPrice, quantity
Order: code, customer, items
~~~

Viết typed functions:

- <code>orderTotal(items)</code>;
- <code>findItem(items, serviceCode)</code> với honest return type;
- <code>orderSummary(order)</code>;
- <code>requireItem(items, serviceCode)</code> throw khi không có và return <code>OrderItem</code> khi có.

Mở scaffold <code>foundations/type-tests/ts01.learner-errors.ts</code>, cài ba invalid calls và dùng
<code>npm run foundation:typecheck</code> để chứng minh chúng bị chặn. Đặt
<code>// @ts-expect-error -- lý do của m</code> ngay trên từng call: command xanh chỉ khi compiler thật sự
phát hiện lỗi dự kiến; nếu call vô tình trở thành hợp lệ, directive thừa sẽ làm command đỏ. Không dùng
<code>any</code>, cast hay <code>@ts-ignore</code> để né bài.

## Failure injection

### Failure A - dùng any để bịt lỗi

~~~ts
function printOrder(order: any) {
  console.log(order.costumer.nmae);
}
~~~

Typecheck xanh nhưng runtime có thể crash. Thay <code>any</code> bằng shape thật và quan sát hai typo bị bắt.

### Failure B - non-null assertion vô căn cứ

~~~ts
const target = orders.find(order => order.code === 'LD-X')!;
console.log(target.status);
~~~

Dấu <code>!</code> bảo checker tin m; nó không tạo object ở runtime. Sửa bằng guard hoặc <code>requireOrder</code> có explicit error.

### Failure C - compile xanh, business sai

~~~ts
function lineAmount(price: number, quantity: number): number {
  return price + quantity;
}
~~~

Types đúng nhưng operator sai. Cần test/oracle từ JS07.

### Failure D - return path thiếu

Khai báo function return <code>string</code> nhưng unknown status không return/throw. Dùng checker feedback để sửa honest contract.

## Transfer

Mở một Playwright spec và hover/read types nếu editor hỗ trợ:

~~~ts
test('service', async ({ page }) => {
  const row = page.getByRole('row');
  await expect(row).toBeVisible();
});
~~~

Không cần nhớ definition library. Ghi:

- TypeScript suy <code>page</code> từ fixture callback như thế nào ở mức high-level;
- <code>row</code> có phải DOM element không;
- action/assertion trả Promise nên <code>await</code> vẫn là runtime dependency, không phải chỉ type syntax;
- typo method có thể bị checker bắt trước browser launch.

## Gate TS01

Pass khi m:

- kể được source → checker → runtime → assertion;
- dùng inference khi rõ, annotation ở function/boundary;
- type object, array, parameter và return;
- xử lý <code>undefined</code> từ <code>find</code> không dùng <code>!</code> vô căn cứ;
- giải thích type-safe không đồng nghĩa behavior-correct;
- hoàn thành independent task với strict typecheck và runtime tests.

### No-AI drill TS01 - 40 phút

Chuyển một JS data helper sang strict TS, sửa tối thiểu năm type errors mà không dùng <code>any</code>/<code>@ts-ignore</code>, rồi cài một business mutation để chứng minh typecheck không thay tests.

---

# TS02 - Domain types: union, literal, optional, readonly và discriminated data

**Thời lượng thường gặp:** 5 giờ  
**Prerequisite:** TS01  
**Exit outcome:** M dùng union/literal để loại illegal values, model optional đúng nghĩa, đọc <code>type</code>/<code>interface</code>, và dùng discriminated union cho transaction/status behavior.

## Mental model

<code>string</code> quá rộng cho một field chỉ nhận vài value. Literal union mô tả set hợp lệ:

~~~ts
type OrderStatus =
  | 'RECEIVED'
  | 'PROCESSING'
  | 'READY_FOR_PICKUP'
  | 'COMPLETED'
  | 'CANCELLED';
~~~

Giờ typo <code>'READY'</code> bị checker chặn. Union không thay runtime validation cho text từ HTTP/JSON; external value chưa tự trở thành <code>OrderStatus</code> chỉ vì m annotate.

<code>type</code> và <code>interface</code> đều có thể đặt tên object shape. Trong foundation:

- dùng <code>type</code> thuận tiện cho union và composition;
- đọc được <code>interface</code> vì library/framework dùng nhiều;
- không tranh luận style khi chưa có project convention.

~~~ts
interface CustomerSnapshot {
  name: string;
  phone: string;
}
~~~

Optional property <code>note?: string</code> nghĩa property có thể vắng/<code>undefined</code>. Nó không tự đồng nghĩa empty string hoặc null. Requirement phải quyết định.

<code>readonly</code> ngăn assignment qua type contract:

~~~ts
type Transaction = {
  readonly code: string;
  readonly amount: number;
};
~~~

Đây là compile-time protection, không deep-freeze runtime object.

Discriminated union dùng một field literal để nối variant với fields tương ứng:

~~~ts
type PaymentTransaction =
  | { type: 'COLLECTION'; amount: number; method: PaymentMethod }
  | { type: 'REFUND'; amount: number; method: PaymentMethod; reason: string };
~~~

Khi <code>type === 'REFUND'</code>, checker biết <code>reason</code> tồn tại.

## Worked example

~~~ts
type PricingUnit = 'KG' | 'ITEM';

type ServiceSnapshot = {
  readonly serviceCode: string;
  readonly serviceName: string;
  readonly unit: PricingUnit;
  readonly unitPrice: number;
  quantity: number;
  note?: string;
};

function quantityLabel(item: ServiceSnapshot): string {
  if (item.unit === 'KG') {
    return item.quantity + ' kg';
  }

  return item.quantity + ' món';
}

function noteLabel(item: ServiceSnapshot): string {
  return item.note === undefined ? 'Không có ghi chú' : item.note;
}
~~~

Literal union giúp condition exhaustive ở set hiện tại. <code>readonly</code> trên snapshot fields diễn đạt “test data không nên reprice/rename history”. Nó gợi nhớ canonical concept nhưng không thay immutable database history.

## Prediction

Với mỗi assignment, dự đoán checker:

~~~ts
let status: OrderStatus = 'RECEIVED';
status = 'PROCESSING';
status = 'READY';

const item: ServiceSnapshot = {
  serviceCode: 'GIAT_SAY_KG',
  serviceName: 'Giặt sấy quần áo',
  unit: 'KG',
  unitPrice: 25000,
  quantity: 2
};

item.quantity = 3;
item.unitPrice = 30000;
console.log(item.note.length);
~~~

Phân biệt optional handling với non-null assertion.

Prediction discriminated union:

~~~ts
type Result =
  | { ok: true; value: string }
  | { ok: false; error: string };

function print(result: Result) {
  if (result.ok) {
    console.log(result.value);
  } else {
    console.log(result.error);
  }
}
~~~

Tại mỗi branch, property nào hợp lệ?

## Completion task

Hoàn thành domain types:

Artifact: <code>foundations/work/ts02.ts</code>; command: <code>npm run lab:ts02</code>.

~~~ts
type Role = TODO;
type OrderStatus = TODO;
type IssueStatus = TODO;
type PaymentMethod = TODO;

type PaymentTransaction =
  | {
      readonly code: string;
      type: TODO;
      amount: number;
      method: PaymentMethod;
    }
  | {
      readonly code: string;
      type: TODO;
      amount: number;
      method: PaymentMethod;
      reason: string;
    };
~~~

Sau đó viết <code>transactionLabel</code> và <code>signedAmount</code>. Refund phải có reason ở compile time; collection không có reason bắt buộc.
Sau runtime contract, mở <code>foundations/type-tests/ts02.learner-errors.ts</code> và làm ba
intentional type errors theo scaffold; <code>npm run foundation:typecheck</code> phải xác nhận bằng
<code>@ts-expect-error</code> có lý do, không làm project đỏ vĩnh viễn.

## Independent task

Model một typed scenario cho pickup:

~~~text
actor role
order status
remaining amount
issues[] với OPEN/RESOLVED
optional note
expected outcome: allowed hoặc rejected với reason code
~~~

Dùng discriminated union cho result:

~~~ts
type PickupDecision =
  | { allowed: true }
  | { allowed: false; reason: ... };
~~~

Viết <code>decidePickup</code> và tests. Thêm một reason mới rồi quan sát nơi checker bắt code chưa xử lý hết.

## Failure injection

### Failure A - union bị làm rộng

Đổi <code>OrderStatus</code> thành <code>string</code>; typo status typecheck xanh. Dùng type-negative
case trong <code>foundations/type-tests/ts02.learner-errors.ts</code> chứng minh regression, rồi restore
union trước khi qua case khác.

### Failure B - optional dùng như chắc chắn có

<code>item.note.toUpperCase()</code>. Sửa bằng branch/default có business meaning, không dùng <code>!</code>.

### Failure C - readonly không phải runtime freeze

Ép/cast qua một mutable shape hoặc mutate nested array và quan sát. Giải thích vì sao readonly vẫn có giá trị nhưng không phải security boundary.

### Failure D - optional che missing required data

Biến mọi field thành <code>?</code> để object dễ tạo. Checker không còn bảo vệ contract. Chỉ property thật sự có thể vắng mới optional.

## Transfer

Playwright test data thường có role/status variants. Thiết kế:

~~~ts
type Account =
  | { role: 'STAFF'; username: string }
  | { role: 'MANAGER'; username: string };
~~~

Sau đó trả lời:

- Vì sao không thêm <code>ANONYMOUS</code> như một account có username giả?
- Một anonymous scenario nên là variant khác thế nào?
- Type nào giúp project config tránh gõ sai role project name?
- Runtime storage state vẫn có thể hết hạn dù types đúng như thế nào?

## Gate TS02

Pass khi m:

- thu hẹp status/role/unit bằng literal unions;
- giải thích optional khác null/empty;
- dùng readonly đúng kỳ vọng;
- tạo và narrow discriminated union;
- không biến mọi field thành optional để hết lỗi;
- hoàn thành pickup decision + new-reason variation no-AI.

### No-AI drill TS02 - 45 phút

Nhận object types quá rộng. Thu hẹp thành literal/discriminated unions, typecheck negative cases, thêm một variant mới và sửa mọi non-exhaustive branch.

---

# TS03 - Unknown, narrowing và boundary validation: đừng tin dữ liệu ngoài

**Thời lượng thường gặp:** 5-6 giờ  
**Prerequisite:** TS01-TS02  
**Exit outcome:** M dùng <code>unknown</code> cho external data/error, narrow bằng runtime evidence, viết type guard nhỏ và không dùng cast như validation.

## Mental model

TypeScript types bị xóa trước runtime. Data từ JSON, environment, HTML, HTTP hay local storage không tự tuân type annotation.

~~~text
external bytes/text/value
→ unknown
→ runtime checks/parse
→ trusted typed value
→ business/test logic
~~~

<code>any</code> tắt kiểm tra: m có thể đọc/call gần như mọi thứ. <code>unknown</code> buộc m chứng minh trước khi dùng.

~~~ts
function printValue(value: unknown) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}
~~~

<code>typeof</code>, <code>Array.isArray</code>, equality trên discriminant và property checks tạo narrowing. Type guard gom runtime checks thành function có predicate:

~~~ts
function isOrderStatus(value: unknown): value is OrderStatus {
  return value === 'RECEIVED'
    || value === 'PROCESSING'
    || value === 'READY_FOR_PICKUP'
    || value === 'COMPLETED'
    || value === 'CANCELLED';
}
~~~

Cast <code>value as OrderStatus</code> chỉ bảo checker tin. Nó không kiểm tra value ở runtime. Cast không phải parse/validation.

Trong <code>catch</code>, error nên được coi là unknown: JavaScript có thể throw bất kỳ value nào, không chỉ <code>Error</code>.

~~~ts
try {
  // work
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Non-Error thrown', error);
  }
}
~~~

Exhaustive check giúp compiler báo khi union thêm variant:

~~~ts
function assertNever(value: never): never {
  throw new Error('Unhandled value: ' + String(value));
}
~~~

## Worked example

Ta parse một fixture JSON thay vì annotate mù:

~~~ts
type OrderStatus =
  | 'RECEIVED'
  | 'PROCESSING'
  | 'READY_FOR_PICKUP'
  | 'COMPLETED'
  | 'CANCELLED';

type OrderFixture = {
  code: string;
  status: OrderStatus;
  total: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return value === 'RECEIVED'
    || value === 'PROCESSING'
    || value === 'READY_FOR_PICKUP'
    || value === 'COMPLETED'
    || value === 'CANCELLED';
}

function parseOrderFixture(value: unknown): OrderFixture {
  if (!isRecord(value)) {
    throw new Error('Order fixture must be an object');
  }

  if (typeof value.code !== 'string' || value.code.length === 0) {
    throw new Error('Order fixture requires a non-empty code');
  }

  if (!isOrderStatus(value.status)) {
    throw new Error('Order fixture has an invalid status');
  }

  if (typeof value.total !== 'number' || !Number.isFinite(value.total)) {
    throw new Error('Order fixture requires a finite total');
  }

  return {
    code: value.code,
    status: value.status,
    total: value.total
  };
}

const external: unknown = JSON.parse('{"code":"LD-001","status":"RECEIVED","total":75000}');
const order = parseOrderFixture(external);
console.log(order.status);
~~~

Checker chỉ cho return typed object vì từng field đã được narrowed. Đây là validation nhỏ cho bài học; project thật có thể dùng schema library theo convention, không tự xây framework validation lớn.

## Prediction

Cho code:

~~~ts
const external: unknown = JSON.parse('{"status":"READY"}');

console.log(external.status);
console.log((external as { status: OrderStatus }).status);
~~~

Dòng nào checker chặn? Dòng cast có chạy không? Runtime value trở thành canonical status thật chưa?

Prediction narrowing:

~~~ts
function describe(value: unknown): string {
  if (typeof value === 'string') {
    return 'text ' + value.length;
  }

  if (typeof value === 'number') {
    return 'number ' + value.toFixed(0);
  }

  return 'other';
}
~~~

Tại mỗi branch, checker biết gì? <code>null</code> đi branch nào?

## Completion task

Hoàn thành parser cho external transaction:

Artifact: <code>foundations/work/ts03.ts</code>; command: <code>npm run lab:ts03</code>.

~~~ts
type PaymentMethod = 'CASH' | 'BANK_TRANSFER_MANUAL';

type PaymentTransaction =
  | { type: 'COLLECTION'; amount: number; method: PaymentMethod }
  | { type: 'REFUND'; amount: number; method: PaymentMethod; reason: string };

function parseTransaction(value: unknown): PaymentTransaction {
  // TODO object guard
  // TODO positive finite amount
  // TODO payment method guard
  // TODO discriminate COLLECTION/REFUND
  // TODO require non-empty reason only for REFUND
  // TODO reject unknown type
}
~~~

Tests phải có valid variants và ít nhất sáu invalid shapes. Không dùng <code>as PaymentTransaction</code> trong parser.

## Independent task

Tạo loader cho một scenario file:

~~~text
scenario
  role: STAFF | MANAGER
  orderCode: non-empty string
  expectedStatus: canonical status
  expectedVisibleActions: string[]
~~~

Đọc JSON thành <code>unknown</code>, validate/narrow, rồi dùng typed scenario tạo test title strings. Yêu cầu:

- error chỉ rõ field/path;
- empty actions hợp lệ nếu có chủ đích;
- array phải chứa toàn string;
- unknown extra fields có policy rõ: ignore hoặc reject, giải thích lựa chọn;
- invalid fixture làm command exit non-zero.

Nếu chọn reject extra field, <code>Object.keys(value)</code> cho danh sách key runtime;
<code>allowedFields.includes(key)</code> kiểm tra key có nằm trong danh sách cho phép. Đây là tool
nhỏ của boundary policy, không phải cast. Viết <code>allowedFields: string[]</code> để checker hiểu
mọi key string có thể được kiểm tra mà không cần <code>as</code>.

## Failure injection

### Failure A - cast-only parser

~~~ts
function parseOrder(value: unknown): OrderFixture {
  return value as OrderFixture;
}
~~~

Đưa missing code/wrong total; typecheck xanh, runtime logic sai. Ghi vì sao cast chỉ đổi checker view.

### Failure B - <code>typeof null === 'object'</code>

Object guard chỉ kiểm tra <code>typeof value === 'object'</code>. Test với null và sửa.

### Failure C - array cũng là object

Đưa <code>[]</code> vào <code>isRecord</code>. Quyết định parser của m chấp nhận hay reject array; implement evidence đúng policy.

### Failure D - error assumed Error

Provided function <code>throw 'boom'</code>. Catch rồi đọc <code>error.message</code> khi error unknown. Narrow đúng và giữ evidence.

### Failure E - incomplete union switch

~~~ts
function statusLabel(status: OrderStatus): string {
  switch (status) {
    // intentionally omit CANCELLED
  }
}
~~~

Dùng <code>assertNever</code> ở default. Sau đó thêm status giả trong practice union và quan sát compile location.

## Transfer

Trong automation, các boundary thường gặp:

- <code>response.json()</code>;
- environment variables;
- JSON fixtures;
- values từ page evaluation;
- error trong catch;
- config đọc từ file.

Cho API-like response sandbox, viết chain:

~~~text
HTTP status assertion
→ parse JSON as unknown
→ validate minimal response shape
→ assert business fields
~~~

Không thêm REST route vào Laundry production chỉ để thực hiện bài này. Dùng sandbox API. Khi chuyển sang app thật, browser-visible HTML và Spring tests vẫn là contract chính của server-rendered architecture.

## Gate TS03

Pass khi m:

- giải thích <code>unknown</code> khác <code>any</code>;
- narrow string/number/object/array và error;
- viết type guard cho literal union;
- parse external object không cast-only;
- dùng exhaustive check để lộ variant thiếu;
- hoàn thành scenario loader + malformed variation no-AI.

### No-AI drill TS03 - 50 phút

Nhận năm JSON strings gồm hai valid, ba invalid. Parse unknown, tạo typed values hoặc explicit errors, thêm một variant mới và sửa exhaustiveness mà không dùng <code>any</code>/<code>as DomainType</code>.

---

# TS04 - TypeScript trong Playwright: fixture, helper và failure layers

**Thời lượng thường gặp:** 5-6 giờ  
**Prerequisite:** TS01-TS03 và JS08  
**Exit outcome:** M viết typed Playwright spec/helper/data, đọc library types ở mức cần thiết, phân biệt typecheck với browser failure và hoàn thành capstone foundation không AI.

## Mental model

Trong Playwright Test, TypeScript tạo feedback cho test code trước hoặc khi runner collect spec. Library cung cấp types cho <code>test</code>, fixtures, <code>Page</code>, <code>Locator</code>, config và assertions.

~~~text
test source + Playwright declarations + tsconfig
→ parser/type checker
→ runner collects tests
→ fixtures created
→ async callback runs
→ browser actions + web assertions
→ report/trace
~~~

Failure layer quyết định evidence:

| Failure | Browser có launch không? | Evidence đầu tiên |
|---|---:|---|
| syntax/type/import | thường chưa | checker/collection message + own line |
| no tests collected | không có test callback | config, testDir, filename |
| fixture setup | có thể chưa vào body | setup/fixture stack |
| locator/action | có page | call log + trace/DOM |
| assertion | có behavior actual | expected/actual + trace/network |

Type annotations nên nằm ở boundary/helper, không phủ kín mọi local variable vốn inference tốt.

~~~ts
import type { Locator, Page } from '@playwright/test';

async function openOrder(page: Page, orderCode: string): Promise<void> {
  const row: Locator = page
    .getByRole('row')
    .filter({ hasText: orderCode });

  await row.getByRole('link', { name: 'Chi tiết' }).click();
}
~~~

Trong ví dụ, annotation <code>Locator</code> không bắt buộc vì inference đủ; giữ hay bỏ tùy clarity. <code>Promise&lt;void&gt;</code> làm async helper contract rõ cho learner.

Generic xuất hiện trong fixture/config/library declarations. Foundation chỉ cần mental model “type parameter cho phép cùng một structure giữ type cụ thể”. Không cần tự thiết kế generic framework trước khi làm được suite bình thường.

## Worked example

Typed scenario và helper:

~~~ts
import { test, expect, type Page } from '@playwright/test';

type ServiceExpectation = {
  readonly name: string;
  readonly unit: 'KG' | 'ITEM';
  readonly priceText: string;
};

async function expectServiceRow(
  page: Page,
  expected: ServiceExpectation
): Promise<void> {
  const row = page
    .getByRole('row')
    .filter({ hasText: expected.name });

  await expect(row).toContainText(expected.unit);
  await expect(row).toContainText(expected.priceText);
}

test('visitor sees the active service price snapshot', async ({ page }) => {
  const expected: ServiceExpectation = {
    name: 'Giặt sấy quần áo',
    unit: 'KG',
    priceText: '25.000 ₫'
  };

  await page.goto('/services');
  await expectServiceRow(page, expected);
});
~~~

Helper nhận explicit dependency <code>page</code> và expected data. Nó vừa action/assertion helper; name <code>expect...</code> làm hidden assertion ít bất ngờ hơn. Không tạo class/POM chỉ để bọc một locator.

Type checker bắt unit <code>'KILOGRAM'</code>, missing name, number thay priceText và typo property. Runtime assertion vẫn cần vì DOM có thể sai.

## Prediction

Phân loại type/collection/runtime:

~~~ts
type Scenario = {
  code: string;
  expectedStatus: 'RECEIVED' | 'PROCESSING';
};

const scenario: Scenario = {
  code: 'LD-001',
  expectedStatus: 'READY_FOR_PICKUP'
};

test('order status', async ({ page }) => {
  await page.goto('/orders');
  const row = page.getByRole('row').filter({ hasText: scenario.orderCode });
  expect(row).toContainText(scenario.expectedStatus);
});
~~~

Có ít nhất ba lỗi/risk khác layer. Ghi thứ tự toolchain có thể dừng; nếu type error đầu tiên chưa sửa, m không có evidence runtime cho locator.

Prediction helper:

~~~ts
async function savePhone(page: Page, phone: string): Promise<void> {
  page.getByLabel('Số điện thoại').fill(phone);
  page.getByRole('button', { name: 'Lưu' }).click();
}

await savePhone(page, '0912345678');
~~~

Function return Promise và caller await, nhưng bên trong vẫn thiếu await. Tại sao outer await không tự chờ inner promises bị bỏ rơi?

## Completion task

Starter cung cấp:

Helper artifact: <code>foundations/work/ts04.ts</code>; spec thật:
<code>tests/work/foundation/ts04_bridge.spec.ts</code>; command: <code>npm run lab:ts04</code>.

~~~ts
type OrderScenario = {
  code: string;
  expectedCustomer: string;
  expectedStatus: 'RECEIVED' | 'PROCESSING' | 'READY_FOR_PICKUP';
};

async function openOrderByCode(/* TODO */): /* TODO */ {
  // TODO scoped row and click
}
~~~

Hoàn thành:

- typed <code>Page</code> parameter;
- <code>Promise&lt;void&gt;</code> return;
- semantic row selection by code;
- all inner Promises awaited;
- spec dùng scenario và assertions trên đúng detail;
- <code>npm run typecheck</code> và focused Playwright command đều pass.

Sau đó mở <code>foundations/type-tests/ts04.learner-errors.ts</code>, tạo intentional invalid
scenario: wrong status và missing customer. Checker phải phát hiện. Sau browser attempt, đổi marker
trong <code>tests/work/foundation/ts04_bridge.spec.ts</code> từ <code>test.fixme</code> thành
<code>test</code>; <code>npm run lab:ts04</code> sẽ chấm helper, strict typecheck và spec thật, đồng thời
fail nếu test vẫn bị skip.

## Independent task

Viết ba specs từ requirement, không nhìn worked example:

1. Visitor sees a named active service with correct unit and price.
2. Staff opens an order by business code after table reorder.
3. Slow form saves phone and displays user-visible success.

Tạo tối đa hai helpers và một typed data module. Constraints:

- Không CSS/XPath/<code>nth()</code>/<code>waitForTimeout</code>.
- Không <code>any</code>, <code>@ts-ignore</code> hay non-null assertion để lách checker.
- Không expected-from-actual.
- Không shared mutable scenario object.
- Mỗi spec có business outcome assertion.
- Chạy từng spec, toàn file, repeat và typecheck.

## Failure injection

### Failure A - type-only confidence

Đổi expected price thành một string hợp type nhưng sai requirement. Typecheck xanh, assertion đỏ. Ghi vai trò khác nhau của checker/oracle.

### Failure B - helper mất Promise

Xóa <code>async</code>/<code>return</code> phù hợp hoặc bỏ inner await. Caller có thể await <code>undefined</code>/fulfilled helper sớm. Dùng trace/call log và fix contract.

### Failure C - stale/wide scenario type

Dùng <code>expectedStatus: string</code>; typo lọt. Thu hẹp literal union.

### Failure D - fixture/data mutation

Một test sửa object exported dùng chung. Chạy riêng rồi cả suite/reorder để chứng minh pollution. Sửa bằng factory/fresh object và owner contract.

### Failure E - wrong failure layer

Tạo import error rồi thử tăng Playwright timeout. Giải thích vì sao browser chưa chạy nên timeout không liên quan.

## Transfer

Chọn một flow canonical Laundry, ví dụ UC-09 create order, và chỉ thiết kế typed E2E contract - không invent API:

~~~ts
type CreateOrderScenario = {
  actor: 'STAFF' | 'MANAGER';
  customerPhone: string;
  items: ReadonlyArray<{
    serviceCode: string;
    quantity: number;
  }>;
  expected: {
    initialStatus: 'RECEIVED';
    paymentRows: 0;
  };
};
~~~

Viết notes:

- type nào chỉ bảo vệ test data;
- business oracle nào cần server-visible/HTML evidence;
- canonical authority nào không được tính lại ở browser;
- data setup/cleanup blocker nào cần giải quyết sau;
- Spring flow nào sẽ được học reverse khi SWP bắt đầu.

## Gate TS04

Pass khi m:

- trace được typecheck → collection → fixture → callback → browser → assertion;
- viết typed helper không mất Promise;
- dùng literal/object types cho scenario;
- phân biệt type, collection, action và assertion failure;
- ba independent specs pass typecheck, isolated, repeat và reorder;
- transfer UC-09 không thêm architecture ngoài canonical scope.

### No-AI drill TS04 - 60 phút

Nhận một typed spec có bốn lỗi cài sẵn thuộc bốn tầng. Không chat/reference solution: phân loại, sửa theo tầng, chạy focused regression và viết root-cause journal.

---

# Foundation Capstone - 90 phút không AI

Capstone này là gate cuối Part I và là checkpoint cuối tuần 3. Không cần hoàn hảo; nó đo khả năng tự bắt đầu, giữ mental model và debug khi không có AI làm hộ.

## Input

M nhận:

- một requirement ngắn về order/service sandbox;
- một JSON scenario chưa được tin;
- một pure JS/TS helper có một bug;
- một Playwright starter spec có một bug khác tầng;
- commands đã được ghi trong lab README.

## Nhiệm vụ

### 1. Orient - 10 phút

- xác định root/scripts;
- chạy baseline;
- ghi first meaningful failures;
- không sửa trong ba phút đầu;
- tạo tối đa ba hypotheses.

### 2. Data/type - 20 phút

- đọc JSON thành unknown;
- validate shape tối thiểu;
- tạo typed scenario không <code>any</code>/cast-only;
- typecheck.

### 3. Pure behavior - 15 phút

- viết hoặc sửa function;
- thêm oracle độc lập;
- cài một negative/boundary case;
- chứng minh test đỏ trước fix hoặc mutation đỏ sau fix.

### 4. Browser behavior - 25 phút

- viết/sửa semantic locator;
- await đúng dependency;
- assertion user-visible bằng business identity;
- không sleep/index coupling.

### 5. Failure/evidence - 10 phút

- kích hoạt seeded bug còn lại;
- ghi expected/actual/hypothesis/evidence/root cause;
- chạy focused regression.

### 6. Teach-back - 10 phút

Không nhìn note, kể:

~~~text
command
→ module/typecheck
→ test registration
→ fixture callback
→ Promise/action
→ DOM locator
→ assertion/oracle
→ report
~~~

## Rubric 10 điểm

| Tiêu chí | 0 | 1 | 2 |
|---|---|---|---|
| Orient/predict | sửa mò | có prediction nhưng thiếu layer | khoanh layer và evidence trước sửa |
| JavaScript | không tự hoàn thành | happy path chạy nhờ hint cũ | function/data/control flow + negative case độc lập |
| TypeScript | dùng any/cast để lách | typecheck nhưng contract rộng | unknown boundary + strict useful types |
| Playwright | script click/sleep/index | flow chạy nhưng oracle yếu | semantic, awaited, business outcome |
| Diagnose/teach | kể thao tác | có symptom và fix | root cause, evidence, regression và transfer |

Pass khi từ 8/10 và không có 0 ở JavaScript, TypeScript, Playwright hoặc Diagnose. Nếu chưa pass, tạo đúng một repair card cho tiêu chí thấp nhất và retest bằng variation mới trong 48 giờ. Không xem full solution rồi tự chấm lại cùng đề.

## Handoff sang Part II

Pass Foundation không có nghĩa m đã job-ready hoặc xây được toàn SWP. Nó nghĩa m có đủ ngôn ngữ và debugging hygiene để bắt đầu:

- Playwright core: HTTP/DOM/accessibility/auto-wait/isolation/auth/trace;
- Spring reverse: Browser → HTTP → Security → MVC → Service → Repository/DB → HTML;
- canonical Laundry vertical slices;
- CI baseline sau khi local suite đáng tin.

Docker chưa phải prerequisite của Part I. Trong ba tuần đầu, biết chạy một command/container stack có sẵn nếu repo yêu cầu là đủ. Không dùng Docker/CI course như cách trốn lỗ hổng function, async, type hoặc test oracle.

---

# Review queue cho ba tuần foundation

Mỗi prompt làm không nhìn note trước, rồi mới kiểm tra:

| Khi nào | Retrieval prompt |
|---|---|
| D+1 QA00 | Năm failure layers và evidence đầu tiên? |
| D+1 JS01 | <code>'2' + 1</code>, <code>'2' * 1</code>, <code>Boolean('false')</code>? |
| D+1 JS02 | Viết role matrix và một unknown branch. |
| D+1 JS03 | Definition/call, parameter/argument, log/return? |
| D+1 JS04 | <code>find</code> khác index; shallow copy dùng chung gì? |
| D+1 JS05 | Name/path/module mismatch dừng ở tầng nào? |
| D+1 JS06 | Async function trả gì; await dừng cái gì? |
| D+1 JS07 | Oracle đến từ đâu; mutation nào suite phải bắt? |
| D+1 JS08 | Runner, callback, fixture, locator, action, assertion? |
| D+1 TS01 | Inference/annotation; type-safe vs correct behavior? |
| D+1 TS02 | Union/optional/readonly/discriminant? |
| D+1 TS03 | Unknown → narrow → trusted value; cast thiếu gì? |
| D+1 TS04 | Type → collection → fixture → runtime failure chain? |

D+3: làm lại một completion task nhưng đổi data shape/name.  
D+7: làm independent task cũ từ file trắng hoặc một equivalent variation.  
D+14: seeded bug khác tầng và teach-back 5 phút.

# Foundation definition of learned

Một chapter chỉ chuyển sang <code>LEARNED</code> khi m:

1. dự đoán behavior trước run;
2. hoàn thành independent task không walkthrough;
3. giải thích data/control/timeline bằng lời của m;
4. tìm một seeded failure bằng hypothesis và evidence;
5. làm transfer khác example;
6. recall lại sau khoảng cách;
7. làm no-AI drill tương ứng.

Nếu m chỉ nhận ra code khi nhìn thấy, đó là recognition. Nếu m tự dựng được từ contract, chẩn đoán variation và giải thích được, đó mới là usable skill.

---
