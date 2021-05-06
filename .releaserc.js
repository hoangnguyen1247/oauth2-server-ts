module.exports = {
    "branches": [
        "master",
        { "name": "develop", "prerelease": true },
        { "name": "release-next", "prerelease": "rc" }
    ],
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/npm",
        "@semantic-release/github",
        ["@semantic-release/exec", {
            // "prepareCmd": "echo -n ${nextRelease.version} > VERSION",
            // "prepareCmd": "node ./buildScripts/bumpVersion.js ${nextRelease.version}",
        }]
    ]
}
