# Self-Study v4 package map

| Path | Vai trò |
| --- | --- |
| `START_HERE.md` | điểm bắt đầu duy nhất |
| `pdf/` | ba learner/companion PDF |
| `source/teaching/` | teaching volume source theo phần |
| `source/career_playbook_v4.md` | roadmap 12 tuần và branching |
| `source/hints_and_rubrics_v4.md` | H1-H5, rubrics, answer boundaries |
| `source/progress/` | control panel, session và weekly review |
| `lab-kit/` | runnable foundation/Playwright/QA/CI labs |
| `source/render_v4.py` | PDF renderer |
| `source/validate_v4.py` | structural/zero/canonical/PDF gate |
| `source/lab_contracts_v4.json` | source → artifact → npm script executable contract |
| `RELEASE_QA.md` | bằng chứng kiểm thử của bản phát hành |

## Clone ở máy khác

Repo public nên có thể clone ở máy công ty mà không cần đăng nhập GitHub:

```bash
git clone https://github.com/maxwell1904/playwright-qa-self-study-v4.git
cd playwright-qa-self-study-v4/lab-kit
npm ci
npx playwright install chromium
npm run status
```

`source/progress/` đi cùng Git để đồng bộ tiến trình. Không commit `node_modules`, report,
test-results, file `.env` hay dữ liệu/source nội bộ của công ty.

## Source volume order

Teaching PDF được ghép theo thứ tự:

1. `00_learning_contract.md`
2. `01_zero_foundation.md`
3. `02_qa_api_sql_ci.md`
4. `03_playwright_core.md`
5. `04_spring_swp_full.md`

## Version policy

V4 là folder độc lập. Không overwrite/xóa v3 cho tới khi m đã học thử runway và xác nhận nhịp. Khi sửa nội dung, cập nhật source + manifest trước, render lại cả PDF bị ảnh hưởng và chạy `npm run check:all`, validator + visual QA.
