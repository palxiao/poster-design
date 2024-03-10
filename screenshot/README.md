## Node截图服务

目录结构比较简单，主要就实现了三个接口，其中 `api/screenshots` 即是项目中所使用到的图片生成接口，在真实生产项目中可以把该服务单独部署，于内网调用，这样利于做一些鉴权之类的处理。

另外 `api/printscreen` 这个接口实现的是网页截图的 API，该接口可以传入一个 URL 对整个网页进行截图，可用于合成长图分享海报等场景，本项目中没有使用到此接口。

### 安装依赖

`npm install`

安装依赖时可能会出现这个报错提示：

```
ERROR: Failed to set up Chromium xxx! Set "PUPPETEER_SKIP_DOWNLOAD" env variable to skip download.
```

不用慌，这是因为 puppeteer 会自动下载 Chromium，国内会受到网络波动的影响。

如果跳过的话需要手动安装，比较麻烦所以并不推荐。解决方法是多尝试几次，或者更换国内的镜像源即可。

### 启动项目并热更新

`npm run dev`

### 打包

`npm run build`

#### 打包部署步骤

> 服务器环境需求：Node.js 16.18.1（版本不同则可能出现错误）、PM2（进程守护）

1. 本地执行 `npm run build` 打包
2. 打包后项目根目录 `dist/` 文件夹上传服务器，并执行 `npm install` 安装依赖
3. 运行 `pm2 start dist/server.js` 启动并守护服务

### 配置说明

配置文件 `src/config.ts` 配置项说明：

```js
port // 端口号
website // 编辑器项目的地址
filePath // 生成图片保存的目录
```

### 生成 API 文档

`build:apidoc`