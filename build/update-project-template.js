
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const readdirSync = require('recursive-readdir-sync');

const templateDir = path.join(__dirname, '../project-template');
const template = path.join(__dirname, '../vbuilder-demo/default');

fse.removeSync(template);
fse.ensureDirSync(template);

readdirSync(templateDir).forEach((filepath) => {
    const relativePath = filepath.replace(templateDir, '');
    if (!/(docs\-)|(src\-)|(common\-)/.test(relativePath)) {
        fse.copySync(filepath, path.join(template, relativePath));
    }
});
