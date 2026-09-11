import { spawn } from "node:child_process";
import { join } from "node:path";

const standalone = join(process.cwd(), ".next", "standalone");
process.chdir(standalone);
const child = spawn(process.execPath, ["server.js"], {
  stdio: "inherit",
  env: { ...process.env, HOSTNAME: process.env.HOSTNAME || "0.0.0.0" },
});
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
