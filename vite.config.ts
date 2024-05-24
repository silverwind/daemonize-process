import {defineConfig} from "vite";
import {nodeLib} from "vite-config-silverwind";

export default defineConfig(nodeLib({
  url: import.meta.url,
  dtsExcludes: ["child.ts"],
  build: {
    target: "node18",
  }
}));
