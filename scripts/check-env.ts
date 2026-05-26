import path from "node:path";

import { loadEnvConfig } from "@next/env";

import { readEnv, readPublicEnv } from "../src/core/infrastructure/config/env";

function main(): void {
  const projectRoot = path.resolve(process.cwd());

  // Load .env, .env.local and related files the same way Next.js does.
  loadEnvConfig(projectRoot);

  readEnv();
  readPublicEnv();

  console.log("Environment configuration is valid.");
}

main();
