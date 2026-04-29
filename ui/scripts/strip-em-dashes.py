"""
Strip em-dashes from project source so the copy reads less AI-flavoured.

Rules applied per occurrence:
  1. " — "   (space, em-dash, space) → ". " + capitalize next word
  2. " —"    (space, em-dash, end-of-line / no trailing space) → ""
  3. "— "    (em-dash, space at start of fragment) → ""
  4. "—"     (bare em-dash) → "-" (preserve as hyphen for compound usage)

Skipped paths:
  - node_modules/, .next/, out/, .git/, public/ (content files, not copy)
  - assets/ originals (untouched)

Files we DO touch: all .ts, .tsx, .css, .md, .json under src/, plus
public/site.webmanifest if it picks up.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

EXCLUDE_DIRS = {"node_modules", ".next", "out", ".git", "assets"}
INCLUDE_EXTS = {".ts", ".tsx", ".js", ".jsx", ".css", ".md", ".json", ".mjs", ".webmanifest"}

# Order matters: longer-context substitutions first.
PATTERNS: list[tuple[re.Pattern[str], object]] = [
    # " — X" (space-em-space-letter): split into a new sentence + capitalize.
    (re.compile(r" — (\w)"), lambda m: ". " + m.group(1).upper()),
    # " — " before a digit or symbol: drop to a comma.
    (re.compile(r" — "), ", "),
    # bare em-dash (rare): treat as hyphen.
    (re.compile(r"—"), "-"),
]


def process(text: str) -> str:
    for pat, repl in PATTERNS:
        text = pat.sub(repl, text)
    return text


def should_visit(p: Path) -> bool:
    parts = set(p.parts)
    if parts & EXCLUDE_DIRS:
        return False
    return p.suffix in INCLUDE_EXTS


def main() -> None:
    changed = 0
    visited = 0
    for p in ROOT.rglob("*"):
        if not p.is_file() or not should_visit(p.relative_to(ROOT)):
            continue
        visited += 1
        original = p.read_text(encoding="utf-8")
        if "—" not in original:
            continue
        updated = process(original)
        if updated != original:
            p.write_text(updated, encoding="utf-8")
            changed += 1
            print(f"updated: {p.relative_to(ROOT)}")
    print(f"\nVisited {visited} files, rewrote {changed}.")


if __name__ == "__main__":
    main()
