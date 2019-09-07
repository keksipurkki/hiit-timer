import typescript from "rollup-plugin-typescript";

const pwa = {
  input: "./src/index.tsx",
  output: {
    file: "./public_html/app.js",
    sourcemap: true,
    format: "iife",
    globals: {
      react: "React",
      "react-dom": "ReactDOM"
    }
  },
  external: ["react", "react-dom"],
  plugins: [typescript()],
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
