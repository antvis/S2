---
name: s2-lint
description: After modifying S2 project code, you must run lint to ensure there are no errors, avoiding issues when pushing to git.
---

# S2 Lint

## When to use this skill

**After modifying any code files in the `packages/` directory, you must use this skill before finishing the task.**

This includes but is not limited to:
- Modifying `.ts`, `.tsx`, `.vue` files
- Adding new source code files
- Modifying type definition files (`.d.ts`)
- Modifying import/export statements
- Modifying `.less` style files
- Modifying `.md` documentation files

## Execution Steps

After completing all code modifications, run the following command in the project root:

```bash
pnpm lint
```

This command runs the following checks sequentially:
- `lint:type` - TypeScript type checking
- `lint:script` - ESLint code style checking
- `lint:style` - Stylelint CSS/LESS checking
- `lint:docs` - Markdownlint documentation checking
- `lint:word` - Case-police word casing checking

## Handling Errors

If the command reports errors:

1. **Carefully read the error message** to determine the location and cause of the error.
2. **Fix all errors** to ensure code quality.
3. **Re-run `pnpm lint`** to confirm all errors are fixed.
4. The task is considered complete only after lint passes.

## Notes

- Do not ignore lint errors; they may cause build failures in the CI/CD pipeline.
- If some errors are difficult to fix, inform the user and discuss solutions.
- This check is a necessary step before pushing code to git.
