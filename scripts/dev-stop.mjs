import fs from "node:fs";
import path from "node:path";
import { execSync, spawnSync } from "node:child_process";

const projectRoot = process.cwd();
const pidFile = path.join(projectRoot, ".dev_pid");

function stopByPort() {
  if (process.platform !== "win32") {
    return false;
  }

  let output = "";
  try {
    output = execSync("netstat -ano", { encoding: "utf8" });
  } catch {
    return false;
  }

  const pids = new Set();
  for (const line of output.split(/\r?\n/)) {
    if (!line.includes(":5173") || !line.includes("LISTENING")) continue;
    const parts = line.trim().split(/\s+/);
    const pid = Number(parts[parts.length - 1]);
    if (Number.isInteger(pid)) pids.add(pid);
  }

  if (pids.size === 0) {
    return false;
  }

  for (const pid of pids) {
    spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
  }
  return true;
}

if (!fs.existsSync(pidFile)) {
  const stopped = stopByPort();
  if (stopped) {
    console.log("Stopped process(es) listening on port 5173.");
  } else {
    console.log("No .dev_pid file found and nothing is listening on port 5173.");
  }
  process.exit(0);
}

const pid = Number(fs.readFileSync(pidFile, "utf8").trim());
if (!Number.isInteger(pid)) {
  fs.unlinkSync(pidFile);
  console.log("Invalid PID file removed.");
  process.exit(0);
}

if (process.platform === "win32") {
  spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
} else {
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // Process may already be stopped.
  }
}

fs.unlinkSync(pidFile);
console.log(`Dev server stop command sent for PID=${pid}.`);
