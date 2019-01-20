/**
 * @file bio scaffold entry file
 */

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const sh = require('shelljs');
const readdirSync = require('recursive-readdir-sync');

const srcDir = process.env.srcDir;

const templateDir = path.join(__dirname, '../project-template');

// copy templates to src dir
readdirSync(templateDir).forEach((filepath) => {
    const relativePath = filepath.replace(templateDir, '');
    fse.copySync(filepath, path.join(srcDir, relativePath));
});