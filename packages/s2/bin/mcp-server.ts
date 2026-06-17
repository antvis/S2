#!/usr/bin/env node

import { createWorkbook, AgentModule, FormulaModule, PivotModule, FilterModule, SortModule, EditModule, FreezeModule, ConditionalFormatModule } from '../src/index';
import { createS2MCPServer } from '../src/mcp/index';

const workbook = createWorkbook({
  modules: [PivotModule, FormulaModule, FilterModule, SortModule, EditModule, FreezeModule, ConditionalFormatModule, AgentModule],
});

const { start } = createS2MCPServer(workbook);
start();
