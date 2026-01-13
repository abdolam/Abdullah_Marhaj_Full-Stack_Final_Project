import bcrypt from "bcrypt";

import { User } from "../models/user.model.js";

export async function seedUsers() {
  try {
    const count = await User.estimatedDocumentCount().exec();
    if (count > 0) {
      console.log("[seed] users: already present → skipping");
      return;
    }

    console.log("[seed] Users collection empty — seeding defaults...");

    const SALT_ROUNDS = 10;
    const hash = (pwd) => bcrypt.hashSync(pwd, SALT_ROUNDS);

    const users = [
      {
        name: { first: "מנהל", last: "מערכת" },
        phone: "03-1234567",
        email: "admin@ecostore.io",
        password: hash("Demo1234$"),
        address: {
          city: "תל אביב",
          street: "הרצל",
          houseNumber: 1,
          zip: 61000,
        },
        isAdmin: true,
      },
      {
        name: { first: "משתמש", last: "ראשון" },
        phone: "04-7654321",
        email: "firstuser@ecostore.io",
        password: hash("Demo1234$"),
        address: {
          city: "חיפה",
          street: "בן גוריון",
          houseNumber: 5,
          zip: 33200,
        },
        isAdmin: false,
      },
      {
        name: { first: "משתמש", last: "שני" },
        phone: "02-5557777",
        email: "seconduser@ecostore.io",
        password: hash("Demo1234$"),
        address: {
          city: "ירושלים",
          street: "קינג ג'ורג'",
          houseNumber: 10,
          zip: 91000,
        },
        isAdmin: false,
      },
    ];

    await User.insertMany(users);
    console.log("Seeded 3 default users successfully");
  } catch (error) {
    console.error("Failed to seed users:", error);
  }
}
