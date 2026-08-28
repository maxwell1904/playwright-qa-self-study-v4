# 00 - Hợp đồng học tập cá nhân hóa

## Bản này được thiết kế cho ai?

V4 không giả định m đã biết lập trình. Điểm xuất phát được xem là **zero có kinh nghiệm dùng AI**, nghĩa là m có thể đã nhìn thấy code nhiều lần nhưng chưa chắc tự tạo, giải thích, sửa biến thể hoặc debug được khi đóng cửa sổ chat.

Thông tin dùng để cá nhân hóa bản này:

- kỳ internship còn gần ba tháng;
- SWP391 bắt đầu sau khoảng ba tuần và kéo dài khoảng hai tháng;
- pass môn không phải nút thắt chính, nhưng m muốn tự hiểu và tự làm toàn bộ Laundry;
- m chưa tự tin ở JavaScript, Java, SQL, Git hay testing vì bốn năm phụ thuộc AI;
- đích nghề nghiệp sau internship nằm ở Cần Thơ hoặc Thành phố Hồ Chí Minh;
- tiếng Anh tự đánh giá khoảng IELTS 6.5, đủ để đọc tài liệu và phát triển kỹ năng giải thích kỹ thuật;
- m tự tìm việc; bộ này tập trung tạo năng lực, không biến ba tháng thành khóa viết CV.

Đích của v4 không phải gắn nhãn “Junior” vào tuần 12. Đích là tạo bằng chứng rằng m có thể làm bốn việc khi không có AI viết hộ:

1. biến requirement thành test condition, test case và bug report có lý do;
2. đọc, viết, chạy và debug Playwright bằng JavaScript/TypeScript;
3. lần một feature Laundry từ browser qua Spring tới PostgreSQL và tự sửa biến thể nhỏ;
4. đưa một suite có ý nghĩa lên CI, giải thích failure và bảo vệ quyết định của mình.

## Ba lane, một năng lực chung

| Lane | Việc thật cần đạt | Không biến thành |
| --- | --- | --- |
| Internship | đọc repo, chạy một test, viết/sửa test nhỏ, thu evidence, hỏi đúng câu | copy convention mà không hiểu |
| SWP391 | tự đi hết requirement -> UI -> Controller -> Service -> Repository/DB -> tests -> defense | chia phần xong chỉ biết file mình |
| Nghề QA Automation | testing foundation + JS/TS + Playwright + API + SQL + Git + CI | sưu tầm tool, học Docker/Kubernetes để trông “senior” |

Ba lane dùng chung một mental model: **input nào đi vào, object/state nào thay đổi, outcome nào người dùng quan sát được, failure xuất hiện ở tầng nào, evidence nào phân biệt các giả thuyết**.

## Phán quyết CI/CD và Docker

CI/CD nằm trong core nhưng chỉ học sau khi m đã có test ổn định. M phải biết đọc một workflow, chạy clean install, cung cấp environment an toàn, chạy suite, lấy report/trace artifact và phân biệt test fail với infrastructure fail.

Docker không phải nhánh học chính trong ba tháng này. M chỉ cần operational literacy khi project hoặc công ty dùng nó:

- image khác container ra sao;
- port host/container;
- environment variable;
- start, stop, inspect và logs;
- đọc một `compose.yaml` có sẵn để chạy app + PostgreSQL.

Chưa học sâu Dockerfile optimization, networking nâng cao, Kubernetes, cloud platform hay DevOps pipeline architecture. Thời gian đó có lợi hơn nếu đổ vào test design, JS/TS, Playwright, API, SQL và debug.

## Nhịp thực tế: ba tuần runway, tám tuần SWP, một tuần consolidation

M không cần hoàn tất toàn bộ JavaScript trước khi nhìn Playwright. Tuy nhiên, do điểm xuất phát là zero, ba tuần đầu không được bỏ foundation gate.

```text
Tuần 1-3   Zero runway
           QA thinking + runtime/Git + JS/TS + HTTP/DOM + Playwright nhỏ

Tuần 4-11  SWP term
           build toàn bộ Laundry theo vertical slices
           Playwright, API/HTTP evidence, SQL và Spring reverse đi cùng feature

Tuần 12    Consolidation
           random change + seeded bug + clean-run + defense + CI evidence
```

Đây là bản đồ tải, không phải lời hứa rằng mọi người zero đều mastery sau đúng 12 tuần. Foundation và Playwright core chứa khoảng hơn 100 giờ active practice. Nếu một tuần chỉ có sáu giờ, curriculum tự kéo dài; m không được “pass” gate bằng cách đọc đáp án để giữ lịch đẹp.

## Một concept được dạy như thế nào

Mỗi lesson trong teaching volume dùng cùng một chuỗi. Nếu một lesson thiếu mắt xích, đó là lỗi tài liệu chứ không phải lỗi kỷ luật của m.

| Pha | M làm gì | Bằng chứng |
| --- | --- | --- |
| Problem | gặp tình huống trước thuật ngữ | nói được tại sao concept cần tồn tại |
| Mental model | vẽ data, object, state hoặc timeline | giải thích bằng lời mình |
| Worked | đọc ví dụ hoàn chỉnh, dự đoán từng chặng | output/state prediction trước khi chạy |
| Completion | điền 30-50% phần còn thiếu | test đỏ đúng rồi xanh |
| Independent | chỉ nhận contract và examples | tự tạo code không copy cấu trúc |
| Failure injection | sửa một bug cài sẵn | hypothesis + decisive evidence |
| Transfer | đổi domain hoặc dùng trên Laundry/company-safe flow | làm được biến thể mới |
| Retrieval | quay lại D+1, D+3, D+7, D+14 | trả lời/code từ trí nhớ |

Không có “đọc hiểu rồi”. Một concept chỉ được đánh dấu learned khi m làm được independent, failure và transfer.

## Syntax legend cho người zero

Trong code block, đọc ký hiệu theo thứ tự này:

```ts
const label = status === 'READY' ? 'Sẵn sàng' : 'Chưa sẵn sàng';
```

- `const label`: tạo một binding tên `label` và không gán lại binding này;
- `=`: lấy giá trị bên phải gán vào binding bên trái;
- `status === 'READY'`: so sánh cả giá trị và loại;
- `condition ? valueA : valueB`: nếu condition đúng lấy A, sai lấy B;
- `;`: kết thúc statement; trong JavaScript đôi khi được tự chèn, nhưng curriculum dùng rõ ràng.

Không cần thuộc tên mọi dấu trước khi học. Khi gặp cú pháp lạ, dùng ba câu:

1. Runtime phải làm hành động nào ở dòng này?
2. Dữ liệu đi vào từ đâu và giá trị đi ra đâu?
3. Nếu bỏ hoặc đổi phần này, lỗi thuộc syntax, type, runtime hay assertion?

## Gate 10 điểm

Mỗi mission được chấm năm trục, mỗi trục 0-2.

| Trục | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Predict | chạy ngay hoặc đoán mò | đoán outcome nhưng lý do yếu | dự đoán state/output/failure và nêu why |
| Execute | chỉ chạy được solution | làm theo khung | tự hoàn tất contract từ starter |
| Explain | đọc lại code | kể happy path | kể object, state, timeline và decision |
| Diagnose | sửa mò/copy patch | tìm đúng vùng | hypothesis -> evidence -> root cause -> regression |
| Transfer | chỉ làm ví dụ cũ | đổi data nhỏ | làm flow/requirement khác không AI |

Pass mặc định là **8/10 và không trục nào bằng 0**. Với gate cuối phase, Diagnose và Transfer đều phải đạt 2.

Test xanh chỉ chứng minh runtime chấp nhận outcome vừa kiểm tra. Nó không tự chứng minh m hiểu, test đủ risk, dữ liệu không leak hoặc code chịu được biến thể.

## Luật chống brainrot do AI

AI vẫn được dùng, nhưng theo quyền tăng dần.

### A0 - Closed book

Trong 10-20 phút đầu:

- viết prediction;
- đọc error;
- ghi expected/actual;
- nêu ít nhất hai hypothesis;
- chọn evidence tiếp theo.

Không hỏi AI “làm bài này”.

### A1 - Socratic hint

Được hỏi một câu thu hẹp, ví dụ: “Evidence nào phân biệt locator sai với button bị overlay?” Không nhận code hoàn chỉnh.

### A2 - Evidence review

Đưa prediction, error, trace/log và hypothesis của m. AI được phản biện reasoning hoặc gợi ý phép đo kế tiếp.

### A3 - Patch review

Chỉ mở sau timebox và sau khi m đã ghi root-cause dự đoán. Nếu nhận patch, m phải:

1. giải thích từng thay đổi;
2. đóng patch;
3. tự làm một biến thể khác;
4. gây lại lỗi và chứng minh regression.

### Hai buổi no-agent mỗi tuần

- một buổi 30-45 phút cho code/test;
- một buổi 30-45 phút cho SWP requirement/trace/debug.

Không cần hoàn thành feature lớn. Mục đích là đo kiến thức đang nằm trong đầu m hay trong cửa sổ chat.

## Phiên 20, 45 và 90 phút

### Phiên 20 phút - giữ mạch

1. hai phút đọc restart line;
2. năm phút retrieval không note;
3. mười phút làm một completion step hoặc đọc một failure;
4. ba phút ghi actual + next action.

Không mở concept mới.

### Phiên 45 phút - mặc định

1. năm phút retrieval;
2. mười phút mental model/worked example;
3. hai mươi phút completion hoặc independent;
4. bảy phút failure/transfer;
5. ba phút restart line.

### Phiên 90 phút - deep work

1. mười phút closed-book retrieval;
2. hai mươi phút worked + prediction;
3. ba mươi lăm phút independent task;
4. mười lăm phút seeded bug;
5. mười phút evidence, gate và review queue.

Không dùng phiên 90 phút để xem video liên tục.

## Recovery không tạo “nợ học”

### Nghỉ một hoặc hai ngày

Đọc restart line, làm prompt D+1 và tiếp tục đúng task đang dở.

### Nghỉ ba đến sáu ngày

Làm recovery quiz 20 phút:

1. viết lại mental model từ trí nhớ;
2. chạy một example cũ;
3. sửa một biến thể nhỏ;
4. chọn đúng gate đang rớt.

Không reset phase.

### Nghỉ từ bảy ngày

Lấy một evidence cũ và làm lại independent variant trong 45 phút. Nếu đạt, tiếp tục. Nếu không, quay lại đúng lesson prerequisite bị lộ, không học lại toàn bộ.

## WIP bằng một

Mỗi thời điểm chỉ có một `NOW` mission. Công ty và SWP có thể phát sinh việc, nhưng control panel vẫn ghi một prerequisite trực tiếp đang mở khóa việc đó.

Ví dụ task công ty là sửa login test flaky:

```text
NOW = P06 Auth state
Transfer = task login công ty
Parking lot = P08 suite architecture, Docker, Allure
```

M không vừa học auth, Docker, SQL window function và Spring Security trong cùng tối.

## Definition of learned

Một mục được coi là học xong khi m có đủ:

- code/test hoặc artifact tự làm;
- prediction trước run;
- một failure được chẩn đoán bằng evidence;
- một transfer khác ví dụ mẫu;
- teach-back ba phút;
- review prompt được đặt lịch.

Đối với SWP, “done” còn yêu cầu trace:

```text
actor outcome + business rule
-> screen/route/form
-> Controller
-> focused Service + transaction
-> Repository/JPA + table/Flyway
-> automated proof
-> demo/defense explanation
```

## Setup tối thiểu

Làm theo `lab-kit/README.md`. Lần đầu m cần Node 22+, Git và Chromium của Playwright. Java/PostgreSQL/Maven chỉ kích hoạt khi vào repo Laundry thật.

Sau cài đặt, ba command phải có ý nghĩa khác nhau:

```text
npm run check:kit       kiểm tra reference infrastructure xanh
npm run typecheck       kiểm tra TypeScript compile contract
npm run status          nói rõ learner labs nào còn chưa pass
```

`check:kit` xanh không có nghĩa bài learner đã xong. `status` phải phân biệt reference infrastructure với work missions.

## Bắt đầu đúng

Không làm baseline event-loop như v3. Người zero bắt đầu ở QA00 rồi JS01:

1. mở control panel, điền ngày bắt đầu và lịch SWP dự kiến;
2. làm QA00 requirement-to-test trước khi code;
3. chạy QA00 để thấy edit -> run -> error -> fix loop, rồi mới sang JS01;
4. chỉ mở hints sau timebox;
5. chốt một restart line trước khi nghỉ.

> Hôm nay m không cần chứng minh mình “có tố chất”. M chỉ cần tạo vòng feedback đầu tiên mà không giao quyền suy nghĩ cho AI.
