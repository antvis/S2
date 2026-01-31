import React, { useState, useEffect } from 'react';
import { SheetComponent } from '@antv/s2-react';
import { Radio, InputNumber, Space, Form } from 'antd';
import '@antv/s2-react/dist/style.min.css';

const CompactDemo = () => {
    const [dataCfg, setDataCfg] = useState(null);
    const [layoutWidthType, setLayoutWidthType] = useState('compact');
    const [compactExtraWidth, setCompactExtraWidth] = useState(0);
    const [compactMinWidth, setCompactMinWidth] = useState(0);

    useEffect(() => {
        fetch(
            'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
        )
            .then((res) => res.json())
            .then((data) => setDataCfg(data));
    }, []);

    const s2Options = {
        width: 600,
        height: 480,
        style: {
            layoutWidthType: layoutWidthType,
            compactExtraWidth,
            compactMinWidth,
        },
    };

    if (!dataCfg) return <div>Loading...</div>;

    return (
        <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 20, padding: 20, background: '#f5f5f5', borderRadius: 6 }}>
                <Form layout="inline">
                    <Form.Item label="Layout Field">
                        <Radio.Group
                            value={layoutWidthType}
                            onChange={(e) => setLayoutWidthType(e.target.value)}
                        >
                            <Radio.Button value="compact">Compact (紧凑)</Radio.Button>
                            <Radio.Button value="adaptive">Adaptive (自适应)</Radio.Button>
                            <Radio.Button value="colAdaptive">ColAdaptive (列等宽)</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>

                <div style={{ marginTop: 16 }}>
                    <Space size={30}>
                        <Form.Item label="Compact Extra Width">
                            <InputNumber
                                value={compactExtraWidth}
                                onChange={(v) => setCompactExtraWidth(v || 0)}
                                disabled={layoutWidthType !== 'compact'}
                                min={0}
                            />
                        </Form.Item>

                        <Form.Item label="Compact Min Width">
                            <InputNumber
                                value={compactMinWidth}
                                onChange={(v) => setCompactMinWidth(v || 0)}
                                disabled={layoutWidthType !== 'compact'}
                                min={0}
                            />
                        </Form.Item>
                    </Space>
                </div>
            </div>

            <SheetComponent
                sheetType="pivot"
                dataCfg={dataCfg}
                options={s2Options}
            />
        </div>
    );
};

// @ts-ignore
reactDOMClient.createRoot(document.getElementById('container')).render(<CompactDemo />);
