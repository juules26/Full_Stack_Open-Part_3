import globals from "globals"
import pluginJs from "@eslint/js"


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.node },
    rules: {
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", "never"],
      "linebreak-style": ["error", "unix"],
    }
  },
  pluginJs.configs.recommended,
]