---
title: Contribution
order: 7
tag: Updated
---

If you happen to see this article, you must want to contribute to this project

## Contributions of any kind are welcome

"My code level is not good", "Will I be despised?", "Will it be bad?", don't worry, it doesn't exist!

We welcome any form of contribution, whether it is a typo modification, or a friendly suggestion, whether it is by submitting an [Issue](https://github.com/antvis/S2/issues/new/choose) or a cool [pull request](https://github.com/antvis/S2/pulls) , or a discussion in the DingTalk group, participate in [discussions](https://github.com/antvis/S2/discussions) in discussions, and look forward to [contributing](https://github.com/antvis/S2/graphs/contributors) See your avatar [in the list](https://github.com/antvis/S2/graphs/contributors) of contributors.

## branch management

At present, we are developing based on the `next` branch. If there is any modification, please pull a branch based on the `next` , and then in the form of `PR` , we have integrated the DingTalk robot, which will review your PR for the first time and give feedback

## Submit Bug Feedback

I'm sorry to write some bugs again, but please kindly submit a meaningful bug feedback. No one wants to report bugs like this:

![preview](https://gw.alipayobjects.com/zos/antfincdn/j0jUvKwT%26/dd59fe64-7108-4ad7-a544-e19d79eea890.png)

There is no version information, no steps to reproduce, no description of the problem, no code snippets, the opening sentence, the content is all guesswork.

First select \[Bug report]

![preview](https://gw.alipayobjects.com/zos/antfincdn/oAnzfiVl2/9d83b3e8-b05c-4475-b736-92c45448546a.png)

Fill in the relevant information according to the Issue template. Yes, these steps are a little cumbersome, but they are necessary. Each user has different scenarios, system environment, software version, or some specific steps are required to reproduce the bug. Saying it clearly at this time can save everyone's time!

![preview](https://gw.alipayobjects.com/zos/antfincdn/05O3p5nE5/d0d4b120-e5aa-4b51-918b-8a573f8fb794.png)

## Pull Request

> Example [PR](https://github.com/antvis/S2/pull/1652) (pr description reference)

1. Fork the project and clone it (or use GitHub's Codespace function, which is very convenient)
2. Installation dependencies: `pnpm install` or `pnpm bootstrap`
3. Commit your changes, commit Please follow the [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w)
4. If your change is to fix a bug, you can also add a `close #issue 号`after the submission information, so that the corresponding issue can be automatically closed after the pr is merged, such as `fix: render bug close #123`
5. Make sure to add corresponding unit tests and documentation (if necessary)
6. After all Lint and Test checks are passed, and the review is passed, we will merge your pr.

![preview](https://gw.alipayobjects.com/zos/antfincdn/ssOxFrycD/86339514-5f9a-4101-8690-e47c97cd8af5.png)

## Development Process

We use `pnpm@v7` for package management

```bash
npm i -g pnpm
```

1. `pnpm install` installation dependencies
2. `pnpm site:start` starts the local `S2` website
3. `pnpm core:start` uses a visual way to debug the single test of the core layer (based on jest-electron)
4. `pnpm react:start` can debug the unit test of the React version in a visual way (based on jest-electron)
5. `pnpm react:playground` starts a local interactive React version Demo (based on vite)
6. `pnpm vue:playground` starts a local interactive Vue3 version Demo (based on vite)
7. `pnpm build` builds `@antv/s2` , `@antv/s2-react` and `@antv/s2-vue` 3 packages, and outputs `umd` , `esm` and `lib` directories respectively
8. `pnpm test` runs unit tests
9. `pnpm lint` static code detection
