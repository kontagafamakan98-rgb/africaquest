import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: [
      "src/components/**/*.{js,mjs,cjs,jsx}",
      "src/pages/**/*.{js,mjs,cjs,jsx}",
      // The layer that touches the browser is the one where a name that does not
      // exist costs a stored afternoon, and it used to sit outside the linters
      // altogether: nothing here reads it unless this line is there.
      "src/api/**/*.{js,mjs,cjs}",
      "src/Layout.jsx",
      "src/lib/**/*.{js,mjs,cjs,jsx}",
      "scripts/**/*.{js,mjs,cjs}",
    ],
    ignores: ["src/components/ui/**/*"],
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "unused-imports": pluginUnusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unknown-property": [
        "error",
        { ignore: ["cmdk-input-wrapper", "toast-close"] },
      ],
      "react-hooks/rules-of-hooks": "error",
    },
  },
  // The desktop shell, in a block of its own.
  //
  // It is the one part of the project that runs under Node with Electron rather
  // than in a browser, so it is read with Node's globals - `process`, `Buffer` -
  // and without React's. Kept out of the block above rather than folded into it:
  // merged with it, a file under src/ would be allowed to name `process` and
  // write to the disk, which is the door the type gate in jsconfig.json holds
  // shut by reading that program with the browser's typings alone.
  {
    files: ["electron/**/*.{js,mjs,cjs}"],
    ...pluginJs.configs.recommended,
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
    },
  },
];
