import { createMiddleware } from "@solidjs/start/middleware";
import { json } from "@solidjs/router";

const TRUSTED_ORIGINS = [
  "http://api:7373",
  "http://frontend:3000",
  "http://localhost:3000",
  "http://localhost:3000/",
  "http://localhost:7373",
];
