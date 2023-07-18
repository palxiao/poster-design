[在线体验](https://design.palxp.com/) | [文档网站](https://xp.palxp.com/) | [项目架构及目录](https://xp.palxp.com/#/articles/1689321259854)

## 迅排设计

一款漂亮且功能强大的在线海报图片设计器，仿稿定设计。

适用于海报图片生成、电商分享图、文章长图、视频/公众号封面等多种场景。

![](https://xp.palxp.com/images/2023-7-16-1689500112694.gif)

- 丝滑的操作体验，丰富的交互细节，基础功能完善
- 采用服务端生成图片，确保多端出图统一性，支持各种 CSS 特性
- 支持将上传的 PSD 文件解析成模板，方便导入已有设计图
- 技术栈：Vue3 、Vite2 、Vuex 、ElementPlus
- 图片生成：Puppeteer、Express

一些可独立的功能会被抽取出来作为单独的库引入使用，仓库地址：[front-end-arsenal](https://github.com/palxiao/front-end-arsenal)（[组件文档网站](https://fe-doc.palxp.com/#/)）

> 环境需求：**Node.js v16** 以上版本

### 拉取源码

```
git clone https://github.com/palxiao/poster-design.git
cd poster-design
```

### 安装依赖

```
npm run prepared
```

### 本地运行

```
npm run serve
```

> 将会同时运行前端界面与图片生成服务：
>
> ![](https://xp.palxp.com/images/2023-7-16-1689498291322.png)

合成图片时本地会启动一个 Chrome 浏览器实例。

### 打包

```
npm run v-build   <-  前端页面
npm run build     <-  图片生成服务（ sreenshot 目录下）
```

### 服务端

可参考[接口 API 文档](https://xp.palxp.com/apidoc/index.html)自行实现服务端。

### 图片生成服务

代码位于 `screenshots` 目录下，查看[接口 API 文档](https://xp.palxp.com/apidoc/screenshot.html)。

### 服务器配置

在 Linux 环境下，npm 自动安装的 Chrome 浏览器有可能会出错，所以推荐从外部安装好浏览器，再给项目中的配置文件 `config.js` 设置好路径，例如：

```js
exports.executablePath = '/opt/google/chrome-unstable/chrome'
```

一些可能用到的 linux 命令参考：

```shell
google-chrome --version # 查看浏览器版本号
apt-get update
apt-get install -y google-chrome-stable // 安装最新稳定版谷歌浏览器
```

## Docker 容器

可以通过 Docker 运行一个带 Linux 浏览器的容器，然后暴露一个截图服务以供使用，我所使用的基础镜像为：

```
docker pull howard86/puppeteer_node:12
```

运行容器命令参考（其中映射了 `/cache` 为临时目录，放生成图片用）：

```
docker run -itd -v /data/docker-home:/home -v /data/cache:/cache -p 7001:7001 --name screenshot howard86/puppeteer_node:12
```

运行后可以手动进入容器中查看谷歌浏览器版本，看需不需要升级，然后安装 pm2 作为服务管理工具，服务启动/重部署相关脚本命令可参考：

```shell
docker exec screenshot /bin/bash -c 'pm2 delete screenshot-service'
docker exec screenshot /bin/bash -c 'cd /home/ && yarn'
docker exec screenshot /bin/bash -c 'pm2 start /home/screenshot-service.js'
docker exec screenshot /bin/bash -c 'pm2 flush'
```

如果不想像上面这样直接操作容器，可以在本地/服务器先运行镜像，进入容器中照例配置好 pm2，然后把该容器导出为新的镜像，例如：new-design/screenshot，命令运行参考：

```
docker run -itd -u root -v ~/data/tmp/screenshot:/cache -p 9001:9001 --name screenshot2 new-design/screenshot /bin/sh  -c "/usr/local/bin/pm2 start /home/dist/server.js && /usr/local/bin/pm2 flush"
```

这种方式只需要一个镜像以及一个启动命令即可部署，重新跑一遍命令也就相当于重启整个容器。

### 支持功能

- 导入 PSD 设计稿，导出图片下载
- 元素拖拽、组合、缩放、层级调整、对齐等操作。
- 图片素材插入、替换、裁剪，图片容器等功能。
- SVG 素材颜色、透明度编辑，文字花字组合。
- 画布自定义尺寸、滚轮缩放、自适应画布
- 吸附对齐、辅助引导线、标尺功能。
- 键盘快捷键、右键菜单快捷操作，复制删除等常用操作。
- 风格二维码编辑，支持单色、渐变、自定义 logo 等。
- 图层操作，支持拖拽变更层级。
- 颜色调色板，原生级取色器颜色吸管（Chrome）。

### 感谢

本项目使用或参考了一些优秀开源项目，包括但不限于：

- [moveable](https://github.com/daybrush/moveable): 提供了画布中选择、拖动缩放等能力
- [html2canvas](https://github.com/niklasvh/html2canvas): 前端生成图片兜底方案
- [qr-code-styling](https://qr-code-styling.com/): 风格化二维码
- [sky](https://github.com/cfour-hi/sky): 参考了其 PSD 解析的实现

### Q&A

Q：**我想二次开发，但是不会编写代码，可以付费开发吗？**

A：抱歉，本人时间精力有限，无法提供私有化部署或二次开发的服务，不接受定制化开发的需求。如果您对项目有任何建议或意见，非常欢迎与我交流。

Q：**服务端源码不开源吗？**

A：考虑到服务端的开发语言、数据库类型都可能不尽相同，且分离代码出来有一定成本，所以暂时不考虑直接开源，只提供接口 API 文档供参考。目前服务端仅是一些简单的增删改查，自行实现的技术难度并不高。
