@AGENTS.md

# Working with me on this project

Project knowledge lives in `AGENTS.md` (above). This file is Claude Code
specific — session habits and tool use.

## Session hygiene

Context grows monotonically within a session and never shrinks, so a long day
in one chat is expensive no matter what's cached. Keep sessions scoped to one
task.

**Before I finish a piece of work, update `docs/STATUS.md`** — what moved, what
is now blocked, what is next. That file is what makes a fresh session cheap:
it should be possible to `/clear` and pick up tomorrow without re-deriving
anything.

Suggest `/clear` when the user changes subject. `/compact` keeps a summary and
is for continuing the *same* task past the context limit; `/clear` is for
starting a different one.

Don't re-read files already read this session, and don't re-derive facts
already established — both are pure cost.

## Verification

Claims about this project must come from the running system, not from reading
the source. Curl the endpoint, query MongoDB, check the real S3 key, drive the
page with Playwright. Several bugs here read correctly and were still wrong.

Say plainly when something is unverified. "I tested presigning with dummy
credentials, so no real upload has run" is useful; "should work" is not.

## Before destructive or outward-facing actions

Deploys, production database writes, force pushes, deleting branches or S3
objects: confirm first, every time. Prior approval for one doesn't carry to
the next.

Trial risky merges in a throwaway worktree under the scratchpad rather than
the user's working tree, and clean it up afterwards.

Never `git add .` — this repo has had `.env.backup*` files sitting untracked
and outside `.gitignore`, holding real secrets. Stage named paths.

## Subagents

Don't spawn subagents unless asked. Each one starts cold and re-derives context
already in hand, which is the expensive path here.
