import { mcpApiController } from '../../controllers/index.ts';
import { mcpValidation } from '../../validations/index.ts';
import auth from '../../middlewares/auth.ts';
import validate from '../../middlewares/validate.ts';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: MCP
 *   description: Model Context Protocol endpoints for tool execution and management
 */

/**
 * @swagger
 * /mcp:
 *   post:
 *     summary: Execute MCP tool or function call
 *     tags: [MCP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tool
 *             properties:
 *               tool:
 *                 type: string
 *                 description: The ID of the tool to execute
 *               inputs:
 *                 type: object
 *                 description: Input parameters for the tool
 *             example:
 *               tool: "user_tool"
 *               inputs:
 *                 userId: "1"
 *     responses:
 *       "200":
 *         description: Tool executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   description: Result of the tool execution
 *               example:
 *                 result:
 *                   success: true
 *                   data: "Tool executed successfully"
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 *   get:
 *     summary: Get available MCP tools and their schemas
 *     tags: [MCP]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of available MCP tools
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tools:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Tool identifier
 *                       name:
 *                         type: string
 *                         description: Tool display name
 *                       description:
 *                         type: string
 *                         description: Tool description
 *                       inputSchema:
 *                         type: object
 *                         description: JSON schema for tool inputs
 *                       outputSchema:
 *                         type: object
 *                         description: JSON schema for tool outputs
 *               example:
 *                 tools:
 *                   - id: "user_tool"
 *                     name: "User Tool"
 *                     description: "Tool for user operations"
 *                     inputSchema:
 *                       type: "object"
 *                       properties:
 *                         userId:
 *                           type: "string"
 *                     outputSchema:
 *                       type: "object"
 *                       properties:
 *                         success:
 *                           type: "boolean"
 *                         data:
 *                           type: "string"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 *   delete:
 *     summary: Reset or clear MCP tool state
 *     tags: [MCP]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Tool state reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *               example:
 *                 success: true
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 */

router
    .route('/')
    .post(auth('manageMcp'), validate(mcpValidation.executeTool), mcpApiController.executeTool)
    .get(auth('getMcp'), validate(mcpValidation.getTools), mcpApiController.getTools)
    .delete(auth('manageMcp'), validate(mcpValidation.resetTools), mcpApiController.resetTools);

export default router;
