import { User } from "../models/user.model.js";

export async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase() }).exec();
}
