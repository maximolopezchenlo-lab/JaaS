/**
 * JaaS — Structured JSON Logger
 * RULE 3: All errors produce structured, parseable log output.
 * RULE 23: No stray console.logs in production — use this logger.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  [key: string]: unknown;
}

const SERVICE_NAME = "jaas-server";

function formatEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: SERVICE_NAME,
    ...meta,
  };
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>): void {
    const entry = formatEntry("info", message, meta);
    process.stdout.write(JSON.stringify(entry) + "\n");
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    const entry = formatEntry("warn", message, meta);
    process.stdout.write(JSON.stringify(entry) + "\n");
  },

  error(message: string, meta?: Record<string, unknown>): void {
    const entry = formatEntry("error", message, meta);
    process.stderr.write(JSON.stringify(entry) + "\n");
  },

  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== "production") {
      const entry = formatEntry("debug", message, meta);
      process.stdout.write(JSON.stringify(entry) + "\n");
    }
  },
};
