"""Minimal test of Claude Agent SDK."""
import asyncio
import os
import signal
import sys

# Set a timeout
def timeout_handler(signum, frame):
    print("TIMEOUT - SDK hung for 30 seconds")
    sys.exit(1)

signal.signal(signal.SIGALRM, timeout_handler)
signal.alarm(30)

from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage, TextBlock

async def test():
    print(f"OAuth set: {bool(os.environ.get('CLAUDE_CODE_OAUTH_TOKEN'))}")
    print(f"CLAUDECODE: '{os.environ.get('CLAUDECODE', '(not set)')}'")
    print("Starting query...")
    try:
        async for msg in query(
            prompt="Say hello in one word.",
            options=ClaudeAgentOptions(
                model="sonnet",
                max_turns=1,
                permission_mode="bypassPermissions",
                allowed_tools=[],
            ),
        ):
            print(f"Got message: {type(msg).__name__}")
            if isinstance(msg, AssistantMessage):
                for block in msg.content:
                    if isinstance(block, TextBlock):
                        print(f"  Text: {block.text[:100]}")
            elif isinstance(msg, ResultMessage):
                print(f"  Result: {msg.result[:100] if msg.result else '(empty)'}")
                print(f"  Error: {msg.is_error}")
    except RuntimeError as e:
        if "cancel scope" not in str(e):
            print(f"RuntimeError: {e}")
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
    print("Done.")

asyncio.run(test())
