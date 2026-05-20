import { cleanupContainer } from "@/core/infrastructure/di/container";

let isShuttingDown = false;

async function handleShutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`Received signal ${signal}. Cleaning up resources...`);

  try {
    await cleanupContainer();
    console.log("Resources cleaned up successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
}

export function registerShutdownHandlers(): void {
  // Handle graceful shutdown on SIGTERM and SIGINT
  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));

  // Handle uncaught exceptions
  process.on("uncaughtException", async (error) => {
    console.error("Uncaught Exception:", error);
    await handleShutdown("uncaughtException");
  });
}
