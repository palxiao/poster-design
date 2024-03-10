const pkg = require("./package.json");
const fs = require('fs');

class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap("BuildPackageJson", (compilation) => {
      console.log("构建 package.json ....");
      const myBuildPackageJson = `{
        name: ${pkg.name+'-builder'},
        version: ${pkg.version},
        dependencies: ${JSON.stringify(pkg.dependencies, null, 2)}
      }`;
      fs.writeFile('./dist/package.json', myBuildPackageJson, 'utf8', (err) => {
        if (err) {
          console.error('保存 package.json 文件时发生错误：', err);
        } else {
          console.log('package.json 文件构建完成！');
        }
      });
    });
  }
}

module.exports = MyPlugin;
