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
                                password: { type: "string", example: "secret" }
                            }
                        }
                    }
                }
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
                                    data: { "$ref": "#/components/schemas/User" } 
                                }
                            }
                        }
                    }
                },
                "409": {
                    description: "Conflict - User already exists",
                    content: {
                        "application/json": {
                            schema: { "$ref": "#/components/schemas/422ResponseError" }
                        }
                    }
                }
            }
        }
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
                                password: { type: "string", example: "secret" }
                            }
                        }
                    }
                }
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
                                    data: { "$ref": "#/components/schemas/User" }
                                }
                            }
                        }
                    }
                },
                "401": {
                    description: "Unauthorized - Invalid credentials",
                    content: {
                        "application/json": {
                            schema: { "$ref": "#/components/schemas/422ResponseError" }
                        }
                    }
                }
            }
        }
    },
    "/users/verify/{id}": {
        patch: {
            tags: ["User Endpoints"],
            summary: "Verify a user account",
            description: "Admin-only endpoint to verify user accounts.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "ID of the user to verify"
                }
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
                                    data: { "$ref": "#/components/schemas/User" }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "User not found",
                    content: {
                        "application/json": {
                            schema: { "$ref": "#/components/schemas/422ResponseError" }
                        }
                    }
                }
            }
        }
    }
};

export default userPaths;
