import { toCategoryResponses } from "../formatters/statistics-formatter";
import { AdminFeedback } from "../models/AdminFeedback";
import { Category } from "../models/Category";
import { Complaint } from "../models/Complaint";
import User from "../models/User";
import { CustomErrors } from "../types/custom-errors";

export class StatisticsService {
  static async categoryPercentages() {
    try {
      const categoriesName = await Category.find({}).select(["_id", "name"]);
      const categoryResponses = toCategoryResponses(categoriesName);

      // 1. Total jumlah semua complaint
      const totalComplaints = await Complaint.countDocuments();

      // 2. Hitung jumlah complaint per category
      const countComplaintsPerCategory = await Complaint.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
      ]);

      // 3. Hitung persentase setiap category
      const categoryPercentages = countComplaintsPerCategory.map(
        (category) => ({
          _id: category._id,
          name:
            categoryResponses.find(
              (categoryResponse) =>
                categoryResponse._id === category._id.toString()
            )?.name || "Unknown",
          has_complaints: category.count,
          percentage: ((category.count / totalComplaints) * 100)
            .toFixed(1)
            .concat("%"),
        })
      );

      return {
        totalComplaints,
        categoryPercentages,
      };
    } catch (err) {
      throw new CustomErrors(
        500,
        "Internal Server Error",
        "An error ocurred while count complaint percentages per category"
      );
    }
  }

  static async totalUsers() {
    return {
      total: await User.countDocuments(),
    };
  }

  static async totalComplaints() {
    return {
      total: await Complaint.countDocuments(),
    };
  }

  static async totalComplaintHasFinished() {
    return {
      total: await Complaint.countDocuments({ current_status: "Finished" }),
    };
  }

  static async totalComplaintHasRejected() {
    return {
      total: await Complaint.countDocuments({ current_status: "Rejected" }),
    };
  }

  static async totalComplaintInProcessing() {
    return {
      total: await Complaint.countDocuments({ current_status: "Processing" }),
    };
  }

  static async totalFeedback() {
    return {
      total: await AdminFeedback.countDocuments(),
    };
  }
}
