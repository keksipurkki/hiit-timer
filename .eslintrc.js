const rules = {
  semi: 'error',
  '@typescript-eslint/explicit-function-return-type': 0,
  'react/prop-types': 'off', // Handled by TS
  '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
};

const settings = {
  "react": {
    "pragma": "React",
    "version": "detect"
  }
};

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules,
  settings
};
