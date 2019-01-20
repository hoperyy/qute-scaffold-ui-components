/**
 * @author: 刘远洋
 * @home: https://github.com/hoperyy
 * @date: 2018/05/22
 * @function: 本文件用于根据开发者 component 动态生成一些构建所需的文件，更新的是 srcDir 内的文件
 */

const path = require('path');
const fs = require('fs');

const fse = require('fs-extra');
const readdirSync = require('recursive-readdir-sync');

const srcDir = process.env.srcDir;

// package item should be a directory
const globalComponentsDirPath = path.join(srcDir, 'packages');
const globalComponentNames = fs.readdirSync(globalComponentsDirPath).filter((filename) => {
    const dirpath = path.join(globalComponentsDirPath, filename);

    if (!fs.statSync(dirpath).isDirectory()) {
        return false;
    }

    if (!fs.existsSync(path.join(dirpath, 'index.vue')) && !fs.existsSync(path.join(dirpath, 'index.js'))) {
        return false;
    }

    return true;
});

function writeFileSync(filepath, content) {
    const fs = require('fs');

    const fd = fs.openSync(filepath, 'w+');
    fs.writeFileSync(filepath, content);
    fs.closeSync(fd);

    utime(filepath);
}

function utime(filepath) {
    const fs = require('fs');

    const newTime = ((Date.now() - (10 * 1000))) / 1000;
    fs.utimesSync(filepath, newTime, newTime);
}

class GenerateExample {
    constructor() {
        this.exampleDir = path.join(srcDir, 'example');
        this.exampleListDir = this.exampleDir; // path.join(this.exampleDir, 'example-list');

        this.exampleFiles = readdirSync(this.exampleListDir).filter((filepath) => {
            if (filepath.indexOf('example-page') !== -1) {
                return false;
            }
            if (/index\.js/.test(filepath)) {
                return true;
            }

            if (path.extname(filepath) !== '.vue') {
                return false;
            }

            return true;
        });

        this.ensureExampleFile();

        // examples have different type of routes from component name
        this.fullfillExamplePageRoute();
        this.fulfillExamplePageIndexVue();

        this.writeExamplePageIndexHtml();
    }

    writeExamplePageIndexHtml() {
        const targetHtml = path.join(this.exampleDir, 'example-page/index.html');
        let content = fs.readFileSync(targetHtml, 'utf8');
        
        let userConfig = {};
        const userConfigFile = path.join(srcDir, 'config.js');
        if (fs.existsSync(userConfigFile)) {
            userConfig = require(userConfigFile) || {};
        }

        const rem = userConfig.rem || 10;

        content = content.replace('$$_REM_$$', rem);
        writeFileSync(targetHtml, content);
    }

    // create example
    ensureExampleFile() {
        const exampleFilesWithoutExt = this.exampleFiles.map((filepath) => {
            return filepath.split(path.sep).pop().replace(/\.vue$/, '');
        });

        globalComponentNames.forEach((componentName) => {
            // Quickstart / Rem should not be shown in examples
            if (/(Quickstart)|(Rem)/.test(componentName)) {
                return;
            }
            if (exampleFilesWithoutExt.indexOf(componentName) === -1) {
                console.log(`[example attention] component "packages/components/${componentName}" has no example in "example/components/"`);

                const target = path.join(this.exampleListDir, `${componentName}.vue`);

                const content = `
<template lang="html">
  <div class="${componentName.toLowerCase()}-container">
    <wd-header title="${componentName}" fixed>
      <router-link to="/" slot="left" class="link">
        <span class="iconfont icon-zuosanjiao"></span>
      </router-link>
    </wd-header>
    <br>
    <div>Example To Be Finished...</div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="sass">
.${componentName.toLowerCase()}-container{
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .app-header-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
}
</style>
`;
                writeFileSync(target, content);
            }
        });

        console.log('');
    }

    // write example/route-config.js
    fullfillExamplePageRoute() {
        const targetFile = path.join(srcDir, 'example/example-page/route-config.js');

        const imports = [];
        const routes = [];

        this.exampleFiles.forEach((filePath, index) => {
            const relativePath = `.${filePath.replace(this.exampleDir, '')}`;
            const fileName = path.basename(filePath).replace(path.extname(filePath), '');

            // 适配 import
            imports[index] = `import ${fileName} from '.${relativePath}'`;

            // 适配 route
            routes[index] = `
                {
                    path: '${filePath.replace(this.exampleListDir, '').replace(/\.vue$/, '').toLowerCase()}',
                    name: '${fileName}',
                    component: ${fileName}
                },`;
        });


        const fileContent = `
            /**
             * This file is created by "npm run build:example-route"
            */

            import Index from './Index.vue'
            ${ imports.join('\n')}

            export default {
                routes: [
                    {
                        path: '/',
                        name: 'Index',
                        component: Index
                    },
                    {
                        path: '/quickstart',
                        redirect: '/'
                    },
                    ${ routes.join('\n')}
                ]
            }`;

        fse.ensureFileSync(targetFile);

        writeFileSync(targetFile, fileContent);
    }

    // write example/components/Index/Index.vue
    fulfillExamplePageIndexVue() {
        const targetFile = path.join(srcDir, 'example/example-page/Index.vue');

        const fileNames = [];
        this.exampleFiles.forEach((filePath, index) => {
            const relativePath = `.${filePath.replace(this.exampleDir, '')}`;
            const fileName = path.basename(filePath).replace(path.extname(filePath), '');

            // 适配 import
            fileNames[index] = `
                    '${fileName}',`;
        });


        const fileContent = `
            <template>
            <div class="index-container">
                <wd-header title="WDUI Components"></wd-header>
                <wd-cell :title="item" :to="\`#/\$\{item.toLowerCase()\}\`" v-for="item in components" :key="item"></wd-cell>
            </div>
            </template>

            <script>
            // This file is created by "npm run build:example-route"
            export default {
                data() {
                    return {
                        components: [
                            ${fileNames.join('')}
                        ]
                    }
                }
            }
            </script>

            <style lang="sass">
            body {
                font-family: Arial, "Microsoft YaHei";

                .iconfont.icon-zuosanjiao {
                    font-size: 36px;
                    // color: #fff;
                    color: #000;
                }
            }
            </style>`;

        fse.ensureFileSync(targetFile);
        writeFileSync(targetFile, fileContent);
    }
}

class GenerateWebsite {
    constructor() {
        this.writeComponentVueFile();
        this.writeSidebarComponentList();
    }

    writeComponentVueFile() {
        const target = path.join(srcDir, 'auto-completed-docs/website/components/Components/Components.vue');

        const importArr = [
            `import Rem from '../../../zh-cn/Rem.md'`,
            `import Quickstart from '../../../zh-cn/Quickstart.md'`
        ];
        const midListArr = [
            `['Quickstart'.toLowerCase()]: Quickstart,\n`,
            `['Rem'.toLowerCase()]: Rem,`,
        ];
        globalComponentNames.forEach((componentName) => {
            importArr.push(`import ${componentName} from '../../../zh-cn/${componentName}.md'`);
            midListArr.push(`   ['${componentName}'.toLowerCase()]: ${componentName},`);
        });

        const content = `
<template>
    <div :class="\`\$\{component\}-container markdown\`" v-html="content"></div>
</template>

<script>
/*global hljs*/
import MarkdownIt from 'markdown-it'
${importArr.join('\n')}
import {highlightInit} from '../../util/utils.js'

const mdList = {
${midListArr.join('\n')}
}

const md = new MarkdownIt({
    highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(lang, str).value
        }
        return ''
    }
})

export default {
    name: 'Components',
    props: {
        component: {
        type: String
        },
    },
    data() {
        return {
        content: ''
        }
    },
    mounted() {
        this.render()
    },
    watch: {
        component() {
        this.render()
        }
    },
    methods: {
        render() {
        this.content = md.render(mdList[this.component])
        this.$nextTick(() => {
            highlightInit(hljs)
        })
        }
    }
}
</script>

<style lang="sass">
.markdown {
    h1 {
        font-size: 20px;
        line-height: 30px;
        font-weight: bold;
        color: #222;
    }

    h2 {
        margin-top: 50px;
        font-size: 16px;
        line-height: 24px;
        color: #222;
        font-weight: bold;
    }

    p {
        margin-top: 10px;
        color: #737373;

        &+p {
        margin-top: 5px;
        }
    }

    ul,ol {
        margin-top: 10px;
    }

    li {
        a {
        color: #737373;
        }
    }
}
</style>
        `;

        writeFileSync(target, content);
    }

    // for sidebar list
    writeSidebarComponentList() {
        const target = path.join(srcDir, 'auto-completed-docs/website/components/Components/Components.js');
        const content = `
export default [
${(globalComponentNames.map(componentName => '    \'' + componentName + '\'')).join(',    \n')}
]
        `;

        writeFileSync(target, content);
    }
}

class GenerateDocsDir {
    constructor() {
        this.ensureReadmes();
    }

    ensureReadmes() {
        const targetDir = path.join(srcDir, 'auto-completed-docs/zh-cn');

        fse.ensureDirSync(targetDir);

        globalComponentNames.forEach((componentName) => {
            const readme = path.join(globalComponentsDirPath, componentName, 'README.md');
            const target = path.join(targetDir, `${componentName}.md`);
            if (fs.existsSync(readme)) {
                fse.copySync(readme, target);

                return;
            }

            const content = `
# ${componentName} (to be finished)

## 单独引入

\`\`\`javascript
import { ${componentName} } from 'wdui'

//注册
export default {
    ...
    components: {
        '${componentName.toLowerCase()}': ${componentName}
    },
...
}
\`\`\`

## 用法

${componentName} 组件分为  种状态：

## Props

| 参数               | 描述              | 类型      | 默认值    | 可选值                     |
|------------------ |------------------ |--------- |--------- |--------------------------- |
| type              | 样式              | String    | default  |   |
                `;

            writeFileSync(target, content);
        });
    }

}

class GenerateUiPackageInfo {
    constructor() {
        const pkgFile = path.join(srcDir, 'package.json');
        const pkgObj = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));

        const target = path.join(srcDir, 'auto-completed-docs/website/ui-package-info.js');

        const { name, description } = pkgObj;

        const content = `
            export default {
                name: \'${name || 'unknown'}\'
            };
        `;

        writeFileSync(target, content);
    }
}

class GeneratePackagesDir {
    constructor() {
        const target = path.join(srcDir, 'packages/index.js');

        const arr1 = globalComponentNames.map(
            componentName => {
                let importedPath = `'./${componentName}/index.vue'`;

                if (fs.existsSync(path.join(srcDir, 'packages', componentName, 'index.js'))) {
                    importedPath = `'./${componentName}/index.js'`;
                }
                
                return `import ${componentName} from ${importedPath}`;
            }
        );
        console.log('~~~~~~', arr1);
        const arr2 = globalComponentNames.map(componentName => `Vue.component(${componentName}.name, ${componentName})`);
        const arr3 = globalComponentNames.map(componentName => `${componentName},`);

        const content = `
${arr1.join('\n')}

const install = function(Vue) {
  if(install.installed) {
    return
  }

  ${arr2.join('\n')}
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

const version = '1.0.0'

export {
  install,
  version,
  ${arr3.join('\n')}
}
        `;

        writeFileSync(target, content);
    }
}

new GenerateExample();
new GenerateDocsDir();
new GenerateWebsite();
new GeneratePackagesDir();
new GenerateUiPackageInfo();
