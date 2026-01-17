---
name: s2-type-check
description: After modifying S2 project code, you must run type checking to ensure there are no type errors, avoiding issues when pushing to git.
---

# S2 Type Check

## When to use this skill

**After modifying any TypeScript code files in the `packages/` directory, you must use this skill before finishing the task.**

This includes but is not limited to:
- Modifying `.ts`, `.tsx`, `.vue` files
- Adding new source code files
- Modifying type definition files (`.d.ts`)
- Modifying import/export statements

## Execution Steps

After completing all code modifications, run the following command to check types:

```bash
cd /Users/zjt/code/S2
pnpm lint:type
```

This command runs the TypeScript compiler check on all packages under `packages/`.

## Handling Type Errors

If the command reports type errors:

1. **Carefully read the error message** to determine the location and cause of the error.
2. **Fix all type errors** to ensure code type safety.
3. **Re-run `pnpm lint:type`** to confirm all errors are fixed.
4. The task is considered complete only after type check passes.

## Notes

- Do not ignore type errors; they may cause build failures in the CI/CD pipeline.
- If some errors are difficult to fix, inform the user and discuss solutions.
- This check is a necessary step before pushing code to git.
