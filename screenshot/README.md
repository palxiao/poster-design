
## Node截图服务

目录结构比较简单，主要就实现了三个接口，其中 `api/screenshots` 即是项目中所使用到的图片生成接口，在真实生产项目中可以把该服务单独部署，于内网调用，这样利于做一些鉴权之类的处理。

另外 `api/printscreen` 这个接口实现的是网页截图的 API，该接口可以传入一个 URL 对整个网页进行截图，本项目中没有使用到此接口。

### 安装依赖

`npm install` 或 `yarn`

### 启动项目并热更新

`npm run dev`

### 打包

`npm run build`

#### 打包说明

由于项目依赖在打包时会出现许多未知错误，所以在 **webpack.config.js** 中过滤掉了依赖，打包出来的文件会非常小因为只包含项目代码，需要将 `package.json` 放到服务器上安装依赖来使用，具体的做法类似以下步骤：

1. 将项目中的 `package-build.json` 上传到服务器中，重命名为 `package.json`
2. 目录下执行 `yarn` 安装依赖
3. 将打包的 `dist/server.js` 放在同个目录中
4. `pm2 start server.js` 服务启动

### 服务器配置

在 Linux 环境下，npm 自动安装的 Chrome 浏览器有可能会出错，所以推荐从外部安装好浏览器，再给项目中的配置文件 `src/config.ts` 设置好路径，例如：

```js
exports.executablePath = '/opt/google/chrome-unstable/chrome'
```

一些可能用到的 linux 命令参考：

```shell
google-chrome --version # 查看浏览器版本号
apt-get update
apt-get install -y google-chrome-stable // 安装最新稳定版谷歌浏览器
```

### 生成 API 文档

`build:apidoc`