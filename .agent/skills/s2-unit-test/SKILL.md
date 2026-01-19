---
name: s2-unit-test
description: Guidelines for writing and maintaining unit tests in the S2 project. Use when modifying source code to ensure proper test coverage.
---

# S2 Unit Testing Guidelines

## When to Use This Skill

Use this skill when you:
- Modify code under `packages/*/src/`
- Fix bugs (especially with issue numbers)
- Add new features or functions

**By default, all code changes require corresponding unit tests.**

## Test File Location Strategy

### Step 1: Find Existing Test Files

Search for `__tests__` directories to find where tests for the modified file already exist:

```
packages/s2-core/__tests__/unit/      # Unit tests organized by module
packages/s2-core/__tests__/bugs/      # Bug regression tests with issue numbers
packages/s2-core/__tests__/spreadsheet/  # Integration-level spreadsheet tests
packages/s2-react/__tests__/          # React component tests
packages/s2-vue/__tests__/            # Vue component tests
```

### Step 2: Choose the Right Location

| Scenario | Location | File Naming |
|----------|----------|-------------|
| Modifying existing function | Add to existing test file for that function | N/A |
| Bug fix with issue number | `packages/s2-core/__tests__/bugs/` | `issue-{number}-spec.ts` |
| New utility function | `packages/s2-core/__tests__/unit/utils/` | `{function-name}-spec.ts` |
| New cell logic | `packages/s2-core/__tests__/unit/cell/` | `{cell-type}-spec.ts` |
| New interaction | `packages/s2-core/__tests__/unit/interaction/` | `{interaction-name}-spec.ts` |

**Prefer adding tests to existing files over creating new ones.** Reuse existing helper functions and test utilities.

## Critical Rules

### ✅ Good Practices

1. **Import from `src` directory** - Tests must exercise actual source code:

```typescript
// Good: Import functions/classes from src
import { getCellWidth, getDisplayText } from '@/utils/text';
import { PivotSheet } from '@/sheet-type';

// Good: Use path aliases
import { createPivotSheet } from 'tests/util/helpers';
```

2. **Test real behavior** - Create actual instances and verify logic:

```typescript
// Good: Create real S2 instance and test behavior
const s2 = createPivotSheet(options);
await s2.render();
expect(s2.facet.getColCells()[0].getMeta().width).toBe(expectedWidth);
```

3. **Reproduce bugs with real code paths**:

```typescript
// Good: Bug reproduction that exercises src code
describe('issue #3212', () => {
  test('should keep column width after hiding value', async () => {
    const s2 = createPivotSheet({ style: { layoutWidthType: 'compact' } });
    await s2.render();
    
    const originalWidth = s2.facet.getColCells()[0].getMeta().width;
    s2.setOptions({ style: { colCell: { hideValue: true } } });
    await s2.render();
    
    expect(s2.facet.getColCells()[0].getMeta().width).toBe(originalWidth);
  });
});
```

### ❌ Bad Practices

1. **Never reimplement logic in tests**:

```typescript
// BAD: Reimplementing the logic defeats the purpose
function myLocalCalculation(a, b) {
  return a + b; // This is useless! If src is broken, test still passes
}
expect(myLocalCalculation(1, 2)).toBe(3);
```

2. **Never import only types**:

```typescript
// BAD: Only importing types doesn't test any actual code
import type { S2Options, SpreadSheet } from '@/common';
// No actual code is being tested!
```

3. **Never test mocked implementations instead of real code**:

```typescript
// BAD: Testing your own mock, not the actual source
const mockFn = jest.fn().mockReturnValue(42);
expect(mockFn()).toBe(42); // This tests nothing useful
```

## Test Structure Template

```typescript
/**
 * @description spec for issue #XXXX (if applicable)
 * https://github.com/antvis/S2/issues/XXXX
 */
import { SomeFunction, SomeClass } from '@/path/to/src';
import { createPivotSheet } from 'tests/util/helpers';

describe('FeatureName', () => {
  test('should do expected behavior', () => {
    // Arrange
    const input = { /* ... */ };
    
    // Act
    const result = SomeFunction(input);
    
    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
```

## Running Tests

```bash
# Run all tests for a package
pnpm --filter @antv/s2 test

# Run specific test file
pnpm --filter @antv/s2 test -- --testPathPattern="issue-3212"

# Run with coverage
pnpm --filter @antv/s2 test:coverage
```

## Goal

The primary goal of unit tests is to:
- **Increase line coverage** - Every line of src code should be exercised
- **Increase branch coverage** - Test all conditional paths
- **Prevent regressions** - Ensure bugs don't reappear

Tests that don't import and exercise actual `src` code provide no coverage benefit.
