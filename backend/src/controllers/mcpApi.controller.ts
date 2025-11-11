import { mcpApiService } from '../services/index.ts';
import catchAsyncWithAuth from '../utils/catchAsyncWithAuth.ts';
import httpStatus from 'http-status';
import { Request, Response } from 'express';

/**
 * POST /mcp - Execute MCP tool or function call
 */
const executeTool = catchAsyncWithAuth(async (req: Request, res: Response) => {
    const { tool, inputs } = req.body;
    const result = await mcpApiService.executeTool(tool, inputs);
    res.status(httpStatus.OK).send(result);
});

/**
 * GET /mcp - Get available MCP tools and their schemas
 */
const getTools = catchAsyncWithAuth(async (req: Request, res: Response) => {
    const result = await mcpApiService.getAvailableTools();
    res.status(httpStatus.OK).send(result);
});

/**
 * DELETE /mcp - Reset or clear MCP tool state
 */
const resetTools = catchAsyncWithAuth(async (req: Request, res: Response) => {
    const result = await mcpApiService.resetToolState();
    res.status(httpStatus.OK).send(result);
});

export {
    executeTool,
    getTools,
    resetTools
};