module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'unused-imports'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/await-thenable": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    "no-console": "warn",

    // Unused imports/variables
    '@typescript-eslint/no-unused-vars': ['error',  {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }], // Detect unused variables
    'unused-imports/no-unused-imports': 'error', // Warn about unused imports
    'unused-imports/no-unused-vars': [
      'error',
      { 
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used', 
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: "^_"
      }
    ],

    // Automatic fixing of imports
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
  },
};
