import { registerShutdownHandlers } from "@/core/infrastructure/shutdown";

// Initialize shutdown handlers at application startup
if (typeof process !== "undefined" && process.env.NODE_ENV !== "test") {
  registerShutdownHandlers();
}
