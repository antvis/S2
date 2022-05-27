---
title: 自定义单元格对齐方式
order: 4
---
> 在阅读本节内容前，请确保你已经阅读 [主题配置](/zh/docs/manual/basic/theme) 文档

为方便用户查看数据，S2 交叉表会在滑动过程中，保证行头和列头的最大可见性
  
![img](https://gw.alipayobjects.com/zos/antfincdn/avyf3tcnW/2022-02-23%25252016.38.05.gif)

因此，S2 对单元格的对齐方式有一定限制。下面分别介绍每个类型单元格可以自定义的对齐行为。

## 角头对齐方式

* 行头单元格（红色部分）对齐方式受 [bolderText](/zh/docs/api/general/S2Theme#defaultcelltheme) 控制
* 列头单元格（蓝色部分）对齐方式受 [text](/zh/docs/api/general/S2Theme#defaultcelltheme) 控制

![img](https://gw.alipayobjects.com/zos/antfincdn/6wPCHImDZ/b36ca38e-aa8e-4ef6-a903-b9d605204de0.png)

角头的 `textBaseline` 被内部规定为 `middle`，因此只能自定义 `textAlign`，下面是三种对齐方式的展示形态：

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
  text: {
    textAlign: 'left',
  },
  bolderText: {
    textAlign: 'left',
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
  text: {
    textAlign: 'center',
  },
  bolderText: {
    textAlign: 'center',
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
  text: {
    textAlign: 'right',
  },
  bolderText: {
    textAlign: 'right',
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

## 行头对齐方式

* 非叶子节点和小计总计单元格（红色部分）对齐方式受 [bolderText](/zh/docs/api/general/S2Theme#defaultcelltheme) 控制
* 叶子节点单元格（蓝色部分）对齐方式受 [text](/zh/docs/api/general/S2Theme#defaultcelltheme) 控制

![img](https://gw.alipayobjects.com/zos/antfincdn/GPEd6w4pj/f2bb3ba9-e4a4-4304-a7b6-a1b9e59e768a.png)

由于滑动居中的特性，行头的 `textBaseline` 被内部规定为 `top`，因此只能自定义 `textAlign`，下面是三种对齐方式的展示形态：

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
  text: {
    textAlign: 'left',
  },
  bolderText: {
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
  text: {
    textAlign: 'center',
  },
  bolderText: {
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
  text: {
    textAlign: 'right',
  },
  bolderText: {
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

为保证滑动下最大可见的特性，列头非叶子节点单元格的 `textBaseline` 被内部规定为 `middle`，`textAlign` 不受限制可按需要自定义。

* 指标单元格（红色部分）对齐方式受 [bolderText](/zh/docs/api/general/S2Theme#defaultcelltheme) 控制
* 其他维度单元格（蓝色部分）对齐方式受 [text](/zh/docs/api/general/S2Theme#defaultcelltheme) 控制

<image alt="col cell align desc" src="https://gw.alipayobjects.com/zos/antfincdn/Jr7Gv9LQ9/1969f010-2bae-4b38-b06f-2935b2c69d1d.png" width="400" />

列头单元格的三种对齐方式效果如下：

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
  text: {
    textAlign: 'left',
  },
  bolderText: {
    textAlign: 'left',
  }
}
        </pre>
      </td>
      <td>
        <img height="180" alt="left" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/nioLivnuF/CleanShot%2525202022-03-03%252520at%25252017.53.49.gif">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
         <pre class="language-js">
colCell: {
  text: {
    textAlign: 'center',
  },
  bolderText: {
    textAlign: 'center',
  }
}
        </pre>
      </td>
      <td>
        <img height="180" alt="center" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/kn9Y4FGAb/CleanShot%2525202022-03-03%252520at%25252018.00.06.gif">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
               <pre class="language-js">
colCell: {
  text: {
    textAlign: 'right',
  },
  bolderText: {
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

* 小计总计单元格（红色部分）对齐方式受 [bolderText](/zh/docs/api/general/S2Theme#defaultcelltheme) 控制
* 其他节点单元格（蓝色部分）对齐方式受 [text](/zh/docs/api/general/S2Theme#defaultcelltheme) 控制

![img](https://gw.alipayobjects.com/zos/antfincdn/WHa%26eKOrP/00951ab0-b25c-4512-a056-541efff7c9dc.png)

数据单元格 `textBaseline` 和 `textAlign` 均无限制，皆可自定义：

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
  text: {
    textAlign: 'left',
    textBaseline: 'top',
  },
  bolderText: {
    textAlign: 'left',
    textBaseline: 'top',
  }
}
        </pre>
      </td>
      <td>
        <img height="240" alt="left" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/LREbNS351/3059e6bd-6602-4fa2-8213-47c7dfd65f3b.png">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
         <pre class="language-js">
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
        </pre>
      </td>
      <td>
        <img height="240" alt="center" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/svHPloVIR/5680cdfa-cf9e-4d22-b934-80e8591ed249.png">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
               <pre class="language-js">
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
        </pre>
      </td>
      <td>
        <img height="240" alt="right" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/5XhiGZc%26%24/b1053aa7-b9ff-4688-b8de-d33f62d26c5a.png">
      </td>
    </tr>
  </tbody>
</table>
