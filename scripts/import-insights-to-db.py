"""
Import existing insight JSON files into the PostgreSQL surah_insights table.

Reads from:
  - scripts/output/insight-*-claude.json  (generated insights)

Usage:
  python scripts/import-insights-to-db.py
  python scripts/import-insights-to-db.py --dry-run   # preview without writing
"""

import json
import os
import sys
from pathlib import Path

# Load env
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
    load_dotenv(Path(__file__).parent.parent / "backend" / ".env")
except ImportError:
    pass

SCRIPT_DIR = Path(__file__).parent
OUTDIR = SCRIPT_DIR / "output"


def get_db_url() -> str:
    url = os.environ.get("DATABASE_URL_SYNC") or os.environ.get("DATABASE_URL", "")
    if url.startswith("postgresql+asyncpg://"):
        url = url.replace("postgresql+asyncpg://", "postgresql://", 1)
    return url


def word_count(s: str) -> int:
    return len(s.split()) if s else 0


def total_words(parsed: dict) -> int:
    texts = [
        parsed.get("historicalContext", {}).get("background", ""),
        parsed.get("historicalContext", {}).get("occasionOfRevelation", ""),
        parsed.get("audience", ""),
        parsed.get("coreMessage", {}).get("thesis", ""),
        parsed.get("coreMessage", {}).get("emotionalArc", ""),
        parsed.get("coreMessage", {}).get("buildUp", ""),
        parsed.get("scholarlyNotes", ""),
    ]
    for s in parsed.get("sections", []):
        texts.append(s.get("summary", ""))
    for w in parsed.get("keyVocabulary", []):
        texts.append(w.get("deeperMeaning", ""))
    for st in parsed.get("stories", []):
        texts.extend([st.get("narrative", ""), st.get("lesson", "")])
    for v in parsed.get("notableVerses", []):
        texts.extend([v.get("tafsirExcerpt", ""), v.get("linguisticNote", ""),
                       v.get("practicalApplication", ""), v.get("relatedHadith", "")])
    for c in parsed.get("connections", []):
        texts.append(c.get("relationship", ""))
    return sum(word_count(t) for t in texts if t)


def main():
    dry_run = "--dry-run" in sys.argv

    # Find all generated insight JSON files
    json_files = sorted(OUTDIR.glob("insight-*-claude.json"))

    if not json_files:
        print("No insight JSON files found in scripts/output/")
        print("Expected files like: insight-1-claude.json, insight-18-claude.json")
        sys.exit(1)

    print(f"Found {len(json_files)} insight files")
    if dry_run:
        print("DRY RUN — no database writes")

    insights = []
    for f in json_files:
        try:
            data = json.loads(f.read_text())
            surah_num = data.get("surah")
            if not surah_num:
                print(f"  Skipping {f.name}: no surah field")
                continue
            tw = total_words(data)
            insights.append((surah_num, data, tw))
            print(f"  {f.name}: Surah {surah_num} — {tw} words")
        except (json.JSONDecodeError, KeyError) as e:
            print(f"  Skipping {f.name}: {e}")

    if dry_run:
        print(f"\nWould import {len(insights)} insights")
        return

    if not insights:
        print("No valid insights to import")
        return

    # Connect to database
    import psycopg2
    url = get_db_url()
    if not url:
        print("ERROR: No DATABASE_URL found in environment")
        print("Set DATABASE_URL_SYNC or DATABASE_URL in backend/.env")
        sys.exit(1)

    conn = psycopg2.connect(url)
    try:
        with conn.cursor() as cur:
            for surah_num, data, tw in insights:
                cur.execute("""
                    INSERT INTO surah_insights (surah, version, content, word_count, model_used, generated_at, created_at, updated_at)
                    VALUES (%s, 1, %s, %s, %s, NOW(), NOW(), NOW())
                    ON CONFLICT (surah)
                    DO UPDATE SET
                        content = EXCLUDED.content,
                        word_count = EXCLUDED.word_count,
                        model_used = EXCLUDED.model_used,
                        version = surah_insights.version + 1,
                        generated_at = NOW(),
                        updated_at = NOW()
                """, (
                    surah_num,
                    json.dumps(data, ensure_ascii=False),
                    tw,
                    "claude-imported",
                ))
                print(f"  Upserted Surah {surah_num}")
        conn.commit()
        print(f"\nImported {len(insights)} insights to database")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
