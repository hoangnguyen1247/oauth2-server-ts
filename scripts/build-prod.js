const fs = require('fs');
const packageJson = require('../package.json');

delete packageJson.scripts;
delete packageJson.devDependencies;
fs.writeFileSync(
    __dirname + '/../lib/package.json',
    JSON.stringify(packageJson, null, 2),
);
