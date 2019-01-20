# 基于 wdui 框架编写高质量 Vue 组件

该组件库基于 [wdui](https://github.com/wdfe/wdui) 框架运行，由 vbuilder 完成框架的封装工作，大幅简化组件开发成本。

## 配置

自定义 1 屏使用多少 rem：

配置文件 `.vbuilder.rc` 中添加对 rem 的描述：

```js

// module.exports.config = {
//     rem: 25 // 设置 25 rem 为 1 屏幕宽度，默认为 10
// };

module.exports.vbuilderScaffold = '@vdian/wdui';
```

## 执行命令

+   本地开发: `v run dev` 或 `npm run dev`
+   lint: `npm run lint`
+   单元测试: `npm run test`

## 发布组件

+   以下步骤已内置在 `prepublish` 钩子中
    +   执行 lint: `npm run lint`
    +   执行 test: `npm run test`
    +   执行 build: `npm run build`
+   `npm version patch`
+   `npm publish` 到 `@vdian` 域下