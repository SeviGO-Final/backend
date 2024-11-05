import swaggerJsDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";
import fs from "fs";
import path from "path";

const swaggerDefinition: OAS3Definition = {
    openapi: "3.0.3",
    info: {
        title: "SeviGo API Documentation",
        description: "Description here!",
        version: "1.0.0"
    },
    servers: [
        {
            url: "http://localhost:3000/api"
        }
    ],
    paths: {
        "/users/register": {
            post: {
                tags: ["User Endpoints"],
                summary: "Create a new user",
                description: "This endpoint is used for register a new user",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["nik", "name", "email", "password"],
                                properties: {
                                    nik: {
                                        type: "string",
                                        example: "3327123443215678"
                                    },
                                    name: {
                                        type: "string",
                                        example: "Tony Stark"
                                    },
                                    email: {
                                        type: "string",
                                        example: "stark@test.com"
                                    },
                                    password: {
                                        type: "string",
                                        example: "secret"
                                    }
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
                                        code: {
                                            type: "number",
                                            example: 201
                                        },
                                        status: {
                                            type: "string",
                                            example: "Created"
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "number",
                                                    example: 283
                                                },
                                                nik: {
                                                    type: "string",
                                                    example: "3327123443215678"
                                                },
                                                name: {
                                                    type: "string",
                                                    example: "Tony Stark"
                                                },
                                                email: {
                                                    type: "string",
                                                    example: "stark@email.com"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "422": {
                        description: "Error response - Unprocessable Entity",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/422ResponseError"
                                }
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
                description: "The user has been successfully authenticated, and an access token is returned.",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                required: ["email", "password"],
                                properties: {
                                    email: {
                                        type: "string",
                                        example: "stark@test.com"
                                    },
                                    password: {
                                        type: "string",
                                        example: "secret"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Success response",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        code: {
                                            type: "number",
                                            example: 200
                                        },
                                        status: {
                                            type: "string",
                                            example: "OK"
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "number",
                                                    example: 283
                                                },
                                                nik: {
                                                    type: "string",
                                                    example: "3327123443215678"
                                                },
                                                name: {
                                                    type: "string",
                                                    example: "Tony Stark"
                                                },
                                                email: {
                                                    type: "string",
                                                    example: "stark@email.com"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "422": {
                        description: "Error response - Unprocessable Entity",
                        content: {
                            "application/json": {
                                schema: {
                                    "$ref": "#/components/schemas/422ResponseError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/users/verify/{id}": {

        }
    },
    components: {
        schemas: {
            "422ResponseError": {
                type: "object",
                properties: {
                    code: {
                        type: "number",
                        example: 422
                    },
                    status: {
                        type: "string",
                        example: "Unprocessable Entity"
                    },
                    errors: {
                        type: "string",
                        example: "Password does not meet the required criteria."
                    }
                }
            }
        }
    }
};

const options: OAS3Options = {
    swaggerDefinition,
    apis: []
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
