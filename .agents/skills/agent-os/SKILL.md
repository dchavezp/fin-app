---
name: agent-os
description: |
  Agent OS workflow for product development and standards management. Triggers when user mentions: shape-spec, plan-product, inject-standards, index-standards, discover-standards, or any agent-os workflow. Also triggers when building features that need product context, standards documentation, structured planning, or extracting tribal knowledge from the codebase. Make sure to use this skill whenever the user mentions planning a feature, shaping a spec, documenting product vision, managing code standards, or discovering patterns from existing code.
---

# Agent OS Skill

This skill provides workflows for product development and standards management.

## Key Principles

- **Always use AskUserQuestion** when asking the user anything
- **Offer suggestions** — Present options the user can confirm, adjust, or correct
- **Keep it lightweight** — Gather enough to create useful docs without over-documenting
- **Standards must be concise** — Scannable by AI without bloating context windows

## Commands

Each command has a detailed workflow in `references/`. Read the appropriate file when executing:

| Command | Trigger | Reference File |
|---------|---------|----------------|
| `shape-spec` | Plan a feature | `references/shape-spec.md` |
| `plan-product` | Create product docs | `references/plan-product.md` |
| `inject-standards` | Inject standards into context | `references/inject-standards.md` |
| `index-standards` | Rebuild index.yml | `references/index-standards.md` |
| `discover-standards` | Extract tribal knowledge | `references/discover-standards.md` |

### Direct Execution

When the user says something like "run plan-product" or "let's discover standards", read the reference file and execute that workflow directly.

### Auto-Suggest Mode

If the user describes work without naming a command, analyze their intent and suggest the right command:

- "I want to plan a new feature" → `shape-spec`
- "Let's document our product vision" → `plan-product`
- "What patterns exist in our API?" → `discover-standards`
- "Include the relevant standards" → `inject-standards`
- "Update my standards index" → `index-standards`

## Directory Structure

```
docs/
├── specs/                    # Feature specifications
│   └── YYYY-MM-DD-HHMM-*/   # Individual spec folders
├── product/                  # Product documentation
│   ├── mission.md
│   ├── roadmap.md
│   └── tech-stack.md
└── standards/                # Code standards
    ├── index.yml             # Standards index
    ├── api/                  # API standards
    ├── auth/                 # Auth standards
    ├── global/               # Cross-cutting standards
    └── native/               # React Native standards

.agents/skills/agent-os/
├── references/               # Command workflow guides
│   ├── shape-spec.md
│   ├── plan-product.md
│   ├── inject-standards.md
│   ├── index-standards.md
│   └── discover-standards.md
└── evals/                    # Skill evaluation data
    └── evals.json
```

## Integration

These commands work together:
- `shape-spec` reads product context and standards during planning
- `discover-standards` creates standards that `inject-standards` can later inject
- `index-standards` keeps the standards discoverable
- `plan-product` establishes the product context that shapes planning
