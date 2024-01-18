import { get, pick } from 'lodash';
import { type SpreadSheet, type S2Options, OriginEventType } from '../../src';
import { createFederatedMouseEvent, createPivotSheet } from '../util/helpers';

const s2Options: S2Options = {
  width: 600,
  height: 400,
};

describe('HeaderActionIcons Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = createPivotSheet(s2Options);
    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  test('should render custom header action icons', async () => {
    const rowCellDisplayConditionFn = jest.fn();
    const colCellDisplayConditionFn = jest.fn();
    const cornerCellDisplayConditionFn = jest.fn();

    s2.setOptions({
      headerActionIcons: [
        {
          icons: ['Plus'],
          belongsCell: 'rowCell',
          displayCondition: rowCellDisplayConditionFn,
        },
        {
          icons: ['Trend'],
          belongsCell: 'colCell',
          displayCondition: colCellDisplayConditionFn,
        },
        {
          icons: ['Minus'],
          belongsCell: 'cornerCell',
          displayCondition: cornerCellDisplayConditionFn,
        },
      ],
    });

    await s2.render(false);

    [
      ...s2.facet.getRowCells(),
      ...s2.facet.getColCells(),
      ...s2.facet.getCornerCells(),
    ].forEach((cell) => {
      expect(cell.getActionIcons()).toHaveLength(1);
    });

    expect(rowCellDisplayConditionFn).toHaveBeenCalled();
    expect(colCellDisplayConditionFn).toHaveBeenCalled();
    expect(cornerCellDisplayConditionFn).toHaveBeenCalled();
  });

  test('should custom icon fill color', async () => {
    s2.setOptions({
      headerActionIcons: [
        {
          icons: [
            {
              name: 'Plus',
              position: 'right',
              fill: 'red',
            },
          ],
          belongsCell: 'rowCell',
        },
      ],
    });

    await s2.render(false);

    s2.facet.getRowCells().forEach((cell) => {
      expect(get(cell.getActionIcons()[0], 'cfg.fill')).toEqual('red');
    });
  });

  test('should default hide icon', async () => {
    const innerDefaultHide = jest.fn(() => true);
    const defaultHide = jest.fn(() => false);

    s2.setOptions({
      headerActionIcons: [
        {
          icons: [
            {
              name: 'Plus',
              position: 'right',
              defaultHide: innerDefaultHide,
            },
          ],
          belongsCell: 'rowCell',
          defaultHide,
        },
      ],
    });

    await s2.render(false);

    s2.facet.getRowCells().forEach((cell) => {
      expect(cell.getActionIcons()[0].parsedStyle.visibility).toEqual('hidden');
    });

    expect(innerDefaultHide).toHaveBeenCalled();
    expect(defaultHide).not.toHaveBeenCalled();
  });

  test('should not render icons by displayCondition', async () => {
    const innerDisplayCondition = jest.fn(() => false);
    const displayCondition = jest.fn(() => true);

    s2.setOptions({
      headerActionIcons: [
        {
          icons: [
            {
              name: 'Plus',
              position: 'right',
              displayCondition: innerDisplayCondition,
            },
          ],
          belongsCell: 'rowCell',
          displayCondition,
        },
      ],
    });

    await s2.render(false);

    s2.facet.getRowCells().forEach((cell) => {
      expect(cell.getActionIcons()).toBeEmpty();
    });

    expect(innerDisplayCondition).toHaveBeenCalled();
    expect(displayCondition).not.toHaveBeenCalled();
  });

  test('should render multiple custom position', async () => {
    s2.setOptions({
      headerActionIcons: [
        {
          icons: [
            {
              name: 'Plus',
              position: 'right',
            },
            {
              name: 'Trend',
              position: 'left',
            },
          ],
          belongsCell: 'rowCell',
        },
      ],
    });

    await s2.render(false);

    const positions = s2.facet.getRowCells().map((cell) => {
      return cell
        .getActionIcons()
        .map((icon) => pick(icon.iconImageShape.attributes, ['x', 'y']));
    });

    expect(positions).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "x": 9,
            "y": 24.5,
          },
          Object {
            "x": 51,
            "y": 24.5,
          },
        ],
        Array [
          Object {
            "x": 158.5,
            "y": 9.5,
          },
          Object {
            "x": 200.5,
            "y": 9.5,
          },
        ],
        Array [
          Object {
            "x": 158.5,
            "y": 39.5,
          },
          Object {
            "x": 200.5,
            "y": 39.5,
          },
        ],
      ]
    `);
  });

  test('should not render icons by displayCondition1', async () => {
    const onPlusClick = jest.fn();
    const onPlusHover = jest.fn();
    const onTrendClick = jest.fn();
    const onTrendHover = jest.fn();

    const onClick = jest.fn();
    const onHover = jest.fn();

    s2.setOptions({
      headerActionIcons: [
        {
          icons: [
            {
              name: 'Plus',
              position: 'right',
              onClick: onPlusClick,
              onHover: onPlusHover,
            },
            {
              name: 'Trend',
              position: 'right',
              onClick: onTrendClick,
              onHover: onTrendHover,
            },
          ],
          belongsCell: 'rowCell',
          onClick,
          onHover,
        },
      ],
    });

    await s2.render(false);

    const events = [onTrendClick, onTrendHover, onClick, onHover];

    const plusIcon = s2.facet.getRowCells()[0].getActionIcons()[0];

    plusIcon.dispatchEvent(
      createFederatedMouseEvent(s2, OriginEventType.CLICK),
    );

    events.forEach((fn) => {
      expect(fn).not.toHaveBeenCalled();
    });

    expect(onPlusClick).toHaveBeenCalledTimes(1);
  });

  test('should render default right position', async () => {
    s2.setOptions({
      headerActionIcons: [
        {
          icons: ['Trend'],
          belongsCell: 'rowCell',
        },
      ],
    });

    await s2.render(false);

    const positions = s2.facet
      .getRowCells()
      .map((cell) => pick(cell.getActionIcons()[0], ['cfg.x', 'cfg.y']));

    expect(positions).toMatchInlineSnapshot(`
      Array [
        Object {
          "cfg": Object {
            "x": 37,
            "y": 24.5,
          },
        },
        Object {
          "cfg": Object {
            "x": 186.5,
            "y": 9.5,
          },
        },
        Object {
          "cfg": Object {
            "x": 186.5,
            "y": 39.5,
          },
        },
      ]
    `);
  });
});
