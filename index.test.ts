import {fork} from "node:child_process";
import {once} from "node:events";
import {platform, tmpdir} from "node:os";
import {mkdtempSync, statSync} from "node:fs";
import {readFile, copyFile, rm} from "node:fs/promises";
import {join} from "node:path";
import {setTimeout as sleep} from "node:timers/promises";

const testDir = mkdtempSync(join(tmpdir(), "daemonize-process-"));

beforeAll(async () => {
  await Promise.all(["index.ts", "child.ts", "package.json"].map(file => copyFile(new URL(file, import.meta.url), join(testDir, file))));
});

afterAll(async () => {
  await rm(testDir, {recursive: true});
});

test.each([
  {name: "undefined-options", customVar: "undefined"},
  {name: "custom-env", customVar: "1"},
])("$name: child daemonizes once, is orphaned, sees the custom env and not the tracking variable", async ({name, customVar}) => {
  await once(fork(join(testDir, "child.ts"), [name]), "exit");
  const outputFile = join(testDir, `${name}-output`);
  for (let i = 0; i < 500 && !statSync(outputFile, {throwIfNoEntry: false})?.size; i++) await sleep(10);
  expect(await readFile(outputFile, "utf8")).toMatch(new RegExp(`^${platform() === "win32" ? "[0-9]+" : "[01]"},false,${customVar}$`));
  expect(await readFile(join(testDir, `${name}-starts`), "utf8")).toEqual("xx");
});
