import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        // Test globals
        describe: true,
        test: true,
        it: true,
        expect: true,
        // Node.js globals for config files
        require: true,
        module: true,
        process: true,
      },
    },
  },
]);
