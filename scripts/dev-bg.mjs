import fs from "node:fs";
import path from "node:path";
import { execSync, spawn } from "node:child_process";
import net from "node:net";

const projectRoot = process.cwd();
const pidFile = path.join(projectRoot, ".dev_pid");

function isRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(700);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => {
      resolve(false);
    });
    socket.connect(port, "127.0.0.1");
  });
}

function getListeningPidsWindows(port) {
  try {
    const output = execSync("netstat -ano", { encoding: "utf8" });
    const pids = new Set();
    for (const line of output.split(/\r?\n/)) {
      if (!line.includes(`:${port}`) || !line.includes("LISTENING")) continue;
      const parts = line.trim().split(/\s+/);
      const pid = Number(parts[parts.length - 1]);
      if (Number.isInteger(pid)) pids.add(pid);
    }
    return [...pids];
  } catch {
    return [];
  }
}

if (fs.existsSync(pidFile)) {
  const existingPid = Number(fs.readFileSync(pidFile, "utf8").trim());
  const alreadyListening = await isPortOpen(5173);
  if (Number.isInteger(existingPid) && isRunning(existingPid) && alreadyListening) {
    console.log(`Dev server already running. PID=${existingPid}`);
    process.exit(0);
  }
  fs.unlinkSync(pidFile);
}

if (await isPortOpen(5173)) {
  if (process.platform === "win32") {
    const pids = getListeningPidsWindows(5173);
    if (pids.length > 0) fs.writeFileSync(pidFile, String(pids[0]), "utf8");
  }
  console.log("Port 5173 is already in use. Dev server is likely already running.");
  process.exit(0);
}

const beforePids = process.platform === "win32" ? new Set(getListeningPidsWindows(5173)) : new Set();

const child =
  process.platform === "win32"
    ? spawn(
        "cmd.exe",
        ["/c", "npm run dev -- --host 0.0.0.0 --port 5173"],
        {
          cwd: projectRoot,
          detached: true,
          stdio: "ignore",
        },
      )
    : spawn(
        "npm",
        ["run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"],
        {
          cwd: projectRoot,
          detached: true,
          stdio: "ignore",
        },
      );

child.unref();

let up = false;
for (let i = 0; i < 10; i += 1) {
  await sleep(500);
  if (await isPortOpen(5173)) {
    up = true;
    break;
  }
}

if (!up) {
  if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile);
  console.error("Dev server did not start on port 5173.");
  process.exit(1);
}

let storedPid = child.pid;
if (process.platform === "win32") {
  const afterPids = getListeningPidsWindows(5173);
  const newPid = afterPids.find((pid) => !beforePids.has(pid));
  if (Number.isInteger(newPid)) storedPid = newPid;
  else if (afterPids.length > 0) storedPid = afterPids[0];
}

fs.writeFileSync(pidFile, String(storedPid), "utf8");

console.log(`Dev server started in background. PID=${storedPid}`);
console.log("Open: http://127.0.0.1:5173");
