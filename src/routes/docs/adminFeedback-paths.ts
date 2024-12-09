const adminFeedbackPaths = {
  "/admin-feedback/{complaintId}": {
    post: {
      tags: ["Admin Feedback"],
      summary: "Create admin feedback for a specific complaint",
      description:
        "This endpoint allows an admin to provide feedback for a specific complaint, including an attachment (e.g., image or document).",
      security: [
        {
          bearerAuth: [],
        },
      ],
      operationId: "createAdminFeedback",
      parameters: [
        {
          name: "complaintId",
          in: "path",
          required: true,
          description:
            "The ID of the complaint for which feedback is being provided.",
          schema: {
            type: "string",
            example: "60d9f87c776f5f5b45c3c8f1", // example of complaintId
          },
        },
      ],
      requestBody: {
        description:
          "Admin feedback details, including title, description, and attachment.",
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", example: "Laporan anda di terima" },
                description: {
                  type: "string",
                  example: "Laporan anda di terima tunggu proses lanjut",
                },
                date: { type: "string", example: "01/12/2022, 00.00.00" },
                attachment: {
                  type: "string",
                  format: "binary",
                  description: "File attachment (image, pdf, etc.)",
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Admin feedback successfully created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
                  status: { type: "string", example: "Created" },
                  message: {
                    type: "string",
                    example: "Admin feedback successfully created",
                  },
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "6733f25e6ecb37d0064c34e9",
                      },
                      title: {
                        type: "string",
                        example: "Laporan anda di terima",
                      },
                      description: {
                        type: "string",
                        example: "Laporan anda di terima tunggu proses lanjut",
                      },
                      date: { type: "string", example: "01/12/2022, 00.00.00" },
                      attachment: {
                        type: "string",
                        example:
                          "/uploads/feedback/1731457630450-laser-fiber.png",
                      },
                      complaint: {
                        type: "string",
                        example: "6733f02e6ecb37d0064c34e0",
                      },
                      created_at: {
                        type: "string",
                        example: "13/11/2024, 07.27.10",
                      },
                      updated_at: {
                        type: "string",
                        example: "13/11/2024, 07.27.10",
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
            "Bad Request - File size exceeds the 2MB limit or missing attachment",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 400 },
                  status: { type: "string", example: "Bad Request" },
                  errors: {
                    type: "string",
                    example: "Attachment of feedback is required",
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized - Only admins can create feedback",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
        "404": {
          description: "Not Found - Complaint does not exist",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 404 },
                  status: { type: "string", example: "Not Found" },
                  errors: { type: "string", example: "Complaint not found" },
                },
              },
            },
          },
        },
      },
    },    
  },
  "/admin-feedback/{id}": {
    get: {
      tags: ["Admin Feedback"],
      summary: "Get detail of admin feedback",
      description:
        "This endpoint allows to get admin feedback detail.",      
      operationId: "GetAdminFeedback",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description:
            "The ID of the admin feedback is being provided.",
          schema: {
            type: "string",
            example: "60d9f87c776f5f5b45c3c8f1", // example of feedbackId
          },
        },
      ],
      responses: {
        "200": {
          description: "Success get detail of admin feedback",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  message: {
                    type: "string",
                    example: "Detail of admin feedback",
                  },
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "6733f25e6ecb37d0064c34e9",
                      },
                      title: {
                        type: "string",
                        example: "Laporan anda di terima",
                      },
                      description: {
                        type: "string",
                        example: "Laporan anda di terima tunggu proses lanjut",
                      },
                      date: { type: "string", example: "01/12/2022, 00.00.00" },
                      attachment: {
                        type: "string",
                        example:
                          "/uploads/feedback/1731457630450-laser-fiber.png",
                      },
                      complaint: {
                        type: "string",
                        example: "6733f02e6ecb37d0064c34e0",
                      },
                      created_at: {
                        type: "string",
                        example: "13/11/2024, 07.27.10",
                      },
                      updated_at: {
                        type: "string",
                        example: "13/11/2024, 07.27.10",
                      },
                    },
                  },
                },
              },
            },
          },
        },        
        "404": {
          description: "Not Found - Admin feedback does not exist",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 404 },
                  status: { type: "string", example: "Not Found" },
                  errors: { type: "string", example: "Admin feedback not found" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/admin-feedback/{complaintId}/process": {
    post: {
      tags: ["Admin Feedback"],
      summary: "Process a complaint by admin",
      description:
        "This endpoint allows an admin to change the status of a complaint to 'Processing'.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      operationId: "processComplaint",
      parameters: [
        {
          name: "complaintId",
          in: "path",
          required: true,
          description: "The ID of the complaint that is being processed.",
          schema: {
            type: "string",
            example: "60d9f87c776f5f5b45c3c8f1", // Example of a complaintId
          },
        },
      ],
      responses: {
        "200": {
          description: "Complaint status successfully updated to 'Processing'",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  message: {
                    type: "string",
                    example: "Complaint is in process",
                  },
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "6733f43bb33e412393b0a688",
                      },
                      title: { type: "string", example: "Test complaints" },
                      content: { type: "string", example: "complaint saya" },
                      date_event: {
                        type: "string",
                        example: "01/12/2022, 00.00.00",
                      },
                      location: { type: "string", example: "smi" },
                      evidence: {
                        type: "string",
                        example:
                          "uploads/complaints/1731458107118-laser-fiber.png",
                      },
                      current_status: { type: "string", example: "Processing" },
                      is_deleted: { type: "boolean", example: false },
                      created_at: {
                        type: "string",
                        example: "13/11/2024, 07.35.07",
                      },
                      updated_at: {
                        type: "string",
                        example: "13/11/2024, 07.37.25",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized - Only admins can process complaints",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
        "404": {
          description: "Not Found - Complaint not found or already processed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 404 },
                  status: { type: "string", example: "Not Found" },
                  errors: {
                    type: "string",
                    example: "Complaint not found or already processed",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/admin-feedback/{complaintId}/reject": {
    post: {
      tags: ["Admin Feedback"],
      summary: "Reject a complaint by admin",
      description: "This endpoint allows an admin to reject a complaint and update the status to 'Rejected' with a rejection feedback.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      operationId: "rejectComplaint",
      parameters: [
        {
          name: "complaintId",
          in: "path",
          required: true,
          description: "The ID of the complaint that is being Rejected.",
          schema: {
            type: "string",
            example: "60d9f87c776f5f5b45c3c8f1", // Example of a complaintId
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", example: "Laporan komplain anda di tolak" },
                description: { type: "string", example: "Laporan komplain anda di tolak - description" },
                date: { type: "string", example: "12/01/2022" },
              },
              required: ["title", "description", "date"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Complaint successfully Rejected",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  status: { type: "string", example: "OK" },
                  message: { type: "string", example: "Complaint is Rejected" },
                  data: {
                    type: "object",
                    properties: {
                      _id: { type: "string", example: "6733f9fd472473dd934dde06" },
                      title: { type: "string", example: "Laporan komplain anda di tolak" },
                      description: { type: "string", example: "Laporan komplain anda di tolak - description" },
                      date: { type: "string", example: "01/12/2022, 00.00.00" },
                      complaint: { type: "string", example: "6733f43bb33e412393b0a688" },
                      created_at: { type: "string", example: "13/11/2024, 07.59.41" },
                      updated_at: { type: "string", example: "13/11/2024, 07.59.41" },
                    },
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Bad Request - Invalid or missing body fields",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
        "401": {
          description: "Unauthorized - Only admins can reject complaints",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/422ResponseError" },
            },
          },
        },
        "404": {
          description: "Not Found - Complaint not found or already Rejected",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 404 },
                  status: { type: "string", example: "Not Found" },
                  errors: { type: "string", example: "Complaint not found or already Rejected" },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default adminFeedbackPaths;
