const categoryPaths = {
  "/categories": {
    post: {
      tags: ["Category Endpoints"],
      summary: "Create a new category",
      description:
        "This endpoint is used to create a new category in the system. Only accessible by authenticated admin users.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: {
                  type: "string",
                  example: "Infrastruktur",
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Category created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
                  status: { type: "string", example: "Created" },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "60d0fe4f5311236168a109ca",
                      },
                      name: { type: "string", example: "Infrastruktur" },
                    },
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Bad request - invalid input",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 400 },
                  status: { type: "string", example: "Bad Request" },
                  errors: { type: "string", example: "Name is required." },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized - Admin only",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 401 },
                  status: { type: "string", example: "Unauthorized" },
                  errors: { type: "string", example: "Only admin can create categories." },
                },
              },
            },
          },
        },
      },
    },
    get: {
      tags: ["Category Endpoints"],
      summary: "Get all categories",
      description:
        "This endpoint retrieves all categories available in the system. Only accessible by authenticated admin users.",
      responses: {
        "200": {
          description: "Successfully retrieved the list of categories",
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
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          example: "60d0fe4f5311236168a109ca",
                        },
                        name: {
                          type: "string",
                          example: "Infrastruktur",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized - User does not have permission to view categories",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 401 },
                  status: { type: "string", example: "Unauthorized" },
                  errors: { type: "string", example: "User is not authorized to access categories" },
                },
              },
            },
          },
        },
        "500": {
          description: "Internal Server Error - Unable to retrieve categories",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 500 },
                  status: { type: "string", example: "Internal Server Error" },
                  errors: { type: "string", example: "An error occurred while fetching categories" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/categories/{id}": {
    get: {
      tags: ["Category Endpoints"],
      summary: "Get a category by ID",
      description: "This endpoint retrieves a category by its ID.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "The ID of the category to retrieve",
          schema: {
            type: "string",
            example: "60d0fe4f5311236168a109ca",
          },
        },
      ],
      responses: {
        "200": {
          description: "Category found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "60d0fe4f5311236168a109ca",
                      },
                      name: { type: "string", example: "Infrastruktur" },
                    },
                  },
                },
              },
            },
          },
        },
        "404": {
          description: "Category not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 404 },
                  status: { type: "string", example: "Not Found" },
                  errors: { type: "string", example: "Category not found" },
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: ["Category Endpoints"],
      summary: "Update a category by ID",
      description: "This endpoint updates an existing category by its ID.",
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
          description: "The ID of the category to update",
          schema: {
            type: "string",
            example: "60d0fe4f5311236168a109ca",
          },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Updated Infrastruktur" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Category updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "60d0fe4f5311236168a109ca",
                      },
                      name: { type: "string", example: "Updated Infrastruktur" },
                    },
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid input",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 400 },
                  status: { type: "string", example: "Bad Request" },
                  errors: { type: "string", example: "Name is required." },
                },
              },
            },
          },
        },
        "404": {
          description: "Category not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 404 },
                  status: { type: "string", example: "Not Found" },
                  errors: { type: "string", example: "Category not found" },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Category Endpoints"],
      summary: "Delete a category by ID",
      description: "This endpoint deletes a category by its ID.",
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
          description: "The ID of the category to delete",
          schema: {
            type: "string",
            example: "60d0fe4f5311236168a109ca",
          },
        },
      ],
      responses: {
        "200": {
          description: "Category deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  message: {
                    type: "string",
                    example: "Category deleted successfully",
                  },
                },
              },
            },
          },
        },
        "404": {
          description: "Category not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 404 },
                  status: { type: "string", example: "Not Found" },
                  errors: { type: "string", example: "Category not found" },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default categoryPaths;
