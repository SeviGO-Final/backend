import { AdminFeedbackService } from "../src/services/admin-feedback-service";

describe("AdminFeedbackService", () => {
  let mockRequest: any;
  let mockFile: any;
  let sessionData: any;
  let validObjectId: string;

  beforeEach(() => {
    validObjectId = "507f1f77bcf86cd799439011"; // Contoh ObjectId yang valid
    mockRequest = {
      title: "Test Title",
      description: "Test Description",
      date: "2024-12-04",
    };
    sessionData = { user: { id: validObjectId } };

    mockFile = {
      size: 1 * 1024 * 1024, // Ukuran file 1MB
      filename: "testfile.jpg",
    };
  });

  it("should successfully create admin feedback with file upload", async () => {
    const feedback = await AdminFeedbackService.create(mockFile, mockRequest, validObjectId, sessionData);
    expect(feedback).toHaveProperty("title", "Test Title");
    expect(feedback).toHaveProperty("fileUrl", "mockFileUrl");
  });

  it("should throw error when no file is uploaded", async () => {
    await expect(AdminFeedbackService.create(undefined, mockRequest, validObjectId, sessionData))
      .rejects
      .toThrowError(new Error(JSON.stringify({
        statusCode: 400,
        error: "Bad Request",
        message: "Attachment of feedback is required"
      })));
  });

  it("should throw error if file size exceeds limit", async () => {
    mockFile.size = 3 * 1024 * 1024; // 3MB, melebihi batas 2MB
    await expect(AdminFeedbackService.create(mockFile, mockRequest, validObjectId, sessionData))
      .rejects
      .toThrowError(new Error(JSON.stringify({
        statusCode: 400,
        error: "Bad Request",
        message: "File size exceeds 2MB limit"
      })));
  });

  it("should throw error for invalid ObjectId", async () => {
    const invalidObjectId = "invalidObjectId";
    await expect(AdminFeedbackService.create(mockFile, mockRequest, invalidObjectId, sessionData))
      .rejects
      .toThrowError(new Error(JSON.stringify({
        statusCode: 400,
        error: "Bad Request",
        message: "Invalid mongodb object ID format"
      })));
  });
});
