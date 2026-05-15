import vm from "vm";
import { buildSandboxRequire } from "./pkg-manager";

export interface RunResult {
  output: string;
  error: string | null;
  executionTime: number;
}

const MAX_EXECUTION_MS = 5000;
const MAX_OUTPUT_LENGTH = 50000;

export function runJavaScript(code: string): RunResult {
  const outputLines: string[] = [];
  const start = Date.now();

  const consoleMock = {
    log: (...args: unknown[]) => {
      outputLines.push(args.map(formatArg).join(" "));
    },
    error: (...args: unknown[]) => {
      outputLines.push("[error] " + args.map(formatArg).join(" "));
    },
    warn: (...args: unknown[]) => {
      outputLines.push("[warn] " + args.map(formatArg).join(" "));
    },
    info: (...args: unknown[]) => {
      outputLines.push("[info] " + args.map(formatArg).join(" "));
    },
    table: (data: unknown) => {
      outputLines.push(formatArg(data));
    },
    dir: (data: unknown) => {
      outputLines.push(formatArg(data));
    },
    time: (_label?: string) => {},
    timeEnd: (_label?: string) => {},
    group: (...args: unknown[]) => {
      if (args.length) outputLines.push(args.map(formatArg).join(" "));
    },
    groupEnd: () => {},
    assert: (condition: unknown, ...args: unknown[]) => {
      if (!condition) {
        outputLines.push("Assertion failed: " + (args.length ? args.map(formatArg).join(" ") : "(no message)"));
      }
    },
  };

  const sandbox = {
    console: consoleMock,
    require: buildSandboxRequire(),
    setTimeout: undefined,
    setInterval: undefined,
    setImmediate: undefined,
    clearTimeout: undefined,
    clearInterval: undefined,
    clearImmediate: undefined,
    fetch: undefined,
    process: {
      env: {},
      argv: [],
      version: process.version,
    },
    Math,
    JSON,
    Array,
    Object,
    Number,
    String,
    Boolean,
    Date,
    RegExp,
    Error,
    TypeError,
    RangeError,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Symbol,
    Promise,
    Proxy,
    Reflect,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    decodeURI,
    decodeURIComponent,
    encodeURI,
    encodeURIComponent,
    Infinity,
    NaN,
    undefined,
  };

  vm.createContext(sandbox);

  try {
    vm.runInContext(code, sandbox, {
      timeout: MAX_EXECUTION_MS,
      displayErrors: true,
    });

    const output = outputLines.join("\n").slice(0, MAX_OUTPUT_LENGTH);
    const executionTime = Date.now() - start;
    return { output, error: null, executionTime };
  } catch (err: unknown) {
    const executionTime = Date.now() - start;
    let errorMessage: string;

    if (err instanceof Error) {
      if (err.message.includes("Script execution timed out")) {
        errorMessage = `Execution timed out after ${MAX_EXECUTION_MS}ms`;
      } else {
        errorMessage = err.message;
        if ((err as NodeJS.ErrnoException).stack) {
          const stackLines = (err as NodeJS.ErrnoException).stack!
            .split("\n")
            .filter((line) => !line.includes("node:vm") && !line.includes("vm.js"))
            .slice(0, 5);
          if (stackLines.length > 1) {
            errorMessage = stackLines.join("\n");
          }
        }
      }
    } else {
      errorMessage = String(err);
    }

    const output = outputLines.join("\n").slice(0, MAX_OUTPUT_LENGTH);
    return { output, error: errorMessage, executionTime };
  }
}

function formatArg(arg: unknown): string {
  if (arg === null) return "null";
  if (arg === undefined) return "undefined";
  if (typeof arg === "string") return arg;
  if (typeof arg === "number" || typeof arg === "boolean" || typeof arg === "bigint") return String(arg);
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}
