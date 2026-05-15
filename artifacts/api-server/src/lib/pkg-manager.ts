import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { createRequire } from "module";
import { logger } from "./logger";

const STORE_DIR = path.resolve(process.cwd(), "packages-store");
const PKG_JSON = path.join(STORE_DIR, "package.json");

export interface InstalledPackage {
  name: string;
  version: string;
}

function ensureStore() {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
  if (!existsSync(PKG_JSON)) {
    writeFileSync(PKG_JSON, JSON.stringify({ name: "packages-store", version: "1.0.0", dependencies: {} }, null, 2));
  }
}

function readStorePkg(): { dependencies: Record<string, string> } {
  ensureStore();
  try {
    return JSON.parse(readFileSync(PKG_JSON, "utf-8"));
  } catch {
    return { dependencies: {} };
  }
}

export function listPackages(): InstalledPackage[] {
  const pkg = readStorePkg();
  const deps = pkg.dependencies ?? {};
  const nodeModules = path.join(STORE_DIR, "node_modules");

  return Object.keys(deps).map((name) => {
    let version = deps[name].replace(/^\^|~/, "");
    try {
      const pkgPath = path.join(nodeModules, name, "package.json");
      if (existsSync(pkgPath)) {
        const p = JSON.parse(readFileSync(pkgPath, "utf-8"));
        version = p.version ?? version;
      }
    } catch { /* ignore */ }
    return { name, version };
  });
}

export function installPackage(name: string): InstalledPackage {
  // Validate package name to prevent injection
  if (!/^(@[a-z0-9_.-]+\/)?[a-z0-9_.-]+(@[a-z0-9_.*-]+)?$/i.test(name)) {
    throw new Error(`Invalid package name: ${name}`);
  }

  ensureStore();
  logger.info({ package: name }, "Installing npm package");

  try {
    execSync(`npm install --prefix "${STORE_DIR}" --save "${name}" --no-audit --no-fund --loglevel=error`, {
      timeout: 60_000,
      stdio: "pipe",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to install "${name}": ${msg.split("\n")[0]}`);
  }

  // Read the real version that was installed
  const baseName = name.split("@")[0] || name;
  let version = "unknown";
  try {
    const pkgPath = path.join(STORE_DIR, "node_modules", baseName, "package.json");
    if (existsSync(pkgPath)) {
      version = JSON.parse(readFileSync(pkgPath, "utf-8")).version ?? "unknown";
    }
  } catch { /* ignore */ }

  logger.info({ package: baseName, version }, "Package installed");
  return { name: baseName, version };
}

export function removePackage(name: string): void {
  ensureStore();
  logger.info({ package: name }, "Removing npm package");

  try {
    execSync(`npm uninstall --prefix "${STORE_DIR}" "${name}" --no-audit --no-fund --loglevel=error`, {
      timeout: 30_000,
      stdio: "pipe",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to remove "${name}": ${msg.split("\n")[0]}`);
  }
}

// Build a require function scoped to the packages store
export function buildSandboxRequire(): (id: string) => unknown {
  ensureStore();
  const storeRequire = createRequire(PKG_JSON);
  const installedNames = new Set(Object.keys(readStorePkg().dependencies ?? {}));

  return function sandboxRequire(id: string): unknown {
    // Only allow packages that have been explicitly installed
    const baseName = id.split("/")[0].replace(/^@/, "").split("/")[0];
    const fullBase = id.startsWith("@") ? id.split("/").slice(0, 2).join("/") : id.split("/")[0];

    if (!installedNames.has(fullBase)) {
      throw new Error(
        `Package "${id}" is not installed. Add it using the Packages panel first.`
      );
    }

    return storeRequire(id);
  };
}
