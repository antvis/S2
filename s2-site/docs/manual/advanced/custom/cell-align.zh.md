---
title: 自定义单元格对齐方式
order: 4
tag: Updated

---

> **在阅读本节内容前，请确保你已经阅读 [主题配置](/docs/manual/basic/theme) 文档**

为方便用户查看数据，S2 交叉表会在滑动过程中，保证行头和列头的最大可见性。因此，S2 在行头、列头对齐方式所对应的的范围是当前格子的可视区域，而角头，数据单元格所对应的范围是当前格子的实际尺寸区域。

![img](https://gw.alipayobjects.com/zos/antfincdn/avyf3tcnW/2022-02-23%25252016.38.05.gif)

## 角头对齐方式

* 行头单元格（红色部分）对齐方式受 [text](/docs/api/general/S2Theme#defaultcelltheme) 控制
* 列头单元格（蓝色部分）对齐方式受 [bolderText](/docs/api/general/S2Theme#defaultcelltheme) 控制

![img](https://gw.alipayobjects.com/zos/antfincdn/6wPCHImDZ/b36ca38e-aa8e-4ef6-a903-b9d605204de0.png)

<table style="width: 100%; outline: none; border-collapse: collapse;">
  <colgroup>
    <col width="20%"/>
    <col width="80%" />
  </colgroup>
  <tbody>
    <tr>
      <td style="text-align: center;">
        <pre class="language-js">
cornerCell: {
  bolderText: {
    textAlign: 'left',
    textBaseline: 'middle',
  },
  text: {
    textAlign: 'left',
    textBaseline: 'middle',
  }
}
        </pre>
      </td>
      <td>
        <img height="240" alt="left" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/59qgUa9WB/b40fb09c-2c21-4c56-b615-d779e19d9638.png">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
         <pre class="language-js">
cornerCell: {
  bolderText: {
    textAlign: 'center',
    textBaseline: 'middle',
  },
  text: {
    textAlign: 'center',
    textBaseline: 'middle',
  }
}
        </pre>
      </td>
      <td>
        <img height="240" alt="center" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/fOvT3sLQ9/02d6a34b-1763-4f31-8562-79e21bc75a76.png">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
               <pre class="language-js">
cornerCell: {
  bolderText: {
    textAlign: 'right',
    textBaseline: 'middle',
  },
  text: {
    textAlign: 'right',
    textBaseline: 'middle',
  }
}
        </pre>
      </td>
      <td>
        <img height="240" alt="right" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/sTu9eALcY/42e023dd-50e7-4787-9ae5-6e1c67c0ab2d.png">
      </td>
    </tr>
  </tbody>
</table>

> `textBaseline` 也有三种模式：`top`，`middle`，`bottom`。效果不再赘述。

## 行头对齐方式

* 非叶子节点和小计总计单元格（红色部分）对齐方式受 [bolderText](/docs/api/general/S2Theme#defaultcelltheme) 控制
* 叶子节点单元格（蓝色部分）对齐方式受 [text](/docs/api/general/S2Theme#defaultcelltheme) 控制
* 序号单元格（黄色部分）可单独控制，默认和行头对齐，对齐方式受 [seriesText](/docs/api/general/S2Theme#defaultcelltheme) 控制
* 数值单元格（当数值置于行头时）可单独控制，默认和行头对齐，对齐方式受 [measureText](/docs/api/general/S2Theme#defaultcelltheme) 控制

![img](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*JgZxT7sNnTgAAAAAAAAAAAAADmJ7AQ/original)

<table style="width: 100%; outline: none; border-collapse: collapse;">
  <colgroup>
    <col width="20%"/>
    <col width="80%" />
  </colgroup>
  <tbody>
    <tr>
      <td style="text-align: center;">
        <pre class="language-js">
rowCell: {
  bolderText: {
    textAlign: 'left',
  },
  text: {
    textAlign: 'left',
  }
}
        </pre>
      </td>
      <td>
        <img height="240" alt="left" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/FgpDz6l23/2fcc030b-ce02-47fc-b110-84c4744e85e6.png">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
         <pre class="language-js">
rowCell: {
  bolderText: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
  }
}
        </pre>
      </td>
      <td>
        <img height="240" alt="center" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/YqnVf5XTk/cf3854a5-66bb-4208-8764-c5ae136e0e4b.png">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
               <pre class="language-js">
rowCell: {
  bolderText: {
    textAlign: 'right',
  },
  text: {
    textAlign: 'right',
  }
}
        </pre>
      </td>
      <td>
        <img height="240" alt="right" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/XCKtLOnFh/1b0b2275-54eb-4d64-99e5-3f088dbecbd4.png">
      </td>
    </tr>
  </tbody>
</table>

## 列头对齐方式

* 其他非叶子维度单元格（红色部分）对齐方式受 [bolderText](/docs/api/general/S2Theme#defaultcelltheme) 控制 （默认和数据单元格对齐）
* 数值单元格（蓝色部分，当数值置于列头时）对齐方式受 [measureText](/docs/api/general/S2Theme#defaultcelltheme) 控制
* 叶子维度单元格（黄色部分，当数值置于行头时，或者在列头但隐藏数值列时的最后一个维度）对齐方式受 [text](/docs/api/general/S2Theme#defaultcelltheme) 控制

> 列头的滚动对齐只针对于非叶子维度节点，叶子维度节点对齐对应的范围是当前格子的实际尺寸区域。

<image alt="col cell align desc" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*HRU7R4m6SMQAAAAAAAAAAAAADmJ7AQ/original" width="600" />
<image alt="col cell align desc" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*FX28Q524QD0AAAAAAAAAAAAADmJ7AQ/original" width="658" />

<table style="width: 100%; outline: none; border-collapse: collapse;">
  <colgroup>
    <col width="20%"/>
    <col width="80%" />
  </colgroup>
  <tbody>
    <tr>
      <td style="text-align: center;">
        <pre class="language-js">
colCell: {
  bolderText: {
    textAlign: 'left',
  },
  measureText: {
    textAlign: 'left',
  }
}
        </pre>
      </td>
      <td>
        <img height="180" alt="left" style="max-height: unset; clip-path: inset(5px 0px 0px 0px);" src="https://gw.alipayobjects.com/zos/antfincdn/nioLivnuF/CleanShot%2525202022-03-03%252520at%25252017.53.49.gif">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
         <pre class="language-js">
colCell: {
  bolderText: {
    textAlign: 'center',
  },
  measureText: {
    textAlign: 'center',
  },
}
        </pre>
      </td>
      <td>
        <img height="180" alt="center" style="max-height: unset; clip-path: inset(5px 0px 0px 0px);" src="https://gw.alipayobjects.com/zos/antfincdn/kn9Y4FGAb/CleanShot%2525202022-03-03%252520at%25252018.00.06.gif">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
               <pre class="language-js">
colCell: {
  bolderText: {
    textAlign: 'right',
  },
  measureText: {
    textAlign: 'right',
  }
}
        </pre>
      </td>
      <td>
        <img height="180" alt="right" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/LAv2EKaGS/CleanShot%2525202022-03-03%252520at%25252018.01.33.gif">
      </td>
    </tr>
  </tbody>
</table>

## 数据单元格对齐方式

* 小计总计单元格（红色部分）对齐方式受 [bolderText](/docs/api/general/S2Theme#defaultcelltheme) 控制
* 其他节点单元格（蓝色部分）对齐方式受 [text](/docs/api/general/S2Theme#defaultcelltheme) 控制

![img](https://gw.alipayobjects.com/zos/antfincdn/WHa%26eKOrP/00951ab0-b25c-4512-a056-541efff7c9dc.png)

<table style="width: 100%; outline: none; border-collapse: collapse;">
  <colgroup>
    <col width="20%"/>
    <col width="80%" />
  </colgroup>
  <tbody>
    <tr>
      <td style="text-align: center;">
        <pre class="language-js">
dataCell: {
  bolderText: {
    textAlign: 'left',
    textBaseline: 'top',
  },
  text: {
    textAlign: 'left',
    textBaseline: 'top',
  }
}
        </pre>
      </td>
      <td>
        <img height="400" alt="left" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*3RxdRKAAGQQAAAAAAAAAAAAADmJ7AQ/original">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
         <pre class="language-js">
dataCell: {
  bolderText: {
    textAlign: 'center',
    textBaseline: 'middle',
  },
  text: {
    textAlign: 'center',
    textBaseline: 'middle',
  }
}
        </pre>
      </td>
      <td>
        <img height="400" alt="center" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*HLyyQLnW39YAAAAAAAAAAAAADmJ7AQ/original">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
               <pre class="language-js">
dataCell: {
   bolderText: {
    textAlign: 'right',
    textBaseline: 'bottom',
  },
  text: {
    textAlign: 'right',
    textBaseline: 'bottom',
  }
}
        </pre>
      </td>
      <td>
        <img height="400" alt="right" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*DnuzQ41eFXYAAAAAAAAAAAAADmJ7AQ/original">
      </td>
    </tr>
  </tbody>
</table>

## 自定义特定单元格对齐方式

有时我们想达到类似 [`字段标记`](https://s2.antv.antgroup.com/manual/basic/conditions) 的效果，对特定**满足条件**的单元格进行 `自定义对齐方式`, 而不是改变所有，这时我们可以通过 [`自定义单元格`](https://s2.antv.antgroup.com/examples/custom/custom-cell/#custom-specified-cell), 通过 S2 提供的 `dataCell`, `colCell`, `rowCell` 等自定义 Hook 来做自定义。

<Playground path='custom/custom-cell/demo/custom-specified-cell.ts' rid='container' height='400'></playground>
