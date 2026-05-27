import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

const candidateEnvFiles = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "artifacts/api-server/.env"),
  path.resolve(moduleDir, "../.env"),
  path.resolve(moduleDir, "../../.env"),
];

function stripOptionalQuotes(value: string): string {
  const trimmed = value.trim();
  const quote = trimmed[0];

  if (
    (quote === "\"" || quote === "'") &&
    trimmed.endsWith(quote)
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

for (const envFile of new Set(candidateEnvFiles)) {
  if (!existsSync(envFile)) {
    continue;
  }

  const contents = readFileSync(envFile, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = stripOptionalQuotes(trimmed.slice(separatorIndex + 1));

    process.env[key] ??= value;
  }

  break;
}
