const userPaths = {
  "/users/register": {
    post: {
      tags: ["User Endpoints"],
      summary: "Create a new user",
      description: "This endpoint registers a new user.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["nik", "name", "email", "password"],
              properties: {
                nik: { type: "string", example: "3327123443215678" },
                name: { type: "string", example: "Tony Stark" },
                email: { type: "string", example: "stark@test.com" },
                password: { type: "string", example: "secret" },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Success response - Created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
                  status: { type: "string", example: "Created" },
                  data: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
        "409": {
          description: "Conflict - User already exists",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
      },
    },
  },
  "/users/login": {
    post: {
      tags: ["User Endpoints"],
      summary: "Login user",
      description: "Authenticate the user and return an access token.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "stark@test.com" },
                password: { type: "string", example: "secret" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Successful login",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  data: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized - Invalid credentials",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
      },
    },
  },
  "/users/verify/{id}": {
    patch: {
      tags: ["User Endpoints"],
      summary: "Verify a user account",
      description: "Admin-only endpoint to verify user accounts.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID of the user to verify",
        },
      ],
      responses: {
        "200": {
          description: "User verified successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  data: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
        "404": {
          description: "User not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
      },
    },
  },
  "/users/profile": {
    get: {
      tags: ["User Endpoints"],
      summary: "Get user profile",
      description:
        "This endpoint retrieves the profile information of the authenticated user.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        "200": {
          description: "Success response - User found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: {
                    type: "number",
                    example: 200,
                  },
                  status: {
                    type: "string",
                    example: "OK",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "64b5c9c13c2a2f1e04c3c54a",
                      },
                      nik: {
                        type: "string",
                        example: "3327123443215678",
                      },
                      name: {
                        type: "string",
                        example: "Tony Stark",
                      },
                      email: {
                        type: "string",
                        example: "stark@test.com",
                      },
                      avatar: {
                        type: "string",
                        example:
                          "uploads/avatars/64b5c9c13c2a2f1e04c3c54a-avatar.jpg",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "404": {
          description: "Error response - User not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/422ResponseError",
              },
            },
          },
        },
        "401": {
          description: "Unauthorized - Missing or invalid authentication",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/422ResponseError",
              },
            },
          },
        },
      },
    },
    put: {
      tags: ["User Endpoints"],
      summary: "Update user profile",
      description:
        "This endpoint is used for updating user profile information, including avatar upload.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email"], // Adjust this if there are other required fields
              properties: {
                name: {
                  type: "string",
                  example: "Tony Stark",
                },
                email: {
                  type: "string",
                  example: "stark@test.com",
                },
                address: {
                  type: "string",
                  example: "New York, USA",
                },
                old_password: {
                  type: "string",
                  example: "oldPassword123",
                  description:
                    "Old password for validation when updating password",
                },
                new_password: {
                  type: "string",
                  example: "newPassword123",
                  description: "New password",
                },
                confirm_password: {
                  type: "string",
                  example: "newPassword123",
                  description: "Confirm the new password",
                },
              },
            },
          },
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                avatar: {
                  type: "string",
                  format: "binary",
                  description: "Upload a new avatar image (optional)",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "User profile successfully updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: {
                    type: "number",
                    example: 200,
                  },
                  status: {
                    type: "string",
                    example: "OK",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "64b5c9c13c2a2f1e04c3c54a",
                      },
                      nik: {
                        type: "string",
                        example: "3327123443215678",
                      },
                      name: {
                        type: "string",
                        example: "Tony Stark",
                      },
                      email: {
                        type: "string",
                        example: "stark@test.com",
                      },
                      avatar: {
                        type: "string",
                        example: "uploads/avatars/1646234241-avatar.jpg",
                      },
                      address: {
                        type: "string",
                        example: "New York, USA",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "400": {
          description:
            "Bad Request - Invalid input data or file size exceeds limit",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/422ResponseError",
              },
            },
          },
        },
        "401": {
          description:
            "Unauthorized - Incorrect old password (if updating password)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/422ResponseError",
              },
            },
          },
        },
        "404": {
          description: "User not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/422ResponseError",
              },
            },
          },
        },
        "409": {
          description: "Conflict - Email already in use",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/422ResponseError",
              },
            },
          },
        },
      },
    },
  },
  "/users/complaints": {
    get: {
      tags: ["User Endpoints"],
      summary: "Get user complaints",
      description:
        "This endpoint retrieves all complaints associated with the authenticated user.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        "200": {
          description: "Success response - Complaints found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: {
                    type: "number",
                    example: 200,
                  },
                  status: {
                    type: "string",
                    example: "OK",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "64b5c9c13c2a2f1e04c3c54a",
                      },
                      nik: {
                        type: "string",
                        example: "3327123443215678",
                      },
                      name: {
                        type: "string",
                        example: "Tony Stark",
                      },
                      email: {
                        type: "string",
                        example: "stark@test.com",
                      },
                      complaints: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            complaint_id: {
                              type: "string",
                              example: "64d5c9c13c2a2f1e04c3c55b",
                            },
                            title: {
                              type: "string",
                              example: "Service Issue",
                            },
                            description: {
                              type: "string",
                              example:
                                "The service was delayed for more than an hour.",
                            },
                            status: {
                              type: "string",
                              example: "Pending",
                            },
                            created_at: {
                              type: "string",
                              format: "date-time",
                              example: "2024-11-05T10:00:00Z",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "404": {
          description: "Error response - User not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/422ResponseError",
              },
            },
          },
        },
        "401": {
          description: "Unauthorized - Missing or invalid authentication",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/422ResponseError",
              },
            },
          },
        },
      },
    },
  },
};

export default userPaths;
