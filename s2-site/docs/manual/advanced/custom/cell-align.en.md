---
title: Customize Cell Alignment
order: 4
---

> **Before reading this section, please make sure you have read the [theme configuration](/docs/manual/basic/theme) documentation**

In order to facilitate users to view data, S2 crosstab will ensure the maximum visibility of row and column headers during the sliding process

![img](https://gw.alipayobjects.com/zos/antfincdn/avyf3tcnW/2022-02-23%25252016.38.05.gif)

Therefore, S2 has certain restrictions on the alignment of cells. The alignment behaviors that can be customized for each type of cell are introduced below.

## Corner Alignment

* The alignment of row header cells (red part) is controlled by [bolderText](/docs/api/general/S2Theme#defaultcelltheme)
* The alignment of the column header cell (blue part) is controlled by [text](/docs/api/general/S2Theme#defaultcelltheme)

![img](https://gw.alipayobjects.com/zos/antfincdn/6wPCHImDZ/b36ca38e-aa8e-4ef6-a903-b9d605204de0.png)

The `textBaseline` of the corner header is internally specified as `middle` , so only `textAlign` can be customized. The following are the display forms of the three alignment methods:

<table style="width: 100%; outline: none; border-collapse: collapse;"><colgroup><col width="20%"><col width="80%"></colgroup><tbody><tr><td style="text-align: center;"><pre class="language-js">
cornerCell: {
 text: {
 textAlign: 'left',
 },
 bolderText: {
 textAlign: 'left',
 }
}
</pre></td><td><img height="240" alt="left" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/59qgUa9WB/b40fb09c-2c21-4c56-b615-d779e19d9638.png"></td></tr><tr><td style="text-align: center;"><pre class="language-js">
cornerCell: {
 text: {
 textAlign: 'center',
 },
 bolderText: {
 textAlign: 'center',
 }
}
</pre></td><td><img height="240" alt="center" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/fOvT3sLQ9/02d6a34b-1763-4f31-8562-79e21bc75a76.png"></td></tr><tr><td style="text-align: center;"><pre class="language-js">
cornerCell: {
 text: {
 textAlign: 'right',
 },
 bolderText: {
 textAlign: 'right',
 }
}
</pre></td><td><img height="240" alt="right" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/sTu9eALcY/42e023dd-50e7-4787-9ae5-6e1c67c0ab2d.png"></td></tr></tbody></table>

## line header alignment

* The alignment of non-leaf nodes and subtotal cells (red parts) is controlled by [bolderText](/docs/api/general/S2Theme#defaultcelltheme)
* The alignment of leaf node cells (blue part) is controlled by [text](/docs/api/general/S2Theme#defaultcelltheme)
* The serial number cell can be controlled separately, and it is aligned with the row header by default, and the alignment is controlled by [seriesText](/docs/api/general/S2Theme#defaultcelltheme)

![img](https://gw.alipayobjects.com/zos/antfincdn/GPEd6w4pj/f2bb3ba9-e4a4-4304-a7b6-a1b9e59e768a.png)

Due to the feature of sliding and centering, the `textBaseline` of the line header is internally specified as `top` , so only `textAlign` can be customized. The following are the display forms of the three alignment methods:

<table style="width: 100%; outline: none; border-collapse: collapse;"><colgroup><col width="20%"><col width="80%"></colgroup><tbody><tr><td style="text-align: center;"><pre class="language-js">
 rowCell: {
 text: {
 textAlign: 'left',
 },
 bolderText: {
 textAlign: 'left',
 }
}
</pre></td><td><img height="240" alt="left" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/FgpDz6l23/2fcc030b-ce02-47fc-b110-84c4744e85e6.png"></td></tr><tr><td style="text-align: center;"><pre class="language-js">
 rowCell: {
 text: {
 textAlign: 'center',
 },
 bolderText: {
 textAlign: 'center',
 }
}
</pre></td><td><img height="240" alt="center" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/YqnVf5XTk/cf3854a5-66bb-4208-8764-c5ae136e0e4b.png"></td></tr><tr><td style="text-align: center;"><pre class="language-js">
 rowCell: {
 text: {
 textAlign: 'right',
 },
 bolderText: {
 textAlign: 'right',
 }
}
</pre></td><td><img height="240" alt="right" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/XCKtLOnFh/1b0b2275-54eb-4d64-99e5-3f088dbecbd4.png"></td></tr></tbody></table>

## column header alignment

In order to ensure the maximum visibility under sliding, the `textBaseline` of the non-leaf node cells in the column head is internally specified as `middle` , and the `textAlign` is unlimited and can be customized as needed.

* The alignment of the indicator cell (red part) is controlled by [bolderText](/docs/api/general/S2Theme#defaultcelltheme)
* The alignment of other dimension cells (blue part) is controlled by [measureText](/docs/api/general/S2Theme#defaultcelltheme) (by default, it is aligned with the data cell)

<img alt="col cell align desc" src="https://gw.alipayobjects.com/zos/antfincdn/Jr7Gv9LQ9/1969f010-2bae-4b38-b06f-2935b2c69d1d.png" width="400">

The effects of the three alignment methods of the column header cells are as follows:

<table style="width: 100%; outline: none; border-collapse: collapse;"><colgroup><col width="20%"><col width="80%"></colgroup><tbody><tr><td style="text-align: center;"><pre class="language-js">
colCell: {
 measureText: {
 textAlign: 'left',
 },
 bolderText: {
 textAlign: 'left',
 }
}
</pre></td><td><img height="180" alt="left" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/nioLivnuF/CleanShot%2525202022-03-03%252520at%25252017.53.49.gif"></td></tr><tr><td style="text-align: center;"><pre class="language-js">
colCell: {
 measureText: {
 textAlign: 'center',
 },
 bolderText: {
 textAlign: 'center',
 }
}
</pre></td><td><img height="180" alt="center" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/kn9Y4FGAb/CleanShot%2525202022-03-03%252520at%25252018.00.06.gif"></td></tr><tr><td style="text-align: center;"><pre class="language-js">
colCell: {
 measureText: {
 textAlign: 'right',
 },
 bolderText: {
 textAlign: 'right',
 }
}
</pre></td><td><img height="180" alt="right" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/LAv2EKaGS/CleanShot%2525202022-03-03%252520at%25252018.01.33.gif"></td></tr></tbody></table>

## Data Cell Alignment

* The alignment of subtotal total cell (red part) is controlled by [bolderText](/docs/api/general/S2Theme#defaultcelltheme)
* The alignment of other node cells (blue parts) is controlled by [text](/docs/api/general/S2Theme#defaultcelltheme)

![img](https://gw.alipayobjects.com/zos/antfincdn/WHa%26eKOrP/00951ab0-b25c-4512-a056-541efff7c9dc.png)

The data cell `textBaseline` and `textAlign` are unlimited and can be customized:

<table style="width: 100%; outline: none; border-collapse: collapse;"><colgroup><col width="20%"><col width="80%"></colgroup><tbody><tr><td style="text-align: center;"><pre class="language-js">
dataCell: {
 text: {
 textAlign: 'left',
 textBaseline: 'top',
 },
 bolderText: {
 textAlign: 'left',
 textBaseline: 'top',
 }
}
</pre></td><td><img height="240" alt="left" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/LREbNS351/3059e6bd-6602-4fa2-8213-47c7dfd65f3b.png"></td></tr><tr><td style="text-align: center;"><pre class="language-js">
dataCell: {
 text: {
 textAlign: 'center',
 textBaseline: 'middle',
 },
 bolderText: {
 textAlign: 'center',
 textBaseline: 'middle',
 }
}
</pre></td><td><img height="240" alt="center" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/svHPloVIR/5680cdfa-cf9e-4d22-b934-80e8591ed249.png"></td></tr><tr><td style="text-align: center;"><pre class="language-js">
dataCell: {
 text: {
 textAlign: 'right',
 textBaseline: 'bottom',
 },
 bolderText: {
 textAlign: 'right',
 textBaseline: 'bottom',
 }
}
</pre></td><td><img height="240" alt="right" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/5XhiGZc%26%24/b1053aa7-b9ff-4688-b8de-d33f62d26c5a.png"></td></tr></tbody></table>

## Customize specific cell alignment

Sometimes we want to achieve an effect similar to[`字段标记`](https://s2.antv.antgroup.com/manual/basic/conditions), and`自定义对齐方式`of specific cells that **meet the conditions** , instead of changing everything. At this time, we can[`自定义单元格`](https://s2.antv.antgroup.com/examples/custom/custom-cell/#custom-specified-cell), `dataCell` , `colCell` , `rowCell` , etc. provided by S2 Hook to do customization.

<Playground path="custom/custom-cell/demo/custom-specified-cell.ts" rid="container" height="400"></Playground>
