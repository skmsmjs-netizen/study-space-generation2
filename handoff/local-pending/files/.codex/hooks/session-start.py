#!/usr/bin/env python3
"""Check only maintained instruction connections; never read application data."""

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit


SKILLS = ("study-review", "study-fix-issue", "study-deploy")
SCOPES = ("src", "src/ui", "src/domain", "src/data", "src/server", "supabase")
ROLES = ("study-code-reviewer", "study-data-auditor")


def check_connections(webapp):
    common = webapp.parent
    required = [
        common / "AGENTS.md",
        common / "docs/프로젝트 문서 안내.md",
        common / "docs/작업 진행과 검증 정책.md",
        common / "docs/Codex 지침 구조.md",
        common / ".codex/config.toml",
        webapp / "AGENTS.md",
        webapp / "docs/resume-handoff.md",
        webapp / ".codex/config.toml",
    ]
    required += [webapp / scope / "AGENTS.md" for scope in SCOPES]
    required += [webapp / ".agents/skills" / name / "SKILL.md" for name in SKILLS]
    required += [webapp / ".codex/agents" / (name + ".toml") for name in ROLES]
    # Each published alias must resolve to its single maintained source.
    aliases = []
    for name in SKILLS:
        aliases.append((common / ".agents/skills" / name,
                        webapp / ".agents/skills" / name))
    for name in ROLES:
        aliases.append((common / ".codex/agents" / (name + ".toml"),
                        webapp / ".codex/agents" / (name + ".toml")))

    errors = []
    for path in required:
        if not path.is_file():
            errors.append("Missing instruction file: " + str(path.relative_to(common)))
    for alias, source in aliases:
        if not alias.exists() or alias.resolve() != source.resolve():
            errors.append("Broken instruction alias: " + str(alias.relative_to(common)))

    # Check links only in entrypoints and skills, not historical handoff contents.
    for path in required:
        if not path.is_file() or path.name == "resume-handoff.md" or path.suffix != ".md":
            continue
        text = path.read_text(encoding="utf-8")
        if path.name == "SKILL.md":
            frontmatter = re.match(r"\A---\n(.*?)\n---(?:\n|$)", text, re.S)
            if not frontmatter:
                errors.append("Missing skill frontmatter: " + str(path.relative_to(common)))
            else:
                fields = dict(re.findall(r"^([a-z-]+):\s*(.+)$", frontmatter.group(1), re.M))
                if fields.get("name") != path.parent.name or not fields.get("description"):
                    errors.append("Invalid skill identity: " + str(path.relative_to(common)))
        for target in re.findall(r"\[[^\]\n]+\]\(([^)\n]+)\)", text):
            parsed = urlsplit(target.strip("<>"))
            if parsed.scheme or not parsed.path:
                continue
            linked = path.parent / unquote(parsed.path)
            if not linked.exists():
                errors.append("Missing link in " + str(path.relative_to(common)) + ": " + parsed.path)
    return errors, len(required), len(aliases)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate links and discovery aliases.")
    args = parser.parse_args()
    webapp = Path(__file__).resolve().parents[2]
    if not args.check:
        try:
            event = json.load(sys.stdin)
        except (ValueError, TypeError):
            print("Instruction hook received invalid event JSON.", file=sys.stderr)
            return 1
        if not isinstance(event, dict):
            print("Instruction hook expected an event object.", file=sys.stderr)
            return 1
        if event.get("hook_event_name") != "SessionStart":
            return 0

    errors, files, aliases = check_connections(webapp)
    if args.check:
        print(json.dumps({"ok": not errors, "instruction_files": files,
                          "aliases": aliases, "errors": errors}, ensure_ascii=False))
        return 1 if errors else 0

    common = webapp.parent
    context = (
        "학습 입력 프로젝트의 지침 위치 안내입니다. 현재 사용자 요청과 상위 실행 지침이 우선합니다. "
        "공통 지침: " + str(common / "AGENTS.md") + "; 웹앱 지침: " + str(webapp / "AGENTS.md") + ". "
        "작업에 관련된 경로의 AGENTS.md와 최신 인계 " + str(webapp / "docs/resume-handoff.md") +
        "만 선택 확인합니다. 종료한 구현·보관본은 현재 사용자의 명시적 열람 요청 없이 읽지 않습니다. "
        "훅은 지침 연결만 확인하며 앱·원장·사용자 자료·전체 QA는 검사하지 않습니다."
    )
    if errors:
        context += " 지침 연결 오류: " + "; ".join(errors[:4]) + ". 관련 경로를 수정하고 가능한 본 작업은 이어갑니다."
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "SessionStart",
                     "additionalContext": context}}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
