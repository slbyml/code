module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "eslint:recommended"
  ],
  "globals":{
    "document": true,
    "localStorage": true,
    "window": true
  },
  parserOptions: {
    ecmaVersion: 6
  }
};
