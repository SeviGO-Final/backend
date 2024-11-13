import swaggerJsDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";
import userPaths from "./user-paths";
import categoryPaths from './category-paths'
import complaintPaths from './complaint-paths'
import adminFeedbackPaths from './adminFeedback-paths'
const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.3",
  info: {
    title: "SeviGo API Documentation",
    description: "Description here!",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:3000/api" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      "422ResponseError": {
        type: "object",
        properties: {
          code: { type: "number", example: 422 },
          status: { type: "string", example: "Unprocessable Entity" },
          errors: { type: "string", example: "Password does not meet the required criteria." },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "64b5c9c13c2a2f1e04c3c54a" },
          nik: { type: "string", example: "3327123443215678" },
          name: { type: "string", example: "Tony Stark" },
          email: { type: "string", example: "stark@test.com" },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ]
  },
  paths: {
    ...userPaths,
    ...categoryPaths,
    ...complaintPaths,
    ...adminFeedbackPaths,
  },
};

const options: OAS3Options = {
  swaggerDefinition,
  apis: ["./routes/*.ts"],
};

export default swaggerJsDoc(options);
