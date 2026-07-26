#!/usr/bin/env python3
"""PreToolUse hook: validates git commit messages against the project convention.

Scopes are defined in ../scopes.json (single source of truth).
"""

import json
import re
import sys
from pathlib import Path

# ── read scopes from canonical JSON file ─────────────────────────────────
_SCOPES_JSON = Path(__file__).resolve().parent.parent / "scopes.json"
VALID_SCOPES: dict[str, str] = json.loads(_SCOPES_JSON.read_text(encoding="utf-8"))
SCOPE_PATTERN = re.compile(r"^(?P<scope>" + "|".join(VALID_SCOPES) + r"):\s+(?P<desc>.+)$")

# ── helpers ─────────────────────────────────────────────────────────────

def extract_message(data: dict) -> str | None:
    """Return the commit message from tool input, or None if not a commit."""
    tool_name = data.get("tool_name", "")
    tool_input = data.get("tool_input", {})

    # MCP commit tool
    if re.search(r"git_add_or_commit|git.*commit", tool_name, re.IGNORECASE):
        if tool_input.get("action") == "commit":
            return tool_input.get("message", "").strip()

    # Terminal git commit
    if re.search(r"run_in_terminal|send_to_terminal", tool_name, re.IGNORECASE):
        cmd = (tool_input.get("command") or "").strip()
        m = re.search(r'git\s+commit\s+(?:-[^-\s]*m\s+["\'])?([^"\']+)', cmd)
        if m:
            return m.group(1).strip()

    return None


def validate(message: str) -> str | None:
    """Return an error string if invalid, or None if valid."""
    message = message.strip()
    if not message:
        return "Commit message is empty."

    msg_oneline = message.split("\n")[0].strip()
    m = SCOPE_PATTERN.match(msg_oneline)
    if not m:
        scopes = "', '".join(VALID_SCOPES)
        return (
            f"Invalid commit message format.\n"
            f"Expected: <scope>: <description>\n"
            f"Valid scopes: '{scopes}'\n"
            f"Got: '{msg_oneline}'"
        )

    desc = m.group("desc").strip()
    if len(desc) < 4:
        return f"Description too short ({len(desc)} chars). Use at least 4 characters."

    return None


def main() -> None:
    try:
        payload = json.loads(sys.stdin.read())
    except (json.JSONDecodeError, OSError):
        return  # Not running inside a hook — skip

    message = extract_message(payload)
    if message is None:
        return

    error = validate(message)
    if error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
