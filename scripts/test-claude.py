"""
Simple test script for Claude Agent SDK — ask any question, switch models.

Usage:
  python scripts/test-claude.py                          # default: sonnet
  python scripts/test-claude.py --model opus             # use opus
  python scripts/test-claude.py --model haiku            # use haiku
  python scripts/test-claude.py --model sonnet "What is a closure in Python?"
  python scripts/test-claude.py "Explain list comprehensions"
"""

import asyncio
import os
import sys
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass

# Unset CLAUDECODE so we can run inside a Claude Code session
os.environ.pop("CLAUDECODE", None)

from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage, TextBlock


async def ask(prompt: str, model: str):
    print(f"Model: {model}")
    print(f"Question: {prompt}\n")
    print("─" * 60)

    result_text = ""
    try:
        async for message in query(
            prompt=prompt,
            options=ClaudeAgentOptions(
                model=model,
                max_turns=1,
                permission_mode="bypassPermissions",
                allowed_tools=[],
            ),
        ):
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        result_text += block.text
            elif isinstance(message, ResultMessage):
                if message.result:
                    result_text = message.result
    except RuntimeError as e:
        if "cancel scope" not in str(e):
            print(f"ERROR: {e}")
            return
    except Exception as e:
        print(f"ERROR: {e}")
        return

    print(result_text)
    print("─" * 60)
    print(f"({len(result_text.split())} words)")


def main():
    args = sys.argv[1:]
    model = "sonnet"

    if "--model" in args:
        idx = args.index("--model")
        model = args[idx + 1]
        args = args[:idx] + args[idx + 2:]

    prompt = " ".join(args) if args else "Write a Python function that checks if a string is a palindrome. Keep it short."

    # Check auth
    if not os.environ.get("CLAUDE_CODE_OAUTH_TOKEN") and not os.environ.get("ANTHROPIC_API_KEY"):
        print("No credentials found. Set CLAUDE_CODE_OAUTH_TOKEN or ANTHROPIC_API_KEY")
        sys.exit(1)

    asyncio.run(ask(prompt, model))


if __name__ == "__main__":
    main()
