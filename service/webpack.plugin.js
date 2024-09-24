/*
 * @Author: ShawnPhang
 * @Date: 2024-06-19 23:35:21
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2024-09-24 19:30:38
 */
const pkg = require("./package.json");
const fs = require('fs');

class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap("BuildPackageJson", async (compilation) => {
      console.log("构建 package.json ....");
      const myBuildPackageJson = `{
        name: ${pkg.name+'-builder'},
        version: ${pkg.version},
        dependencies: ${JSON.stringify(pkg.dependencies, null, 2)}
      }`;
      await checkCreateFolder('./dist')
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

// 检测目录并创建目录
function checkCreateFolder(folder) {
  try {
    const pathArr = splitPath(folder);
    let _path = "";
    for (let i = 0; i < pathArr.length; i++) {
      if (pathArr[i]) {
        _path += `/${pathArr[i]}`;
        !fs.existsSync(_path) && fs.mkdirSync(_path);
      }
    }
  } catch (e) {}
}

module.exports = MyPlugin;
