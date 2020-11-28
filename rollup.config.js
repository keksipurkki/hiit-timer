import typescript from "@rollup/plugin-typescript";
import html from "@rollup/plugin-html";
import { readFileSync } from "fs";
import { randomBytes } from "crypto";

const attributes = {
  head: `<link rel="stylesheet" href="app.css?v=${randomBytes(8).toString("base64")}">`,
  scripts: `<script src="app.js?v=${randomBytes(8).toString("base64")}"></script>`,
};

function template() {
  const pattern = /{([^{}]*)}/g;
  const mold = readFileSync("./index.template.html").toString();
  return mold.replace(pattern, (_, attr) => attributes[attr]);
}

const pwa = {
  input: "./src/index.tsx",
  output: {
    file: "./public_html/app.js",
    sourcemap: true,
    format: "iife",
    globals: {
      "react": "React",
      "react-dom": "ReactDOM",
    },
  },
  external: ["react", "react-dom"],
  plugins: [typescript(), html({ template, fileName: "index.html" })],
};

const serviceWorker = {
  input: "./src/service-worker.ts",
  output: {
    file: "./public_html/sw.js",
    sourcemap: true,
    format: "iife",
  },
  plugins: [typescript()],
};

export default [pwa, serviceWorker];
