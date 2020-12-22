module.exports = {
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    "env": {
        "es6": true,
        "browser": true,
        "jest": true,
        "node": true
    },
    "rules": {
        "@typescript-eslint/no-empty-function": 0,
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/explicit-member-accessibility": 0,
        "@typescript-eslint/member-delimiter-style": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/no-use-before-define": 0,
        "@typescript-eslint/no-unused-vars": [ 2, { "args": "none" } ],
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "@typescript-eslint/no-empty-interface": 0,
        "@typescript-eslint/indent": [2, 4],
        "@typescript-eslint/quotes": [2, "double"],
        "@typescript-eslint/semi": [2, "always"],
        "object-curly-spacing": [ 2, "always" ],
        "eol-last": [ 2, "always" ],
        "no-console": 0,
    }
}
