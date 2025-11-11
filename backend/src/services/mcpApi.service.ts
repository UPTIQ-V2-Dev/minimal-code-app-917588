import { MCPTool } from '../types/mcp.ts';
import { userTools } from '../tools/user.tool.ts';
import { zodToJsonSchema } from 'zod-to-json-schema';
import ApiError from '../utils/ApiError.ts';
import httpStatus from 'http-status';

// Collection of all available tools
const allTools: MCPTool[] = [...userTools];

// Tool registry for state management
const toolRegistry: { [sessionId: string]: { [toolId: string]: any } } = {};

/**
 * Execute an MCP tool with given inputs
 */
const executeTool = async (toolId: string, inputs: any = {}) => {
    const tool = allTools.find(t => t.id === toolId);
    
    if (!tool) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Invalid tool: ${toolId}`);
    }

    try {
        // Validate inputs against tool's input schema
        const validatedInputs = tool.inputSchema.parse(inputs);
        
        // Execute the tool function
        const result = await tool.fn(validatedInputs);
        
        return { result };
    } catch (error) {
        if (error instanceof Error) {
            throw new ApiError(httpStatus.BAD_REQUEST, `Tool execution failed: ${error.message}`);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Tool execution failed');
    }
};

/**
 * Get all available MCP tools and their schemas
 */
const getAvailableTools = () => {
    const tools = allTools.map(tool => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        inputSchema: zodToJsonSchema(tool.inputSchema),
        outputSchema: tool.outputSchema ? zodToJsonSchema(tool.outputSchema) : undefined
    }));

    return { tools };
};

/**
 * Reset or clear MCP tool state
 */
const resetToolState = (sessionId?: string) => {
    if (sessionId) {
        delete toolRegistry[sessionId];
    } else {
        // Clear all tool state
        Object.keys(toolRegistry).forEach(key => {
            delete toolRegistry[key];
        });
    }
    
    return { success: true };
};

export {
    executeTool,
    getAvailableTools,
    resetToolState
};