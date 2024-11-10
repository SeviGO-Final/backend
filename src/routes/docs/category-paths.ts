const categoryPaths = {
  "/categories": {
    post: {
      tags: ["Category Endpoints"],
      summary: "Create a new category",
      description:
        "This endpoint is used to create a new category in the system.",
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
                  code: {
                    type: "number",
                    example: 201,
                  },
                  status: {
                    type: "string",
                    example: "Created",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "60d0fe4f5311236168a109ca",
                      },
                      name: {
                        type: "string",
                        example: "Electronics",
                      },
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
                  code: {
                    type: "number",
                    example: 400,
                  },
                  status: {
                    type: "string",
                    example: "Bad Request",
                  },
                  errors: {
                    type: "string",
                    example: "Name is required.",
                  },
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
