
## Node截图服务

目录结构比较简单，主要就实现了三个接口，其中 `api/screenshots` 即是项目中所使用到的图片生成接口，在真实生产项目中可以把该服务单独部署，于内网调用，这样利于做一些鉴权之类的处理。

另外 `api/printscreen` 这个接口实现的是网页截图的 API，该接口可以传入一个 URL 对整个网页进行截图，可用于合成长图分享海报等场景，本项目中没有使用到此接口。

### 安装依赖

`npm install` 或 `yarn`

### 启动项目并热更新

`npm run dev`

### 打包

`npm run build`

#### 打包说明

直接打包可能会出现未知错误，本项目在 **webpack.config.js** 中过滤掉了依赖（打包出来的文件会非常小因为只包含项目代码），建议将 `package.json` 放到服务器上主动安装依赖来使用，具体的做法类似以下步骤：

1. 将项目中的 `package-build.json` 上传到服务器中，重命名为 `package.json`
2. 目录下执行 `yarn` 安装依赖
3. 执行 `npm run build`
4. 将打包的 `dist/server.js` 放在 `node_modules` 同级目录中
5. 使用 `pm2 start server.js` 启动并守护服务

### 服务器配置

在 Linux 环境下推荐主动安装浏览器，再给项目中的配置文件 `src/config.ts` 设置好路径：

```js
exports.executablePath = '/opt/google/chrome-unstable/chrome'
```

> `/opt/google` 为默认路径，一般不会变动

一些可能用到的 linux 命令参考（Debian GNU/Linux 9）：

```shell
google-chrome --version # 查看浏览器版本号
apt-get update
apt-get install -y google-chrome-stable // 安装最新稳定版谷歌浏览器
```

> 其它系统自行搜索如何安装Chrome，推荐使用Docker部署，本项目部署[参考说明](https://xp.palxp.com/#/articles/1689319644311?id=docker%e5%ae%b9%e5%99%a8)。

### 生成 API 文档

`build:apidoc`