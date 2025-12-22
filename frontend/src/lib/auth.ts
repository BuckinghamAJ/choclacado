import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.CHOCLACADO_DATABASE_URL!,
    max: 5,
    min: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60,
  }),

  emailAndPassword: {
    enabled: true,
  },
  advanced: { disableOriginCheck: true },

  trustedOrigins: [
    "http://localhost:3000",
    "http://frontend:3000", // Add this
    "http://api:7373",
    "https://*.choclacado.com",
    "https://choclacado.com",
  ],

  logger: {
    disabled: false,
    disableColors: false,
    level: "info",
    log: (level, message, ...args) => {
      // Custom logging implementation
      console.log(`[${level}] ${message}`, ...args);
    },
  },
  onAPIError: {
    onError: (error) => {
      console.error("better-auth error", error);
    },
  },

  plugins: [jwt()],
  baseURL: "http://localhost:3000",
});
