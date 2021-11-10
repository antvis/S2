import { PivotSheet, Node } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      data: res.data,
    };
    const s2options = {
      width: 660,
      height: 600,
      headerActionIcons: [{
        iconNames: ['Trend'],
        belongsCell: 'rowCell',
        defaultHide: false,
        displayCondition: (meta) => {
          return meta.key === 'province';
        },
        action: (props) => {
          const { meta, event } = props;
          meta.spreadsheet.tooltip.show({
            position: { x: event.clientX, y: event.clientY },
            element: 'custom click, trend line eg.',
          });
        },
      }],
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
