import React, { useState, useMemo, useRef } from 'react';
import { reactRender } from '../src/utils/reactRender';
import { SheetComponent } from '../src';
import type { SheetComponentOptions } from '../src';
import { SpreadSheet } from '@antv/s2';
import type { S2DataConfig, SimplePalette } from '@antv/s2';
import { Card, Input, Button, Space, Switch, Tag, Typography, Divider, Badge } from 'antd';
import { SendOutlined, BulbOutlined, UndoOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './index.less';

const { Text, Title } = Typography;

// 2. 转换函数：0 -> A, 1 -> B, 25 -> Z, 26 -> AA
function getExcelColumnLabel(index: number): string {
  let label = '';
  let temp = index;
  while (temp >= 0) {
    label = String.fromCharCode((temp % 26) + 65) + label;
    temp = Math.floor(temp / 26) - 1;
  }
  return label;
}

// 原始测试数据
const RAW_DATA = [
  { col0: 'Apples', col1: 50, col2: 1.2, col3: 'Fruit', col4: '2026-05-01', col5: 60, col6: 'In Stock', col7: 'Aisle 1' },
  { col0: 'Bananas', col1: 120, col2: 0.8, col3: 'Fruit', col4: '2026-05-02', col5: 96, col6: 'In Stock', col7: 'Aisle 1' },
  { col0: 'Carrots', col1: 80, col2: 1.5, col3: 'Vegetable', col4: '2026-05-03', col5: 120, col6: 'Low Stock', col7: 'Aisle 2' },
  { col0: 'Dates', col1: 15, col2: 5.0, col3: 'Fruit', col4: '2026-05-04', col5: 75, col6: 'Out of Stock', col7: 'Aisle 3' },
  { col0: 'Eggplant', col1: 40, col2: 2.0, col3: 'Vegetable', col4: '2026-05-05', col5: 80, col6: 'In Stock', col7: 'Aisle 2' },
  { col0: 'Figs', col1: 30, col2: 4.5, col3: 'Fruit', col4: '2026-05-06', col5: 135, col6: 'In Stock', col7: 'Aisle 3' },
  { col0: 'Grapes', col1: 150, col2: 2.5, col3: 'Fruit', col4: '2026-05-07', col5: 375, col6: 'In Stock', col7: 'Aisle 1' },
  { col0: 'Honey', col1: 25, col2: 8.5, col3: 'Sweetener', col4: '2026-05-08', col5: 212.5, col6: 'In Stock', col7: 'Aisle 4' },
];

interface ChatMessage {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
}

function MainLayout() {
  const s2Ref = useRef<SpreadSheet | null>(null);

  // 基础开关配置
  const [useExcelTheme, setUseExcelTheme] = useState(true);
  const [useExcelHeaders, setUseExcelHeaders] = useState(true);
  const [disableCrosshair, setDisableCrosshair] = useState(true);

  // 表格数据 & 条件高亮状态
  const [data, setData] = useState(RAW_DATA);
  const [highlightedCol, setHighlightedCol] = useState<string | null>(null);

  // Chat Excel 模拟器状态
  const [chatQuery, setChatQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'assistant',
      text: '你好！我是 Chat Excel 助手。你可以让我对表格进行【筛选】、【高亮】或【排序】，例如：\n1. "筛选出 Fruit 商品"\n2. "高亮总额大于 100 的格子"\n3. "按数量降序排序"',
    },
  ]);

  // 处理 Chat 命令
  const handleCommand = (queryText: string) => {
    if (!queryText.trim()) return;

    // 1. 添加用户消息
    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatQuery('');

    // 2. 模拟 AI 逻辑处理并更新表格
    setTimeout(() => {
      let replyText = '抱歉，我不明白这个指令。试着点击下方的快捷提示词吧！';
      const cleanQuery = queryText.toLowerCase();

      if (cleanQuery.includes('fruit') || cleanQuery.includes('水果')) {
        setData(RAW_DATA.filter((item) => item.col3 === 'Fruit'));
        replyText = '✨ 已为您筛选出分类 (Category) 为 "Fruit" 的所有数据！';
      } else if (cleanQuery.includes('大于100') || cleanQuery.includes('> 100') || cleanQuery.includes('highlight') || cleanQuery.includes('高亮')) {
        setHighlightedCol('col5'); // col5 是总额 (Total)
        replyText = '✨ 已为您高亮标记总额 (Total) 大于 100 的单元格！';
      } else if (cleanQuery.includes('排序') || cleanQuery.includes('sort') || cleanQuery.includes('降序')) {
        const sorted = [...RAW_DATA].sort((a, b) => b.col1 - a.col1);
        setData(sorted);
        replyText = '✨ 已按数量 (Quantity) 列进行降序排列！';
      } else if (cleanQuery.includes('重置') || cleanQuery.includes('reset') || cleanQuery.includes('恢复')) {
        setData(RAW_DATA);
        setHighlightedCol(null);
        replyText = '✨ 表格数据与高亮状态已恢复初始设置！';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: replyText,
        },
      ]);
    }, 600);
  };

  // 生成 S2 的 dataCfg
  const dataCfg = useMemo<S2DataConfig>(() => {
    const fieldsList = Array.from({ length: 8 }, (_, i) => `col${i}`);

    // 原始业务标题映射
    const defaultMeta = [
      { field: 'col0', name: 'Product Name' },
      { field: 'col1', name: 'Quantity' },
      { field: 'col2', name: 'Unit Price ($)' },
      { field: 'col3', name: 'Category' },
      { field: 'col4', name: 'Date' },
      { field: 'col5', name: 'Total ($)' },
      { field: 'col6', name: 'Status' },
      { field: 'col7', name: 'Location' },
    ];

    // If useExcelHeaders is true, columns is a hierarchical custom tree node list
    const columns = useExcelHeaders
      ? defaultMeta.map((m, idx) => ({
          field: `${m.field}_parent`,
          title: getExcelColumnLabel(idx),
          children: [
            {
              field: m.field,
              title: m.name,
            },
          ],
        }))
      : fieldsList;

    // 条件高亮配置 (模拟 Chat Excel 指令)
    const conditions = highlightedCol
      ? {
          background: [
            {
              field: highlightedCol,
              mapping: (value: number) => {
                if (value > 100) {
                  return {
                    fill: '#E2EFDA', // Excel 浅绿色
                  };
                }
                return {};
              },
            },
          ],
        }
      : undefined;

    return {
      fields: {
        columns,
      },
      meta: defaultMeta,
      data,
      conditions,
    };
  }, [data, useExcelHeaders, highlightedCol]);

  const themeCfg = useMemo(() => {
    return {
      name: (useExcelTheme ? 'excel' : 'default') as 'excel' | 'default',
      getCustomTheme: (palette: SimplePalette) => {
        if (!useExcelTheme) return {};
        return {
          rowCell: {
            cell: {
              backgroundColor: palette.basicColors[3], // Excel header gray (#E6E6E6)
              horizontalBorderColor: palette.basicColors[10], // Gray header border (#B4B4B4)
              verticalBorderColor: palette.basicColors[10],
              interactionState: {
                hover: {
                  backgroundColor: palette.basicColors[4], // Excel header hover gray (#D9D9D9)
                  backgroundOpacity: 1,
                },
                selected: {
                  backgroundColor: palette.basicColors[4], // Excel header selected gray (#D9D9D9)
                  backgroundOpacity: 1,
                },
              },
            },
            seriesText: {
              fill: '#000000',
            },
            text: {
              fill: '#000000',
            },
          },
          dataCell: {
            cell: {
              interactionState: {
                selected: {
                  backgroundColor: palette.basicColors[2], // Light gray background selection mask
                  backgroundOpacity: 0.2,
                  borderColor: (palette as any).brandColor, // Excel green border
                  borderWidth: 2,
                  borderOpacity: 1,
                },
                hoverFocus: {
                  backgroundColor: palette.basicColors[2],
                  backgroundOpacity: 0.2,
                  borderColor: (palette as any).brandColor,
                  borderWidth: 2,
                  borderOpacity: 1,
                },
              },
            },
          },
        };
      },
    };
  }, [useExcelTheme]);

  // 生成 S2 的 options
  const options = useMemo<SheetComponentOptions>(() => {
    const interactionConfig = disableCrosshair
      ? {
          // 仅高亮行头/列头，去掉十字形选中高亮
          hoverHighlight: {
            rowHeader: true,
            colHeader: true,
            currentRow: false,
            currentCol: false,
          },
          selectedCellHighlight: {
            rowHeader: true,
            colHeader: true,
            currentRow: false,
            currentCol: false,
          },
        }
      : {
          // 默认十字高亮效果
          hoverHighlight: true,
          selectedCellHighlight: true,
        };

    return {
      width: 780,
      height: 400,
      showSeriesNumber: false, // 禁用默认的序号行为以防冲突
      seriesNumber: {
        enable: useExcelHeaders, // 开启数字序号列
        text: '', // 序号列顶部角头显示为空
      },
      placeholder: {
        cell: (cell) => {
          const meta = cell?.['getMeta']?.();
          if (meta?.field === '$$series_number$$') {
            return ' ';
          }
          return '-';
        },
      },
      interaction: {
        ...interactionConfig,
        selectedCellsSpotlight: false, // 不启用选中变暗效果，保持 excel 式的聚焦
      },
    };
  }, [useExcelHeaders, disableCrosshair]);

  return (
    <div className="playground" style={{ padding: '24px', background: '#f5f7f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* 头部样式插入 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .excel-chat-bubble {
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 8px;
          max-width: 85%;
          word-break: break-all;
        }
        .excel-chat-user {
          background-color: #217346;
          color: white;
          align-self: flex-end;
          margin-left: auto;
        }
        .excel-chat-assistant {
          background-color: #e9ecef;
          color: #333;
          align-self: flex-start;
          white-space: pre-line;
        }
        .antv-s2-wrapper {
          border: 1px solid #d4d4d4 !important;
          border-radius: 4px;
          overflow: hidden;
        }
      `}} />

      {/* 顶栏 */}
      <Card style={{ marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ margin: 0, color: '#217346', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px' }}>📊</span> AntV S2 Excel 高级仿真 Playground
            </Title>
            <Text type="secondary">在此预览配色微调、ABC/123 标题和去除十字高亮的效果，并测试 Chat Excel 智能操控。</Text>
          </div>
          <Tag color="success" icon={<CheckCircleOutlined />}>S2 v2 Engine Running</Tag>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        
        {/* 左侧控制与模拟器栏 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 交互开关控制 */}
          <Card title="🎛️ 仿真效果开关" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Excel 配色调色板</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>使用 Excel 主题网格和主色</Text>
                </div>
                <Switch checked={useExcelTheme} onChange={setUseExcelTheme} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>ABC / 123 报表头</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>顶部字母，左侧数字行号</Text>
                </div>
                <Switch checked={useExcelHeaders} onChange={setUseExcelHeaders} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>禁止十字高亮</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>仅高亮选中的单元格</Text>
                </div>
                <Switch checked={disableCrosshair} onChange={setDisableCrosshair} />
              </div>
            </div>
          </Card>

          {/* Chat Excel 智能面板 */}
          <Card title="💬 Chat Excel 智能助手" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '340px' }}>
              
              {/* 聊天消息区 */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', border: '1px solid #e8e8e8', borderRadius: '6px', marginBottom: '12px', background: '#fafafa' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`excel-chat-bubble ${msg.sender === 'user' ? 'excel-chat-user' : 'excel-chat-assistant'}`}
                  >
                    {msg.sender === 'user' ? <Badge status="processing" style={{ marginRight: '6px' }} /> : null}
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* 快捷操作 */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BulbOutlined /> 常用快捷指令:
                </div>
                <Space size={[4, 6]} wrap>
                  <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => handleCommand('筛选出 Fruit 商品')}>
                    筛选 Fruit
                  </Tag>
                  <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => handleCommand('高亮总额大于 100 的格子')}>
                    高亮 Total &gt; 100
                  </Tag>
                  <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => handleCommand('按数量降序排序')}>
                    数量降序
                  </Tag>
                </Space>
              </div>

              {/* 输入框 */}
              <Input.Search
                placeholder="发送 Excel 指令..."
                enterButton={<SendOutlined />}
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onSearch={handleCommand}
                style={{ width: '100%' }}
              />
            </div>
          </Card>
        </div>

        {/* 右侧 S2 展示栏 */}
        <Card 
          title="⚡ Excel 仿真表格预览" 
          extra={
            <Button size="small" icon={<UndoOutlined />} onClick={() => handleCommand('重置')}>
              重置数据
            </Button>
          }
          style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          <div style={{ background: '#fff', padding: '16px', borderRadius: '4px', border: '1px dashed #e8e8e8' }}>
            <SheetComponent
              sheetType="table"
              dataCfg={dataCfg}
              options={options}
              themeCfg={themeCfg}
              onMounted={(instance) => {
                (window as any).s2 = instance;
              }}
              ref={s2Ref}
            />
          </div>

          <Divider style={{ margin: '16px 0' }} />
          
          <div style={{ background: '#fcfcfc', padding: '12px', borderRadius: '6px', border: '1px solid #eef0ef' }}>
            <Title level={5} style={{ marginTop: 0 }}>💡 仿真特点说明：</Title>
            <ul>
              <li><strong>配色同步：</strong>表头背景为 Excel 极浅灰 (`#F3F2F1`)，网格线使用 `#D4D4D4`；选中和 Hover 单元格的外边框表现为经典的 Excel 绿色 (`#217346`)。</li>
              <li><strong>ABC/123 双层表头：</strong>顶部显示特殊的 A, B, C 列坐标层，其下方为实际的业务语义表头（只有语义表头支持筛选/排序等交互），左侧显示标准的 1, 2, 3 数字行号。</li>
              <li><strong>Excel 式选择框：</strong>框选多个单元格时，单元格之间不再有各自重叠的边框，而是连成一片、由单一的 Excel 绿色外边框包裹，且移除了默认的十字交叉选中背景色。</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

reactRender(<MainLayout />, document.getElementById('root')!);
