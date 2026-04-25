# IFFA 2026

Internal frontend project using Next.js App Router and a module-first structure.

## 1) Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Start local development:

```bash
pnpm dev
```

3. Open http://localhost:3000

## 2) Current Project Structure (Source of Truth)

```text
src/
	app/
		globals.css
		layout.tsx
		(root)/
			layout.tsx
			(marketing)/
				page.tsx
			events/

	components/
		ui/
			button.tsx

	lib/
		utils.ts

	modules/
		about/
		home/
			server/
			ui/
				components/
				layouts/
				sections/
				views/
					home-page.tsx
		shared/
			components/
			layouts/
				root-layout.tsx
```

## 3) Architecture Rules (Must Follow)

1. Keep route wiring inside `src/app/*`.
2. Keep feature code inside `src/modules/<feature>`.
3. Use `src/components/ui` for shadcn primitives only.
4. Keep all user-created/app-specific components inside `src/modules/<feature>/ui/*`.
5. Keep shared cross-feature logic/layouts inside `src/modules/shared`.
6. Do not move files across layers without team agreement in a PR.
7. Prefer adding new code under existing feature folders instead of scattering files in `app`.
8. Avoid cyclic imports between modules.

## 4) Next.js Version Warning

This repository uses a newer Next.js version with breaking changes. Before using unfamiliar patterns or APIs, check docs from:

`node_modules/next/dist/docs/`

Do not assume older tutorials/snippets are valid.

## 5) Strict AI Usage Policy

AI can assist, but ownership is always human.

1. AI output must be reviewed line-by-line before commit.
2. Never paste sensitive data, secrets, private keys, or credentials into AI tools.
3. Do not generate large blind refactors with AI.
4. AI-generated code must pass lint/type checks/tests before PR.
5. If AI wrote or heavily modified logic, mention it in the PR description under "AI Assistance".
6. You are accountable for correctness, security, performance, and maintainability.

## 6) Branching Strategy

Do all work in topic branches. Never commit directly to main.

Default recommendation for this team: Option A.

Use:

1. `main` = stable/default branch
2. `dev` = integration branch
3. Ignore/delete `prod`

Workflow:

1. Create feature branch from `dev`.
2. Merge feature branch into `dev`.
3. When stable, merge `dev` into `main`.


### Stable Branch Rule

Should you push day-to-day changes to `main`? No.

1. Keep current work in `dev` and feature branches created from `dev`.
2. Move code to `main` only after review and stability checks.
3. Stable branches (`main`, and `prod` if used) are not scratch branches.

Branch naming rules:

1. New page work: `page/<route-or-page-name>`
2. Feature work (non-page): `feat/<short-description>`
3. Bug fixes: `fix/<short-description>`
4. Refactors/chore: `chore/<short-description>`

Examples:

1. `page/events-listing`
2. `page/home-hero-update`
3. `feat/home-testimonial-section`
4. `fix/layout-recursion-crash`

## 7) Commit Message Standard (No Generic Messages)

Use clear, scoped commits. Avoid messages like "update", "changes", "fix stuff", "wip".

Optional: You may prefix commit messages with emoji tags like `:star:`, `:bug:`, `:sparkles:`, `:recycle:`.

Format:

`type(scope): short summary`

With optional emoji tag:

`:emoji: type(scope): short summary`

Allowed types:

1. `feat`
2. `fix`
3. `refactor`
4. `chore`
5. `docs`
6. `test`
7. `style`

Good examples:

1. `feat(home): add hero stats section`
2. `fix(root-layout): prevent recursive render`
3. `refactor(home/ui): split home page sections`
4. `docs(readme): add contribution workflow`
5. `:sparkles: feat(home): add hero stats section`
6. `:bug: fix(events): handle empty API response`

## 8) Pull Request Rules (Required)

Every change must come through a PR.

PR checklist:

1. Branch is up to date with target branch.
2. Commits are clean and meaningful.
3. PR title is specific and scoped.
4. PR description includes:
	 - What changed
	 - Why it changed
	 - How it was tested
	 - AI Assistance (if used)
5. Screenshots/videos for UI changes.
6. No unrelated file changes.
7. At least one reviewer approval before merge.

## 9) Coordination to Avoid Merge Conflicts

1. Announce ownership of a page/feature before starting (team chat or issue).
2. Create small PRs and merge frequently.
3. Rebase or merge latest target branch daily for long-running branches.
4. If two people touch the same area, align on file boundaries before coding.
5. Resolve conflicts locally, rerun checks, then request re-review.
6. Do not force-push over someone else work.

## 10) SWE Best Practices for This Repo

1. Keep components small and focused.
2. Prefer composition over copy-paste.
3. Keep server concerns in `server/` and UI concerns in `ui/`.
4. Name things by intent, not implementation detail.
5. Write code for readability first.
6. Run lint/type checks before pushing.
7. Update docs when project conventions change.

## 11) Quick Working Agreement

If you are contributing to this repository, you agree to:

1. Follow this structure and workflow.
2. Use strict branch + commit + PR hygiene.
3. Use AI responsibly and transparently.
4. Coordinate early to prevent avoidable conflicts.
