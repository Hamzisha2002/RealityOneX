import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
  (window as any).process = {
    env: { NODE_ENV: "development" },
    browser: true,
    version: "",
    argv: [],
  };
}
