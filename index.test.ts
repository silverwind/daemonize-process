import {fork} from "node:child_process";
import {once} from "node:events";
import {platform, tmpdir} from "node:os";
import {mkdtempSync} from "node:fs";
import {readFile, copyFile, rm} from "node:fs/promises";
import {join} from "node:path";
import {setTimeout as sleep} from "node:timers/promises";

const testDir = mkdtempSync(join(tmpdir(), "daemonize-process-"));

beforeAll(async () => {
  await Promise.all(["index.ts", "child.ts", "package.json"].map(file => {
    return copyFile(new URL(file, import.meta.url), join(testDir, file));
  }));
});

afterAll(async () => {
  await rm(testDir, {recursive: true});
});

test.each([
  {name: "default-env", customVar: "undefined"},
  {name: "custom-env", customVar: "1"},
])("$name: child daemonizes once, is orphaned, sees the custom env and not the tracking variable", async ({name, customVar}) => {
  await once(fork(join(testDir, "child.ts"), [name]), "exit");
  await sleep(1000);
  expect(await readFile(join(testDir, `${name}-starts`), "utf8")).toEqual("xx");
  const [ppid, trackingVar, customVarValue] = (await readFile(join(testDir, `${name}-output`), "utf8")).split(",");
  if (platform() === "win32") {
    expect(ppid).toMatch(/[0-9]+/);
  } else {
    expect(["0", "1"]).toContain(ppid);
  }
  expect(trackingVar).toEqual("false");
  expect(customVarValue).toEqual(customVar);
});
