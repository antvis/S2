import { PivotSheet } from '@antv/s2'
import { debounce } from 'lodash'


fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
    .then((res) => res.json())
    .then((dataCfg) => {
        const container = document.getElementById('container');

        const s2Options = {
            width: 600,
            height: 480,
        };
        const s2 = new PivotSheet(container, dataCfg, s2Options);

        s2.render();
        const debounceRender = debounce((width, height) => {
            s2.changeSheetSize(width, height)
            s2.render(false) // 不重新加载数据
        }, 200)

        window.addEventListener('resize', () => {
            const { width, height } = container.getBoundingClientRect()
            debounceRender(width, height)
        })
    });

