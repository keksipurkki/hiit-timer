const typescript = require("rollup-plugin-typescript");

export default {
  input: "./src/index.tsx",
  output: {
    file: "./public_html/app.js",
    format: "iife",
    globals: {
      react: "React",
      "react-dom": "ReactDOM"
    }
  },
  external: ["react", "react-dom"],
  plugins: [typescript()],
};
