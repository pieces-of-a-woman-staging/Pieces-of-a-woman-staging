#!/usr/bin/env python3
"""Synchronize local stylesheet URLs; --check fails on outdated page versions."""

import argparse
import hashlib
from pathlib import Path
import re
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
STYLESHEETS = ("css/navbar.css", "css/satin.css")
HREF = re.compile(r"(?P<before>\bhref\s*=\s*['\"])(?P<url>[^'\"]+)(?P<after>['\"])", re.IGNORECASE)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Report drift without editing files")
    args = parser.parse_args()
    digest = hashlib.sha256()
    for stylesheet in STYLESHEETS:
        digest.update(stylesheet.encode() + b"\0")
        digest.update((ROOT / stylesheet).read_bytes() + b"\0")
    version = digest.hexdigest()[:16]
    problems = []
    themed_pages = 0

    for page in sorted(ROOT.rglob("*.html")):
        if ".git" in page.relative_to(ROOT).parts:
            continue
        seen = set()
        original = page.read_text(encoding="utf-8")

        def replace(match):
            url = urlsplit(match["url"])
            if url.scheme or url.netloc or url.path not in STYLESHEETS:
                return match[0]
            seen.add(url.path)
            query = [(key, value) for key, value in parse_qsl(url.query, keep_blank_values=True) if key != "v"]
            query.append(("v", version))
            updated = urlunsplit((url.scheme, url.netloc, url.path, urlencode(query), url.fragment))
            return match["before"] + updated + match["after"]

        updated = HREF.sub(replace, original)
        if not seen:
            continue
        themed_pages += 1
        missing = set(STYLESHEETS) - seen
        if missing:
            problems.append(f"{page.relative_to(ROOT)}: missing {', '.join(sorted(missing))}")
        if updated != original:
            if args.check:
                problems.append(f"{page.relative_to(ROOT)}: stylesheet URLs must use v={version}")
            else:
                page.write_text(updated, encoding="utf-8")
                print(f"Updated {page.relative_to(ROOT)}")

    if not themed_pages:
        problems.append("No themed HTML pages found")
    if problems:
        print("\n".join(problems))
        print("Run: python3 tools/sync_stylesheets.py")
        return 1
    print(f"All {themed_pages} themed pages use shared stylesheet version {version}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
