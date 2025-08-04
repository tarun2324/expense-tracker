import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.config({
    extends: ['next'],
    rules: {
      // Disable all ESLint rules
      // You can use the following to turn off all rules:
      // https://eslint.org/docs/latest/use/configure/rules#turning-off-rules
      // But for FlatConfig, you need to explicitly set rules to 'off'
    },
  })
];

// Remove all rules by setting an empty rules object or disabling known rules
eslintConfig.forEach(config => {
  config.rules = {};
});

export default eslintConfig;
