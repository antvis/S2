### 调试单测

如果你想查看单测的运行结果，除了常规的 `pnpm core:test` 和 `pnpm react:test` 来运行测试之外，还可以 `可视化的调试单测（基于 jest-electron)`, 可以更快的发现单测的问题。

1. 选择单测

命令行运行 `pnpm core:start` 或者 `pnpm react:start`

<img alt="preview" height="600" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*g52KT5CybhYAAAAAAAAAAAAADmJ7AQ/original" />

2. 查看结果

因为本质上就是一个浏览器，如果单测结果不符合预期，可以正常打断点进行调试，快速分析原因。

<img alt="preview" height="600" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*E71uSYmhz9cAAAAAAAAAAAAADmJ7AQ/original" />
