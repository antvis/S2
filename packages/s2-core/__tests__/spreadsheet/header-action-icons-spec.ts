import { get, pick } from 'lodash';
import { OriginEventType, type S2Options, type SpreadSheet } from '../../src';
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

  test('should custom icon origin fill', async () => {
    s2.setOptions({
      customSVGIcons: [
        {
          name: 'CustomIcon',
          src: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><path fill="#90CAF9" d="M43 30V18c0-2.2-1.8-4-4-4H9c-2.2 0-4 1.8-4 4v12c0 2.2 1.8 4 4 4h30c2.2 0 4-1.8 4-4M9 18h30v12H9z"/><circle cx="38" cy="38" r="10" fill="#43A047"/><g fill="#fff"><path d="M32 36h12v4H32z"/><path d="M36 32h4v12h-4z"/></g></svg>`,
        },
      ],
      headerActionIcons: [
        {
          icons: [
            {
              name: 'CustomIcon',
              position: 'right',
              fill: null,
            },
          ],
          belongsCell: 'rowCell',
        },
      ],
    });

    await s2.render(false);

    s2.facet.getRowCells().forEach((cell) => {
      expect(get(cell.getActionIcons()[0], 'cfg.fill')).toEqual(undefined);
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

    expect(positions).toMatchSnapshot();
  });

  test('should only trigger plus icon click event', async () => {
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

    expect(positions).toMatchSnapshot();
  });
});
