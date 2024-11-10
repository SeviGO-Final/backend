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
  },
};

export default complaintPaths;