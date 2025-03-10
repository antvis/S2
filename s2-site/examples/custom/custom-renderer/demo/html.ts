import { S2DataConfig, S2Options, TableSheet } from '@antv/s2';

async function render(data) {
    const container = document.getElementById('container');

    const s2DataConfig: S2DataConfig = {
        fields: {
            columns: [ 'desc'],
        },
        data,
        meta: [
            {
                field: 'desc',
                renderer: {
                    type: 'HTML',
                },
            },
        ],
    };

    const s2Options: S2Options = {
        width: 600,
        height: 600,
        style: {
            dataCell: {
                height: 200,
            },
        },
        seriesNumber: {
            enable: true,
            text: '序号'
        }
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    await s2.render();
}

const data = [
    {
        desc: `
    <h1>欢迎来到富文本示例页面</h1>
    <p>这是一个包含富文本元素的示例页面，您可以看到不同类型的内容。</p>
    <h2>表格示例</h2>
    <table border="1" cellpadding="5" cellspacing="0">
        <thead>
            <tr>
                <th>姓名</th>
                <th>年龄</th>
                <th>城市</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>张三</td>
                <td>25</td>
                <td>北京</td>
            </tr>
            <tr>
                <td>李四</td>
                <td>30</td>
                <td>上海</td>
            </tr>
            <tr>
                <td>王五</td>
                <td>28</td>
                <td>广州</td>
            </tr>
        </tbody>
    </table>
`,
    },
    {
        desc: `<div style="display: flex; column-gap: 8px">
    <a href="https://antv.antgroup.com/" target="_blank" rel="noreferrer">antv</a>
    <a href="https://s2.antv.antgroup.com/" target="_blank" rel="noreferrer">antv/s2</a>
</div>`,
    },
];

render(data);
