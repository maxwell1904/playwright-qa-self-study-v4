#!/usr/bin/env python3
"""Render the personalized v4 Markdown volumes to polished, bookmarked PDFs."""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path
from typing import Sequence

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.tableofcontents import TableOfContents


SELF_STUDY = Path(__file__).resolve().parent
PACK_ROOT = SELF_STUDY.parent
PDF_DIR = PACK_ROOT / "pdf"

NAVY = HexColor("#17324D")
BLUE = HexColor("#2F6FED")
GREEN = HexColor("#147A55")
MINT = HexColor("#EAF7F1")
PALE_BLUE = HexColor("#EEF4FF")
INK = HexColor("#1D2732")
MUTED = HexColor("#5F6D7A")
LINE = HexColor("#D5DDE5")
PAPER = HexColor("#FFFFFF")
CODE_BG = HexColor("#F2F5F8")
WARM = HexColor("#FFF6E9")


def register_fonts() -> None:
    fonts = {
        "CourseSans": "/System/Library/Fonts/Supplemental/Arial.ttf",
        "CourseSans-Bold": "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "CourseSans-Italic": "/System/Library/Fonts/Supplemental/Arial Italic.ttf",
        "CourseSans-BoldItalic": "/System/Library/Fonts/Supplemental/Arial Bold Italic.ttf",
        # Courier New contains Vietnamese glyphs. Andale Mono rendered accented
        # Vietnamese in code/comments as mojibake on macOS.
        "CourseMono": "/System/Library/Fonts/Supplemental/Courier New.ttf",
    }
    for name, path in fonts.items():
        pdfmetrics.registerFont(TTFont(name, path))
    pdfmetrics.registerFontFamily(
        "CourseSans",
        normal="CourseSans",
        bold="CourseSans-Bold",
        italic="CourseSans-Italic",
        boldItalic="CourseSans-BoldItalic",
    )


def styles():
    base = getSampleStyleSheet()
    return {
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="CourseSans",
            fontSize=9.4,
            leading=13.7,
            textColor=INK,
            spaceAfter=6.5,
            allowWidows=0,
            allowOrphans=0,
        ),
        "small": ParagraphStyle(
            "Small",
            fontName="CourseSans",
            fontSize=7.8,
            leading=10.5,
            textColor=MUTED,
        ),
        "h1": ParagraphStyle(
            "H1",
            fontName="CourseSans-Bold",
            fontSize=21,
            leading=24,
            textColor=NAVY,
            spaceBefore=2,
            spaceAfter=12,
            keepWithNext=1,
        ),
        "h2": ParagraphStyle(
            "H2",
            fontName="CourseSans-Bold",
            fontSize=14.5,
            leading=18,
            textColor=BLUE,
            spaceBefore=10,
            spaceAfter=6,
            keepWithNext=1,
        ),
        "h3": ParagraphStyle(
            "H3",
            fontName="CourseSans-Bold",
            fontSize=11.2,
            leading=14,
            textColor=GREEN,
            spaceBefore=8,
            spaceAfter=4,
            keepWithNext=1,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            fontName="CourseSans",
            fontSize=9.2,
            leading=13,
            leftIndent=13,
            firstLineIndent=0,
            bulletIndent=2,
            textColor=INK,
            spaceAfter=3.5,
        ),
        "number": ParagraphStyle(
            "Number",
            fontName="CourseSans",
            fontSize=9.2,
            leading=13,
            leftIndent=18,
            firstLineIndent=0,
            bulletIndent=0,
            textColor=INK,
            spaceAfter=3.5,
        ),
        "quote": ParagraphStyle(
            "Quote",
            fontName="CourseSans-Italic",
            fontSize=9.2,
            leading=13.2,
            leftIndent=12,
            rightIndent=8,
            borderColor=GREEN,
            borderWidth=0,
            borderPadding=(7, 9, 7, 10),
            backColor=MINT,
            textColor=INK,
            spaceBefore=5,
            spaceAfter=7,
        ),
        "code": ParagraphStyle(
            "Code",
            fontName="CourseMono",
            fontSize=7.3,
            leading=10.2,
            leftIndent=8,
            rightIndent=8,
            borderColor=LINE,
            borderWidth=0.6,
            borderPadding=8,
            backColor=CODE_BG,
            textColor=HexColor("#243444"),
            spaceBefore=4,
            spaceAfter=8,
        ),
        "table_header": ParagraphStyle(
            "TableHeader",
            fontName="CourseSans-Bold",
            fontSize=7.7,
            leading=9.7,
            textColor=PAPER,
        ),
        "table_cell": ParagraphStyle(
            "TableCell",
            fontName="CourseSans",
            fontSize=7.6,
            leading=10,
            textColor=INK,
        ),
        "cover_title": ParagraphStyle(
            "CoverTitle",
            fontName="CourseSans-Bold",
            fontSize=31,
            leading=34,
            textColor=PAPER,
            alignment=TA_LEFT,
            spaceAfter=14,
        ),
        "cover_subtitle": ParagraphStyle(
            "CoverSubtitle",
            fontName="CourseSans",
            fontSize=15,
            leading=20,
            textColor=HexColor("#DDEBFF"),
            alignment=TA_LEFT,
            spaceAfter=14,
        ),
        "cover_meta": ParagraphStyle(
            "CoverMeta",
            fontName="CourseSans",
            fontSize=10,
            leading=14,
            textColor=PAPER,
        ),
        "toc_title": ParagraphStyle(
            "TOCTitle",
            fontName="CourseSans-Bold",
            fontSize=23,
            leading=27,
            textColor=NAVY,
            spaceAfter=14,
        ),
    }


def plain_text(markdown_text: str) -> str:
    value = re.sub(r"`([^`]+)`", r"\1", markdown_text)
    value = re.sub(r"\*\*([^*]+)\*\*", r"\1", value)
    value = re.sub(r"\[([^]]+)]\([^)]+\)", r"\1", value)
    value = re.sub(r"<[^>]+>", " ", value)
    return html.unescape(value).strip()


def inline(text: str) -> str:
    # Sources intentionally mix Markdown backticks and explicit <code> tags.
    # Stash code spans before escaping so neither form leaks raw markup into PDF.
    code_spans: list[str] = []

    def stash_code(match: re.Match[str]) -> str:
        raw = match.group(1) if match.group(1) is not None else match.group(2)
        token = f"@@CODE{len(code_spans)}@@"
        code_spans.append(html.escape(html.unescape(raw), quote=True))
        return token

    protected = re.sub(r"`([^`]+)`|<code>(.*?)</code>", stash_code, text)
    escaped = html.escape(protected, quote=True)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", escaped)
    escaped = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", escaped)
    escaped = re.sub(
        r"\[([^]]+)]\(([^)]+)\)",
        lambda m: f'<link href="{m.group(2)}" color="#2F6FED"><u>{m.group(1)}</u></link>',
        escaped,
    )
    for index, value in enumerate(code_spans):
        escaped = escaped.replace(
            f"@@CODE{index}@@",
            f'<font name="CourseMono" color="#24405B">{value}</font>',
        )
    return escaped


def slugify(text: str, seen: dict[str, int]) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", plain_text(text).lower()).strip("-") or "section"
    seen[base] = seen.get(base, 0) + 1
    return base if seen[base] == 1 else f"{base}-{seen[base]}"


class CourseDocTemplate(SimpleDocTemplate):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_section = ""

    def beforeDocument(self):
        self.current_section = ""

    def afterFlowable(self, flowable):
        level = getattr(flowable, "heading_level", None)
        if level is None:
            return
        title = getattr(flowable, "heading_text", "")
        key = getattr(flowable, "heading_key", "")
        page = self.canv.getPageNumber()
        self.canv.bookmarkPage(key)
        outline_level = min(level - 1, 2)
        self.canv.addOutlineEntry(title, key, level=outline_level, closed=level > 1)
        if level == 1:
            self.notify("TOCEntry", (0, title, page, key))
        if level == 1:
            self.current_section = title


def add_heading(story, text, level, st, seen):
    if level == 1 and story:
        story.append(PageBreak())
    key = slugify(text, seen)
    p = Paragraph(f'<a name="{key}"/>{inline(text)}', st[f"h{level}"])
    p.heading_level = level
    p.heading_text = plain_text(text)
    p.heading_key = key
    story.append(p)


def table_from_lines(lines: list[str], st, available_width: float):
    rows = []
    for line in lines:
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        rows.append(cells)
    if len(rows) >= 2 and all(re.fullmatch(r":?-{3,}:?", c.replace(" ", "")) for c in rows[1]):
        rows.pop(1)
    col_count = max(len(r) for r in rows)
    for row in rows:
        row.extend([""] * (col_count - len(row)))
    weights = []
    for idx in range(col_count):
        longest = max(len(plain_text(row[idx])) for row in rows)
        weights.append(max(7, min(longest, 34)))
    total = sum(weights)
    widths = [available_width * weight / total for weight in weights]
    rendered = []
    for row_index, row in enumerate(rows):
        style = st["table_header"] if row_index == 0 else st["table_cell"]
        rendered.append([Paragraph(inline(cell), style) for cell in row])
    table = Table(rendered, colWidths=widths, repeatRows=1, hAlign="LEFT", splitByRow=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.45, LINE),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [PAPER, HexColor("#F7F9FB")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def markdown_story(text: str, st, available_width: float):
    lines = text.splitlines()
    # Strip YAML front matter only when it actually starts the document. Horizontal
    # rules later in a long learner volume must never discard preceding chapters.
    first_content = next((i for i, line in enumerate(lines) if line.strip()), -1)
    if first_content >= 0 and lines[first_content].strip() == "---":
        closing = next(
            (i for i in range(first_content + 1, len(lines)) if lines[i].strip() == "---"),
            -1,
        )
        if closing >= 0:
            lines = lines[closing + 1 :]
    story = []
    seen: dict[str, int] = {}
    i = 0
    while i < len(lines):
        raw = lines[i]
        line = raw.rstrip()
        stripped = line.strip()
        if not stripped:
            i += 1
            continue
        if stripped == "---":
            next_index = i + 1
            while next_index < len(lines) and not lines[next_index].strip():
                next_index += 1
            if next_index < len(lines) and re.match(r"^#\s+", lines[next_index].strip()):
                i += 1
                continue
            story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", thickness=0.7, color=LINE, spaceBefore=5, spaceAfter=8))
            i += 1
            continue
        heading = re.match(r"^(#{1,3})\s+(.+)$", stripped)
        if heading:
            add_heading(story, heading.group(2), len(heading.group(1)), st, seen)
            i += 1
            continue
        if stripped.startswith("```") or stripped.startswith("~~~"):
            fence = stripped[:3]
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith(fence):
                code_lines.append(lines[i].rstrip())
                i += 1
            i += 1
            code = "\n".join(code_lines).replace("\t", "    ")
            story.append(Preformatted(code, st["code"], maxLineLength=92, splitChars=" .,:/->"))
            continue
        if stripped.startswith("|") and i + 1 < len(lines) and lines[i + 1].strip().startswith("|"):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            story.append(table_from_lines(table_lines, st, available_width))
            story.append(Spacer(1, 7))
            continue
        bullet = re.match(r"^[-*]\s+(.+)$", stripped)
        if bullet:
            story.append(Paragraph(inline(bullet.group(1)), st["bullet"], bulletText="•"))
            i += 1
            continue
        numbered = re.match(r"^(\d+)\.\s+(.+)$", stripped)
        if numbered:
            story.append(Paragraph(inline(numbered.group(2)), st["number"], bulletText=f"{numbered.group(1)}."))
            i += 1
            continue
        if stripped.startswith(">"):
            quote_lines = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote_lines.append(lines[i].strip()[1:].strip())
                i += 1
            story.append(Paragraph(inline(" ".join(quote_lines)), st["quote"]))
            continue
        paragraph_lines = [stripped]
        i += 1
        while i < len(lines):
            candidate = lines[i].strip()
            if not candidate:
                break
            if (
                candidate == "---"
                or candidate.startswith("#")
                or candidate.startswith("```")
                or candidate.startswith("~~~")
                or candidate.startswith("|")
                or candidate.startswith(">")
                or re.match(r"^[-*]\s+", candidate)
                or re.match(r"^\d+\.\s+", candidate)
            ):
                break
            paragraph_lines.append(candidate)
            i += 1
        story.append(Paragraph(inline(" ".join(paragraph_lines)), st["body"]))
    return story


def draw_cover(canvas, doc, volume_label: str):
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(BLUE)
    canvas.rect(0, height - 16 * mm, width, 16 * mm, fill=1, stroke=0)
    canvas.setFillColor(GREEN)
    canvas.rect(0, 0, 13 * mm, height, fill=1, stroke=0)
    canvas.setStrokeColor(HexColor("#6EA2FF"))
    canvas.setLineWidth(1)
    for offset in (0, 13, 26):
        canvas.line(32 * mm, (35 + offset) * mm, 178 * mm, (35 + offset) * mm)
    canvas.setFont("CourseSans-Bold", 9)
    canvas.setFillColor(PAPER)
    canvas.drawString(24 * mm, 14 * mm, volume_label.upper())
    canvas.restoreState()


def draw_later_page(canvas, doc, short_title: str):
    width, height = A4
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin, height - 15 * mm, width - doc.rightMargin, height - 15 * mm)
    canvas.line(doc.leftMargin, 13 * mm, width - doc.rightMargin, 13 * mm)
    canvas.setFont("CourseSans-Bold", 7.3)
    canvas.setFillColor(NAVY)
    # onLaterPages runs before the first flowable of a page, so a chapter-opening
    # page would otherwise inherit the previous chapter's section title. Use the
    # stable volume label here; bookmarks and the TOC carry chapter navigation.
    canvas.drawString(doc.leftMargin, height - 11.5 * mm, short_title[:88])
    canvas.setFont("CourseSans", 7.3)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - doc.rightMargin, 9.3 * mm, f"{short_title}  •  {canvas.getPageNumber()}")
    canvas.restoreState()


def cover_story(title: str, subtitle: str, volume_label: str, st):
    return [
        Spacer(1, 42 * mm),
        Paragraph(title, st["cover_title"]),
        Paragraph(subtitle, st["cover_subtitle"]),
        Spacer(1, 8 * mm),
        Paragraph(
            "Zero-ready teaching • runnable labs • work evidence • mastery gates • canonical Laundry transfer",
            st["cover_meta"],
        ),
        Spacer(1, 74 * mm),
        Paragraph("Personalized self-study edition v4.0 • August 2026", st["cover_meta"]),
        PageBreak(),
    ]


def source_text(source: Path | Sequence[Path]) -> str:
    if isinstance(source, Path):
        return source.read_text(encoding="utf-8")
    return "\n\n---\n\n".join(path.read_text(encoding="utf-8") for path in source)


def render(source: Path | Sequence[Path], output: Path, title: str, subtitle: str, short_title: str, volume_label: str):
    register_fonts()
    st = styles()
    output.parent.mkdir(parents=True, exist_ok=True)
    doc = CourseDocTemplate(
        str(output),
        pagesize=A4,
        leftMargin=19 * mm,
        rightMargin=19 * mm,
        topMargin=22 * mm,
        bottomMargin=19 * mm,
        title=plain_text(title),
        author="OpenAI Codex for Maxwell",
        subject="Zero-ready QA, TypeScript, Playwright and canonical SWP391 Laundry curriculum",
    )
    story = cover_story(title, subtitle, volume_label, st)
    story.append(Paragraph("Mục lục", st["toc_title"]))
    toc = TableOfContents()
    toc.levelStyles = [
        ParagraphStyle(
            "TOC1",
            fontName="CourseSans-Bold",
            fontSize=9.3,
            leading=13,
            leftIndent=0,
            firstLineIndent=0,
            textColor=NAVY,
            spaceBefore=4,
        ),
        ParagraphStyle(
            "TOC2",
            fontName="CourseSans",
            fontSize=8.1,
            leading=11,
            leftIndent=12,
            firstLineIndent=0,
            textColor=INK,
        ),
    ]
    story.append(toc)
    story.append(PageBreak())
    available_width = A4[0] - doc.leftMargin - doc.rightMargin
    story.extend(markdown_story(source_text(source), st, available_width))
    doc.multiBuild(
        story,
        onFirstPage=lambda canvas, current_doc: draw_cover(canvas, current_doc, volume_label),
        onLaterPages=lambda canvas, current_doc: draw_later_page(canvas, current_doc, short_title),
    )


def main() -> int:
    volumes = [
        (
            [
                SELF_STUDY / "teaching/00_learning_contract.md",
                SELF_STUDY / "teaching/01_zero_foundation.md",
                SELF_STUDY / "teaching/02_qa_api_sql_ci.md",
                SELF_STUDY / "teaching/03_playwright_core.md",
                SELF_STUDY / "teaching/04_spring_swp_full.md",
            ],
            PDF_DIR / "01_Zero_to_Playwright_QA_SWP391_v4.pdf",
            "Từ zero tới năng lực QA<br/>với Playwright + SWP391",
            "Teaching Volume v4.0<br/>JavaScript/TypeScript từ số 0, Playwright thực chiến và Spring reverse",
            "Teaching v4",
            "Teaching volume",
        ),
        (
            SELF_STUDY / "career_playbook_v4.md",
            PDF_DIR / "02_12_Week_Career_Playbook_v4.pdf",
            "12 tuần chuyển hóa internship<br/>thành năng lực tự làm",
            "Career Playbook v4.0<br/>Ba lane: công ty, full SWP391 và technical evidence",
            "Career v4",
            "Career volume",
        ),
        (
            SELF_STUDY / "hints_and_rubrics_v4.md",
            PDF_DIR / "03_Hints_Rubrics_and_Answer_Keys_v4.pdf",
            "Hints, reasoning keys<br/>and mastery rubrics",
            "Companion Volume v4.0<br/>Chỉ mở theo hint ladder hoặc sau timebox",
            "Hints v4",
            "Companion volume",
        ),
    ]
    selected = set(sys.argv[1:])
    for index, volume in enumerate(volumes):
        if selected and str(index + 1) not in selected:
            continue
        render(*volume)
        print(volume[1])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
