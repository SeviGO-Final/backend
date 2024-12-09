import { StatisticsService } from "../src/services/statistics-service";
import { Category } from "../src/models/Category";
import { Complaint } from "../src/models/Complaint";
import User from "../src/models/User";
import { AdminFeedback } from "../src/models/AdminFeedback";

jest.mock("../src/models/Category");
jest.mock("../src/models/Complaint");
jest.mock("../src/models/User");
jest.mock("../src/models/AdminFeedback");

describe("Statistics Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return total number of complaints", async () => {
    const mockComplaintsCount = 5;
    (Complaint.countDocuments as jest.Mock).mockResolvedValue(mockComplaintsCount);

    const result = await StatisticsService.totalComplaints();

    expect(result).toEqual({ total: 5 });
    expect(Complaint.countDocuments).toHaveBeenCalledTimes(1);
  });

  it("should return total number of users", async () => {
    const mockUsersCount = 10;
    (User.countDocuments as jest.Mock).mockResolvedValue(mockUsersCount);

    const result = await StatisticsService.totalUsers();

    expect(result).toEqual({ total: 10 });
    expect(User.countDocuments).toHaveBeenCalledTimes(1);
  });

  it("should return total number of feedbacks", async () => {
    const mockFeedbackCount = 3;
    (AdminFeedback.countDocuments as jest.Mock).mockResolvedValue(mockFeedbackCount);

    const result = await StatisticsService.totalFeedback();

    expect(result).toEqual({ total: 3 });
    expect(AdminFeedback.countDocuments).toHaveBeenCalledTimes(1);
  });

  it("should return total number of complaints Finished", async () => {
    const mockComplaintsFinishedCount = 2;
    (Complaint.countDocuments as jest.Mock).mockResolvedValue(mockComplaintsFinishedCount);

    const result = await StatisticsService.totalComplaintHasFinished();

    expect(result).toEqual({ total: 2 });
    expect(Complaint.countDocuments).toHaveBeenCalledTimes(1);
  });

  it("should return total number of complaints Rejected", async () => {
    const mockComplaintsRejectedCount = 1;
    (Complaint.countDocuments as jest.Mock).mockResolvedValue(mockComplaintsRejectedCount);

    const result = await StatisticsService.totalComplaintHasRejected();

    expect(result).toEqual({ total: 1 });
    expect(Complaint.countDocuments).toHaveBeenCalledTimes(1);
  });

  it("should return total number of complaints in Processing", async () => {
    const mockComplaintsProcessingCount = 2;
    (Complaint.countDocuments as jest.Mock).mockResolvedValue(mockComplaintsProcessingCount);

    const result = await StatisticsService.totalComplaintInProcessing();

    expect(result).toEqual({ total: 2 });
    expect(Complaint.countDocuments).toHaveBeenCalledTimes(1);
  });
});