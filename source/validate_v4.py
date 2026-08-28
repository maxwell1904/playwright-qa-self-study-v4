#!/usr/bin/env python3
"""Structural, zero-readiness and canonical gates for Self-Study v4."""

from __future__ import annotations

import json
import re
from pathlib import Path

from pypdf import PdfReader


SOURCE = Path(__file__).resolve().parent
ROOT = SOURCE.parent
TEACHING_FILES = [
    SOURCE / "teaching/00_learning_contract.md",
    SOURCE / "teaching/01_zero_foundation.md",
    SOURCE / "teaching/02_qa_api_sql_ci.md",
    SOURCE / "teaching/03_playwright_core.md",
    SOURCE / "teaching/04_spring_swp_full.md",
]
TEACHING = "\n".join(path.read_text(encoding="utf-8") for path in TEACHING_FILES)
CAREER = (SOURCE / "career_playbook_v4.md").read_text(encoding="utf-8")
HINTS = (SOURCE / "hints_and_rubrics_v4.md").read_text(encoding="utf-8")
LAB_CONTRACT_PATH = SOURCE / "lab_contracts_v4.json"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"FAIL: {message}")


for path in TEACHING_FILES:
    require(path.exists(), f"missing teaching source {path.name}")
    text = path.read_text(encoding="utf-8")
    require(text.count("```") % 2 == 0, f"unbalanced code fences in {path.name}")
    require(
        len(re.findall(r"^~~~", text, flags=re.MULTILINE)) % 2 == 0,
        f"unbalanced tilde code fences in {path.name}",
    )

word_count = len(re.findall(r"\S+", TEACHING))
require(word_count >= 35_000, f"teaching layer unexpectedly short: {word_count} words")

for token in [
    "QA00",
    *[f"JS{i:02d}" for i in range(1, 9)],
    *[f"TS{i:02d}" for i in range(1, 5)],
    *[f"P{i:02d}" for i in range(1, 12)],
    "J00",
    *[f"S{i:02d}" for i in range(1, 8)],
    *[f"W{i}" for i in range(1, 9)],
]:
    require(token in TEACHING, f"teaching coverage misses {token}")

for block in [
    "Mental model",
    "Worked example",
    "Prediction",
    "Completion",
    "Independent",
    "Failure injection",
    "Transfer",
    "Gate",
    "No-AI",
]:
    require(block.lower() in TEACHING.lower(), f"zero-ready teaching block missing: {block}")

for concept in [
    "condition",
    "loop",
    "function",
    "array",
    "object",
    "reference",
    "module",
    "Promise",
    "async/await",
    "TypeScript strict",
    "union",
    "narrowing",
    "unknown",
    "runtime validation",
    "semantic locator",
    "actionability",
    "data ownership",
    "APIRequestContext",
    "SQL",
    "CI",
]:
    require(concept.lower() in TEACHING.lower(), f"required foundation/job concept missing: {concept}")

for uc in range(1, 31):
    require(f"UC-{uc:02d}" in TEACHING, f"canonical coverage misses UC-{uc:02d}")

for token in [
    "39 BR",
    "9 core tables",
    "5 order statuses",
    "Spring Boot 4.1.x",
    "Spring MVC + Thymeleaf",
    "Spring Security session + CSRF",
    "PostgreSQL + Flyway",
    "Asia/Ho_Chi_Minh",
    "immutable ledger",
    "pessimistic write",
    "Không thêm REST",
]:
    require(token.lower() in TEACHING.lower(), f"canonical guardrail missing: {token}")

for week in range(1, 13):
    require(f"Tuần {week}" in CAREER, f"career playbook misses week {week}")

for token in [
    "ba tuần runway",
    "full-SWP",
    "CI/CD hay Docker trước",
    "English lane",
    "AI-dependence recovery contract",
    "random change",
    "seeded failure",
]:
    require(token.lower() in CAREER.lower(), f"personalized playbook misses: {token}")

for token in [
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "W8 - Graduation scoring",
    "Final answer-key boundary",
]:
    require(token in HINTS, f"hint companion misses {token}")

for relative in [
    "START_HERE.md",
    "source/progress/CONTROL_PANEL.md",
    "source/progress/SESSION_TEMPLATE.md",
    "source/progress/WEEKLY_REVIEW.md",
    "lab-kit/package.json",
    "lab-kit/README.md",
    "lab-kit/src/server.mjs",
    "lab-kit/playwright.config.ts",
]:
    require((ROOT / relative).exists(), f"missing pack artifact {relative}")

package = (ROOT / "lab-kit/package.json").read_text(encoding="utf-8")
package_data = json.loads(package)
for token in ["typescript", "typecheck", "check:kit", "status"]:
    require(token in package, f"lab package misses {token}")

require(LAB_CONTRACT_PATH.exists(), "missing executable lab contract manifest")
lab_contract = json.loads(LAB_CONTRACT_PATH.read_text(encoding="utf-8"))
require(lab_contract.get("schemaVersion") == 1, "unsupported lab contract schema")
modules = lab_contract.get("modules", [])
module_ids = [module.get("id") for module in modules]
require(len(module_ids) == len(set(module_ids)), "duplicate module ID in lab contract")
for required_id in [
    "QA00",
    *[f"JS{i:02d}" for i in range(1, 9)],
    *[f"TS{i:02d}" for i in range(1, 5)],
    *[f"P{i:02d}" for i in range(1, 12)],
    *[f"J{i:02d}" for i in range(1, 8)],
    "J00",
    *[f"S{i:02d}" for i in range(1, 8)],
    *[f"W{i}" for i in range(1, 9)],
]:
    require(required_id in module_ids, f"lab contract misses {required_id}")

for grouped_id in ["S01-S02", "S03-S04", "S06-S07"]:
    require(grouped_id not in module_ids, f"legacy grouped lab contract remains: {grouped_id}")

for module in modules:
    module_id = module["id"]
    teaching_path = ROOT / module["teachingSource"]
    require(teaching_path.exists(), f"{module_id} teaching source missing")
    teaching_text = teaching_path.read_text(encoding="utf-8")
    require(module_id in teaching_text, f"{module_id} not present in its teaching source")
    for mention in module.get("mentions", []):
        require(mention in teaching_text, f"{module_id} teaching does not mention {mention}")
    for artifact in module.get("artifacts", []):
        require((ROOT / artifact).exists(), f"{module_id} missing declared artifact {artifact}")
    for script in module.get("scripts", []):
        require(script in package_data.get("scripts", {}), f"{module_id} missing npm script {script}")

for stale_path in [
    "labs/qa00/hello.mjs",
    "labs/js01/starter/service-summary.mjs",
    "labs/js02/predict.mjs",
    "lab:js02:predict",
]:
    require(stale_path not in TEACHING, f"stale nonexistent lab path remains: {stale_path}")

require((ROOT / "lab-kit/scripts/audit-zero-readiness.mjs").exists(), "missing zero-readiness regression audit")

for lesson in [
    "qa00",
    *[f"js{i:02d}" for i in range(1, 9)],
    *[f"ts{i:02d}" for i in range(1, 5)],
]:
    extension = "ts" if lesson.startswith("ts") else "mjs"
    for layer in ["worked", "work", "reference"]:
        require(
            (ROOT / f"lab-kit/foundations/{layer}/{lesson}.{extension}").exists(),
            f"foundation {lesson} misses {layer}",
        )
    test_extension = "ts" if extension == "ts" else "mjs"
    require(
        (ROOT / f"lab-kit/foundations/tests/{lesson}.test.{test_extension}").exists(),
        f"foundation {lesson} misses executable contract",
    )

for mission in [
    "p01_anatomy.spec.ts",
    "p02_locators.spec.ts",
    "p03_sync.spec.ts",
    "p04_controls.spec.ts",
    "p05_isolation.spec.ts",
    "p06_auth.spec.ts",
    "p08_api.spec.ts",
    "p10_ci.spec.ts",
]:
    require((ROOT / "lab-kit/tests/work" / mission).exists(), f"work mission missing: {mission}")
require((ROOT / "lab-kit/tests/work/p07_refactor/refactor.spec.ts").exists(), "P07 mission missing")
require((ROOT / "lab-kit/tests/work/p09_seeded_bugs").is_dir(), "P09 seeded bugs missing")
require((ROOT / "lab-kit/tests/work/p11_capstone.spec.ts").exists(), "P11 mission missing")

workflow = (ROOT / "lab-kit/.github/workflows/playwright.yml").read_text(encoding="utf-8")
for token in [
    "npm ci",
    "playwright install --with-deps chromium",
    "npm run typecheck",
    "foundation:test:reference",
    "npm run check:kit",
    "if: always()",
    "playwright-report/",
    "test-results/",
]:
    require(token in workflow, f"active CI workflow misses contract: {token}")

pdfs = [
    ROOT / "pdf/01_Zero_to_Playwright_QA_SWP391_v4.pdf",
    ROOT / "pdf/02_12_Week_Career_Playbook_v4.pdf",
    ROOT / "pdf/03_Hints_Rubrics_and_Answer_Keys_v4.pdf",
]
minimum_pages = [70, 25, 20]
for pdf, minimum in zip(pdfs, minimum_pages, strict=True):
    require(pdf.exists(), f"missing PDF {pdf.name}")
    reader = PdfReader(pdf)
    require(len(reader.pages) >= minimum, f"PDF too short: {pdf.name} ({len(reader.pages)})")
    require(len(reader.outline) >= 10, f"PDF bookmarks missing: {pdf.name}")
    annotations = sum(len(page.get("/Annots", []) or []) for page in reader.pages)
    require(annotations >= 10, f"PDF navigation/links missing: {pdf.name}")

require(
    not re.search(r"\bTBD\b|(?<!\$)\{\{.+?\}\}", TEACHING),
    "unresolved teaching placeholder",
)
print(f"PASS: v4 teaching={word_count} words, zero foundation, career routing, canonical coverage and PDFs")
