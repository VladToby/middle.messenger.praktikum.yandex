export default [
  {
    files: ["src/**/*.ts"],
    rules: {
      "max-len": [2, 100],
      "max-params": [2, 3],
      "no-console": "off",
      "eol-last": ['error', 'always'],
    },
    ignores: ["dist", "node_modules"],
  }
];
