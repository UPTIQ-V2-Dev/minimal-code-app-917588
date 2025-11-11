# API Specification

## Database Models

```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  name            String?
  password        String
  role            String   @default("USER")
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  Token           Token[]
}

model Token {
  id          Int       @id @default(autoincrement())
  token       String
  type        String
  expires     DateTime
  blacklisted Boolean
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
  userId      Int
}
```

## Authentication Endpoints

---

EP: POST /auth/register
DESC: Register a new user account.
IN: body:{name:str!, email:str!, password:str!}
OUT: 201:{user:obj{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:obj{access:obj{token:str, expires:str}, refresh:obj{token:str, expires:str}}}
ERR: {"400":"Invalid input or email already exists", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
EX_RES_201: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-11-11T10:30:00Z","updatedAt":"2025-11-11T10:30:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-11T11:30:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-18T10:30:00Z"}}}

---

EP: POST /auth/login
DESC: Authenticate user and return tokens.
IN: body:{email:str!, password:str!}
OUT: 200:{user:obj{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:obj{access:obj{token:str, expires:str}, refresh:obj{token:str, expires:str}}}
ERR: {"400":"Invalid input", "401":"Invalid email or password", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'
EX_RES_200: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-11-11T10:30:00Z","updatedAt":"2025-11-11T10:30:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-11T11:30:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-18T10:30:00Z"}}}

---

EP: POST /auth/logout
DESC: Logout user and blacklist refresh token.
IN: body:{refreshToken:str!}
OUT: 204:{}
ERR: {"400":"Invalid input", "404":"Token not found", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/logout -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_204: {}

---

EP: POST /auth/refresh-tokens
DESC: Refresh access and refresh tokens.
IN: body:{refreshToken:str!}
OUT: 200:{access:obj{token:str, expires:str}, refresh:obj{token:str, expires:str}}
ERR: {"400":"Invalid input", "401":"Invalid refresh token", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/refresh-tokens -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_200: {"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-11T11:30:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-18T10:30:00Z"}}

---

EP: POST /auth/forgot-password
DESC: Send password reset email to user.
IN: body:{email:str!}
OUT: 204:{}
ERR: {"400":"Invalid email", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/forgot-password -H "Content-Type: application/json" -d '{"email":"john@example.com"}'
EX_RES_204: {}

---

EP: POST /auth/reset-password
DESC: Reset user password using token.
IN: query:{token:str!}, body:{password:str!}
OUT: 204:{}
ERR: {"400":"Invalid input", "401":"Invalid or expired token", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/reset-password?token=resetToken123 -H "Content-Type: application/json" -d '{"password":"newPassword123"}'
EX_RES_204: {}

---

EP: POST /auth/send-verification-email
DESC: Send email verification to authenticated user.
IN: headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/send-verification-email -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: {}

---

EP: POST /auth/verify-email
DESC: Verify user email using token.
IN: query:{token:str!}
OUT: 204:{}
ERR: {"400":"Invalid token", "401":"Token expired or invalid", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/verify-email?token=verifyToken123
EX_RES_204: {}

## User Management Endpoints

---

EP: POST /users
DESC: Create a new user (Admin only).
IN: headers:{Authorization:str!}, body:{name:str!, email:str!, password:str!, role:str!}
OUT: 201:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid input or email already exists", "401":"Unauthorized", "403":"Forbidden", "500":"Internal server error"}
EX_REQ: curl -X POST /users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123","role":"USER"}'
EX_RES_201: {"id":2,"email":"jane@example.com","name":"Jane Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-11-11T10:35:00Z","updatedAt":"2025-11-11T10:35:00Z"}

---

EP: GET /users
DESC: Get paginated list of users with optional filters.
IN: headers:{Authorization:str!}, query:{name:str, role:str, sortBy:str, limit:int, page:int}
OUT: 200:{results:arr[obj{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "403":"Forbidden", "500":"Internal server error"}
EX_REQ: curl -X GET "/users?page=1&limit=10&role=USER" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"results":[{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-11-11T10:30:00Z","updatedAt":"2025-11-11T10:30:00Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

EP: GET /users/{userId}
DESC: Get specific user by ID.
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X GET /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-11-11T10:30:00Z","updatedAt":"2025-11-11T10:30:00Z"}

---

EP: PATCH /users/{userId}
DESC: Update user information.
IN: headers:{Authorization:str!}, params:{userId:int!}, body:{name:str, email:str, password:str}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Invalid input or email already exists", "401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X PATCH /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"John Smith"}'
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Smith","role":"USER","isEmailVerified":false,"createdAt":"2025-11-11T10:30:00Z","updatedAt":"2025-11-11T10:35:00Z"}

---

EP: DELETE /users/{userId}
DESC: Delete user account.
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{}
ERR: {"401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {}

## MCP (Model Context Protocol) Endpoints

---

EP: POST /mcp
DESC: Execute MCP tool or function call.
IN: headers:{Authorization:str!}, body:{tool:str!, inputs:obj}
OUT: 200:{result:obj}
ERR: {"400":"Invalid tool or inputs", "401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /mcp -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"tool":"user_tool","inputs":{"userId":"1"}}'
EX_RES_200: {"result":{"success":true,"data":"Tool executed successfully"}}

---

EP: GET /mcp
DESC: Get available MCP tools and their schemas.
IN: headers:{Authorization:str!}
OUT: 200:{tools:arr[obj{id:str, name:str, description:str, inputSchema:obj, outputSchema:obj}]}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X GET /mcp -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"tools":[{"id":"user_tool","name":"User Tool","description":"Tool for user operations","inputSchema":{"type":"object","properties":{"userId":{"type":"string"}}},"outputSchema":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"string"}}}}]}

---

EP: DELETE /mcp
DESC: Reset or clear MCP tool state.
IN: headers:{Authorization:str!}
OUT: 200:{success:bool}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X DELETE /mcp -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"success":true}