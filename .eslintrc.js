module.exports = {
  env: {
    browser: true,
    es6: true,
    jquery: true,
    jasmine: true
  },
  //parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jquery"],
  extends: [
    "airbnb-typescript/base"
    //"plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  rules: {

    "import/extensions":  0

  },

  parserOptions: {
    sourceType: "module"
  }
};
