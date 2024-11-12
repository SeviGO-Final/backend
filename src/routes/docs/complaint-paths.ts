const complaintPaths = {
  "/complaints": {
    post: {
      tags: ["Complaint Endpoints"],
      summary: "Create a new complaint",
      description:
        "This endpoint allows a user to submit a new complaint along with an evidence file. The evidence file is required and must not exceed 2MB in size.",
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
              required: [
                "title",
                "content",
                "location",
                "description",
                "date_event",
                "evidence",
                "category",
              ],
              properties: {
                title: { type: "string", example: "Lampu Jalan" },
                content: {
                  type: "string",
                  example: "Lampu Jalan Rusak Sebagian",
                },
                location: { type: "string", example: "Jalan Raya no. 123" },
                description: {
                  type: "string",
                  example:
                    "Lampu jalan di depan rumah mengalami kerusakan dan tidak menyala pada malam hari.",
                },
                date_event: {
                  type: "string",
                  format: "date-time",
                  example: "2024-11-10T10:30:00Z",
                },
                category: { type: "string", example: "Infrastruktur" },
              },
            },
          },
          "multipart/form-data": {
            schema: {
              type: "object",
              required: [
                "title",
                "content",
                "location",
                "description",
                "date_event",
                "category",
                "evidence",
              ],
              properties: {
                title: { type: "string", example: "Lampu Jalan" },
                content: {
                  type: "string",
                  example: "Lampu Jalan Rusak Sebagian",
                },
                location: { type: "string", example: "Jalan Raya no. 123" },
                description: {
                  type: "string",
                  example:
                    "Lampu jalan di depan rumah mengalami kerusakan dan tidak menyala pada malam hari.",
                },
                date_event: {
                  type: "string",
                  format: "date-time",
                  example: "2024-11-10T10:30:00Z",
                },
                category: { type: "string", example: "Infrastruktur" },
                evidence: {
                  type: "string",
                  format: "binary",
                  description: "The evidence file for the complaint",
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Complaint successfully created",
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
                      title: { type: "string", example: "Lampu Jalan" },
                      content: {
                        type: "string",
                        example: "Lampu Jalan Rusak Sebagian",
                      },
                      location: {
                        type: "string",
                        example: "Jalan Raya no. 123",
                      },
                      description: {
                        type: "string",
                        example:
                          "Lampu jalan di depan rumah mengalami kerusakan dan tidak menyala pada malam hari.",
                      },
                      date_event: {
                        type: "string",
                        format: "date-time",
                        example: "2024-11-10T10:30:00Z",
                      },
                      category: { type: "string", example: "Infrastruktur" },
                      evidence: {
                        type: "string",
                        example:
                          "uploads/complaints/1634179472461-streetlight.jpg",
                      },
                      current_status: {
                        type: "string",
                        example: "Laporan diajukan",
                      },
                      user: {
                        type: "string",
                        example: "60d0fe4f5311236168a109c0",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Bad request - invalid input or missing file",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 400 },
                  status: { type: "string", example: "Bad Request" },
                  errors: {
                    type: "string",
                    example: "Evidence of complaint is required",
                  },
                },
              },
            },
          },
        },
        "409": {
          description: "Conflict - Duplicate complaint",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 409 },
                  status: { type: "string", example: "Conflict" },
                  errors: {
                    type: "string",
                    example: "Your same complaint has been created before",
                  },
                },
              },
            },
          },
        },
        "500": {
          description:
            "Internal Server Error - File handling or database error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 500 },
                  status: { type: "string", example: "Internal Server Error" },
                  errors: {
                    type: "string",
                    example: "Failed to handle file evidence",
                  },
                },
              },
            },
          },
        },
      },
    },
    get: {
      tags: ["Complaint Endpoints"],
      summary: "Get all complaints",
      description: "Retrieve a list of complaints with pagination support.",
      parameters: [
        {
          name: "page",
          in: "query",
          schema: {
            type: "integer",
            example: 1,
          },
          description: "The page number to retrieve (defaults to 1).",
        },
        {
          name: "limit",
          in: "query",
          schema: {
            type: "integer",
            example: 10,
          },
          description: "The number of complaints per page (defaults to 10).",
        },
      ],
      responses: {
        "200": {
          description: "Complaints retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  message: { type: "string", example: "Complaints retrieved" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                          example: "672d76e062a1ecf394ee4fd7",
                        },
                        title: { type: "string", example: "Lampu Jalan" },
                        content: {
                          type: "string",
                          example: "Lampu Jalan Rusak",
                        },
                        date_event: {
                          type: "string",
                          example: "2024-11-10, 17.30.00",
                        },
                        location: {
                          type: "string",
                          example: "Jalan Raya no. 123",
                        },
                        evidence: {
                          type: "string",
                          example: "/uploads/1731057166885-icons8-user-100.png",
                        },
                        current_status: {
                          type: "string",
                          example: "Laporan diajukan",
                        },
                        is_deleted: { type: "boolean", example: false },
                        created_at: {
                          type: "string",
                          example: "2024-11-08, 09.26.40",
                        },
                        updated_at: {
                          type: "string",
                          example: "2024-11-08, 16.12.46",
                        },
                      },
                    },
                  },
                  meta: {
                    type: "object",
                    properties: {
                      total: { type: "integer", example: 8 },
                      page: { type: "integer", example: 1 },
                      entries: { type: "integer", example: 10 },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
      },
    },
  },

  "/complaints/{id}": {
    get: {
      tags: ["Complaint Endpoints"],
      summary: "Get complaint by ID",
      description:
        "Retrieve detailed information of a specific complaint by ID.",
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
          schema: {
            type: "string",
          },
          description: "ID of the complaint to retrieve",
        },
      ],
      responses: {
        "200": {
          description: "Complaint found",
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
                        example: "64d5c9c13c2a2f1e04c3c55b",
                      },
                      title: { type: "string", example: "Pelayanan Publik" },
                      content: { type: "string", example: "Pelayanan Publik" },
                      date_event: {
                        type: "string",
                        format: "date",
                        example: "2024-11-05",
                      },
                      description: {
                        type: "string",
                        example:
                          "The service was delayed for more than an hour.",
                      },
                      location: { type: "string", example: "RT 04" },
                      status: { type: "string", example: "Pending" },
                      updated_at: {
                        type: "string",
                        format: "date-time",
                        example: "2024-11-05T10:00:00Z",
                      },
                      created_at: {
                        type: "string",
                        format: "date-time",
                        example: "2024-11-05T10:00:00Z",
                      },
                      tracking_status: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            status: { type: "string", example: "In Progress" },
                            updated_at: {
                              type: "string",
                              format: "date-time",
                              example: "2024-11-06T14:30:00Z",
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
          description: "Error response - Complaint not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
        "401": {
          description: "Unauthorized - Missing or invalid authentication",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Complaint Endpoints"],
      summary: "Update a complaint",
      description:
        "Update a complaint by ID, including uploading an evidence file if provided.",
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
          schema: {
            type: "string",
          },
          description: "ID of the complaint to update",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", example: "testsasd" },
                content: { type: "string", example: "asd" },
                date_event: {
                  type: "string",
                  format: "date",
                  example: "2022-12-01T00:00:00Z",
                },
                location: { type: "string", example: "smi" },
                evidence: {
                  type: "string",
                  format: "binary",
                  description: "The file evidence to upload, max 2MB",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Complaint updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  message: { type: "string", example: "Complaint updated" },
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "67305b590059a18fe56a343b",
                      },
                      title: {
                        type: "string",
                        example: "test - update complaint",
                      },
                      content: {
                        type: "string",
                        example: "test - update complaint - content",
                      },
                      date_event: {
                        type: "string",
                        example: "01/12/2022, 00.00.00",
                      },
                      location: { type: "string", example: "smi" },
                      evidence: {
                        type: "string",
                        example:
                          "uploads/complaints/1731451598017-icons8-user-100.png",
                      },
                      current_status: {
                        type: "string",
                        example: "Laporan diajukan",
                      },
                      is_deleted: { type: "boolean", example: false },
                      created_at: {
                        type: "string",
                        example: "10/11/2024, 14.06.01",
                      },
                      updated_at: {
                        type: "string",
                        example: "13/11/2024, 05.46.38",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Complaint Endpoints"],
      summary: "Delete a complaint",
      description: "Delete a complaint by ID if the user is the owner.",
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
          schema: {
            type: "string",
          },
          description: "ID of the complaint to delete",
        },
      ],
      responses: {
        "200": {
          description: "Complaint deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  message: { type: "string", example: "Complaint deleted" },
                  data: {
                    type: "object",
                    properties: {
                      complaint_id: {
                        type: "string",
                        example: "67305b590059a18fe56a343b",
                      },
                      slug: {
                        type: "string",
                        example: "testsasd-67305b590059a18fe56a343b",
                      },
                      is_deleted: { type: "boolean", example: true },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
        "403": {
          description: "Forbidden - User is not the owner of the complaint",
          content: {
            type: "object",
            properties: {
              code: { type: "number", example: 403 },
              status: { type: "string", example: "Forbidden" },
              errors: {
                type: "string",
                example: "You are not the owner of this complaint.",
              },
            },
          },
        },
      },
    },
  },
  "/complaints/{id}/history": {
    delete: {
      tags: ["Complaint Endpoints (Histories)"],
      summary: "Delete one complaint's history",
      description:
        "Delete a specific history record for a complaint by ID if the user is the owner.",
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
          schema: {
            type: "string",
          },
          description: "ID of the complaint to delete the history from",
        },
      ],
      responses: {
        "200": {
          description: "Complaint's history deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  message: {
                    type: "string",
                    example: "Complaint's history deleted",
                  },
                  data: {
                    type: "object",
                    properties: {
                      complaint_id: {
                        type: "string",
                        example: "67305b590059a18fe56a343b",
                      },
                      deleted_from_history: {
                        type: "boolean",
                        example: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
        "403": {
          description: "Forbidden - User is not the owner of the complaint",
          content: {
            type: "object",
            properties: {
              code: { type: "number", example: 403 },
              status: { type: "string", example: "Forbidden" },
              errors: {
                type: "string",
                example: "You are not the owner of this complaint",
              },
            },
          },
        },
      },
    },
  },
  "/complaints/histories/all": {
    delete: {
      tags: ["Complaint Endpoints (Histories)"],
      summary: "Delete all complaint's histories",
      description:
        "Delete all histories for the authenticated user’s complaints.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        "200": {
          description: "All complaints' histories deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  message: {
                    type: "string",
                    example: "Complaint's histories deleted",
                  },
                  data: {
                    type: "object",
                    properties: {
                      histories_deleted: { type: "boolean", example: true },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
      },
    },
  },
};

export default complaintPaths;
