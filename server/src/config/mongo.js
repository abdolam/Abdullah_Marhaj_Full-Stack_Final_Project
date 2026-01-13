import { appConfig } from "./env.js";

export function resolveMongoUri() {
  const target = String(process.env.APP_DB || "").toLowerCase();

  if (!appConfig.mongoUri) {
    throw new Error(
      `MongoDB URI is missing for target: ${target || "undefined"}`
    );
  }

  console.log(`Using MongoDB connection: ${target} (${appConfig.mongoUri})`);
  return appConfig.mongoUri;
}
