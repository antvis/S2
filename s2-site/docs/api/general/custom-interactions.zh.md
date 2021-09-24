---
title: CustomInteractions
order: 1
redirect_from:
  - /zh/docs/api
---

## CustomInteraction

```ts
export interface CustomInteraction {
  key: string;
  interaction: InteractionConstructor;
}
```

## InteractionConstructor

```ts
export type InteractionConstructor = new (
  spreadsheet: SpreadSheet,
  interaction: RootInteraction,
) => BaseEvent;
```
