import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { Workbook } from '../workbook';

export interface S2MCPServer {
  server: Server;
  start(): Promise<void>;
}

export function createS2MCPServer(workbook: Workbook): S2MCPServer {
  if (!workbook.agent) {
    throw new Error('createS2MCPServer requires AgentModule. Register AgentModule when creating the workbook.');
  }
  const agent = workbook.agent;

  const server = new Server(
    { name: 's2-spreadsheet', version: '3.0.0-alpha' },
    { capabilities: { tools: {} } },
  );

  function buildToolList() {
    const mcpTools = agent.getMCPTools();
    const tools = mcpTools.map(t => ({
      name: t.name.replace(/\./g, '-'),
      description: t.description,
      inputSchema: t.inputSchema,
    }));

    tools.push(
      { name: 'getContext', description: 'Get the current workbook context (sheets, schema, filters, sort, pivot config)', inputSchema: { type: 'object', properties: { sheet: { type: 'number' } } } },
      { name: 'traceFormula', description: 'Trace a formula cell dependencies and result', inputSchema: { type: 'object', properties: { sheet: { type: 'number' }, row: { type: 'number' }, col: { type: 'number' } }, required: ['sheet', 'row', 'col'] } },
      { name: 'getAuditLog', description: 'Get the operation audit log', inputSchema: { type: 'object', properties: { limit: { type: 'number' } } } },
      { name: 'queryRange', description: 'Query cell values in a range', inputSchema: { type: 'object', properties: { sheet: { type: 'number' }, startRow: { type: 'number' }, endRow: { type: 'number' }, startCol: { type: 'number' }, endCol: { type: 'number' } }, required: ['sheet', 'startRow', 'endRow', 'startCol', 'endCol'] } },
      { name: 'getCellValue', description: 'Get the display value of a single cell', inputSchema: { type: 'object', properties: { sheet: { type: 'number' }, row: { type: 'number' }, col: { type: 'number' } }, required: ['sheet', 'row', 'col'] } },
      { name: 'exportCSV', description: 'Export the current sheet as CSV', inputSchema: { type: 'object', properties: { sheet: { type: 'number' } } } },
      { name: 'importCSV', description: 'Import CSV data into a sheet', inputSchema: { type: 'object', properties: { csv: { type: 'string' }, sheet: { type: 'number' } }, required: ['csv'] } },
      { name: 'registerDataSource', description: 'Register a data source for pivot tables', inputSchema: { type: 'object', properties: { id: { type: 'string' }, data: { type: 'array' } }, required: ['id', 'data'] } },
      { name: 'undo', description: 'Undo the last operation', inputSchema: { type: 'object', properties: {} } },
      { name: 'redo', description: 'Redo the last undone operation', inputSchema: { type: 'object', properties: {} } },
      { name: 'getConditionalFormatRules', description: 'Get conditional formatting rules for a sheet', inputSchema: { type: 'object', properties: { sheet: { type: 'number' } }, required: ['sheet'] } },
    );

    return tools;
  }

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: buildToolList() };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request: { params: { name: string; arguments?: Record<string, unknown> } }) => {
    const { name, arguments: args = {} } = request.params;
    try {
      switch (name) {
        case 'getContext':
          return { content: [{ type: 'text' as const, text: JSON.stringify(agent.getContext(args.sheet as number | undefined), null, 2) }] };
        case 'traceFormula':
          return { content: [{ type: 'text' as const, text: JSON.stringify(agent.traceFormula(args as { sheet: number; row: number; col: number })) }] };
        case 'getAuditLog':
          return { content: [{ type: 'text' as const, text: JSON.stringify(agent.getAuditLog(args.limit as number | undefined)) }] };
        case 'queryRange':
          return { content: [{ type: 'text' as const, text: JSON.stringify(workbook.query.queryRange({ sheet: args.sheet as number, range: { startRow: args.startRow as number, endRow: args.endRow as number, startCol: args.startCol as number, endCol: args.endCol as number } })) }] };
        case 'getCellValue':
          return { content: [{ type: 'text' as const, text: JSON.stringify(workbook.query.getCellDisplayValue(args as { sheet: number; row: number; col: number })) }] };
        case 'exportCSV':
          return { content: [{ type: 'text' as const, text: workbook.exportCSV((args.sheet as number) ?? 0) }] };
        case 'importCSV':
          workbook.importCSV(args.csv as string, (args.sheet as number) ?? 0);
          return { content: [{ type: 'text' as const, text: '{"success":true}' }] };
        case 'registerDataSource':
          workbook.registerDataSource(args.id as string, args.data as unknown[]);
          return { content: [{ type: 'text' as const, text: '{"success":true}' }] };
        case 'undo':
          return { content: [{ type: 'text' as const, text: JSON.stringify({ undone: workbook.undo() }) }] };
        case 'redo':
          return { content: [{ type: 'text' as const, text: JSON.stringify({ redone: workbook.redo() }) }] };
        case 'getConditionalFormatRules': {
          try {
            const rules = workbook.query.moduleQuery('conditionalFormat.getRules', { sheet: args.sheet as number });
            return { content: [{ type: 'text' as const, text: JSON.stringify(rules) }] };
          } catch { return { content: [{ type: 'text' as const, text: '[]' }] }; }
        }
        default: {
          const opName = name.replace(/-/g, '.');
          const result = agent.callTool(opName, args);
          return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
        }
      }
    } catch (e) {
      return { content: [{ type: 'text' as const, text: JSON.stringify({ error: String(e) }) }], isError: true };
    }
  });

  return {
    server,
    async start() {
      const transport = new StdioServerTransport();
      await server.connect(transport);
    },
  };
}
