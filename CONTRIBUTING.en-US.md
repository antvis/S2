
<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18" alt="language"/>  [简体中文](./CONTRIBUTING.md) ｜
English

## Any kind of contribution is welcome

"My code level is not good ." "Will it be despised?" "Will it be bad?" Don't worry. Feel free to contribute.

We welcome any contribution, whether it's a typo correction or a friendly suggestion, whether it's submitted by [Issue](https://github.com/antvis/S2/issues/new/choose),
a cool [pull request](https://github.com/antvis/S2/pulls), or a DingTalk group discussion, participate in [discussions](https://github.com/antvis/S2/discussions), look forward to seeing your profile picture in [Contributor List](https://github.com/antvis/S2/graphs/contributors).

## Branch Management

Currently, we are developing based on the `next` branch. Please check out a branch based on `next,` and Pull Request if you have any modifications. We will review your `PR` for the first time and give you feedback.

## Report bugs

We are sorry to push bugs. And we would appreciate that if you could report them to us. To save time on the communication, please give details about the bug as much as possible.

### Bad case

![preview](https://gw.alipayobjects.com/zos/antfincdn/j0jUvKwT%26/dd59fe64-7108-4ad7-a544-e19d79eea890.png)

### Good case

1. First select [Bug report]

   ![preview](https://gw.alipayobjects.com/zos/antfincdn/oAnzfiVl2/9d83b3e8-b05c-4475-b736-92c45448546a.png)

2. Fill in the relevant information according to the Issue template.

   We are sorry that these steps are a bit redundant. Since every user uses S2 in different situations, system environment, software version, specific steps to reproduce the bug could help us solve the issue in time.

   ![preview](https://gw.alipayobjects.com/zos/antfincdn/05O3p5nE5/d0d4b120-e5aa-4b51-918b-8a573f8fb794.png)

## Pull Request

1. Fork the project and clone it (or use GitHub's Codespace function, which is very convenient).
2. Installation dependency: `pnpm install`.
3. Commit your changes, and please follow [AngularJS Git Commit Message Conventions] (<https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w>).
4. If your change is a bug fix, you can add `close #issue number` after the submission information so that after the pr merge, the related issue could be closed automatically. eg: `fix: render bug close #123`.
5. Make sure to add the related unit test.
6. After all Lint and Test checks are passed, and the review is passed, we will merge your pr.

![preview](https://gw.alipayobjects.com/zos/antfincdn/ssOxFrycD/86339514-5f9a-4101-8690-e47c97cd8af5.png)

## Development Process

We use `pnpm@v7` as package management.

```bash
npm i -g pnpm
```

1. `pnpm install`: Installation dependency.
2. `pnpm site:bootstrap`: Install site related dependencies.
3. `pnpm site:start`: Starts the local `S2` website.
4. `pnpm core:start`:  Debug and test local `@antv/s2`（Based on jest-electron）.
5. `pnpm react:start` Debug and test local `@antv/s2-react` (Based on jest-electron).
6. `pnpm vue:start` Debug and test local `@antv/s2-vue` (Based on jest-electron).
7. `pnpm react:playground` Starts the local `@antv/s2-react` playground (Based on vite).
8. `pnpm vue:playground` Starts the local `@antv/s2-vue` playground (Based on vite).
9. `pnpm build`: Builds `@antv/s2` and `@antv/s2-react` and `@antv/s2-vue` , outputs are `umd`, `esm` and `lib` directories.
10. `pnpm test`:  Run unit tests.
