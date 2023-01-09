---
title: Contribution
order: 7
---

## branch management

Currently, we are based on`master` Branch development, with any modification, please base on`master` pull a branch, then pass`PR` In the form of DingTalk, we have integrated the DingTalk robot and will review your PR and give feedback for the first time

## Submit bug feedback

Sorry for writing some more bugs, but please be kind enough to submit a meaningful bug feedback, no one wants the feedback bug like this:

![preview](https://gw.alipayobjects.com/zos/antfincdn/j0jUvKwT%26/dd59fe64-7108-4ad7-a544-e19d79eea890.png)

There is no version information, no reproduction steps, no problem description, no code snippets, and the opening sentence is all guesswork.

First select \[Bug report]

![preview](https://gw.alipayobjects.com/zos/antfincdn/oAnzfiVl2/9d83b3e8-b05c-4475-b736-92c45448546a.png)

Fill in the relevant information according to the Issue template. Yes, these steps are a bit cumbersome, but they are really necessary. Each user has different scenarios, system environment, software version, or some specific steps are required to reproduce the bug. Make it clear this time, you can save everyone's time!

![preview](https://gw.alipayobjects.com/zos/antfincdn/05O3p5nE5/d0d4b120-e5aa-4b51-918b-8a573f8fb794.png)

## Pull Request

> Example[PR](https://github.com/antvis/S2/pull/1652) (pr description reference)

1. Fork the project and clone it (or use GitHub's Codespace feature, which is very convenient)
2. Install dependencies:`pnpm install` or `pnpm bootstrap`
3. Submit your changes, commit please follow[AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w)
4. If your change is to fix a bug, you can also add it after the commit message`close #issue 号`, so that after pr is merged, the corresponding issue can be closed automatically, for example`fix: render bug close #123`
5. Make sure to include the corresponding unit tests and documentation (if necessary)
6. After all Lint and Test checks pass, and review passes, we will merge your pr.

![preview](https://gw.alipayobjects.com/zos/antfincdn/ssOxFrycD/86339514-5f9a-4101-8690-e47c97cd8af5.png)

## Development Process

We use `pnpm@v7` as a package manager

```bash
npm i -g pnpm
```

1. `pnpm` Install dependencies
2. `pnpm site:start` start local`S2` website
3. `pnpm core:start` Use a visual way to debug the single test of the core layer (based on jest-electron)
4. `pnpm react:start` Debug React version unit tests in a visual way (based on jest-electron)
5. `pnpm react:playground` Start a local interactive React version Demo (vite based)
6. `pnpm vue:playground` Start a local interactive Vue3 version Demo (based on vite)
7. `pnpm build` Construct `@antv/s2`,`@antv/s2-react` and `@antv/s2-vue` 3 packets, output separately`umd`,`esm` and `lib` Table of contents
8. `pnpm test` run unit tests
9. `pnpm lint` Static code detection
