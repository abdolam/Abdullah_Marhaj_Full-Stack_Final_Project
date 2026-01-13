import { User } from "../models/user.model.js";

export async function getUserSummaries() {
  try {
    const [total, blocked, user, admins] = await Promise.all([
      User.estimatedDocumentCount().exec(),
      User.countDocuments({ "status.blocked": true }).exec(),
      User.countDocuments({ isAdmin: false }).exec(),
      User.countDocuments({ isAdmin: true }).exec(),
    ]);
    return { total, blocked, user, admins };
  } catch (error) {
    console.error("Error counting users:", error);
    throw error;
  }
}
