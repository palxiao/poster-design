<!--
 * @Author: ShawnPhang
 * @Date: 2023-07-14 10:44:31
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-18 15:06:36
-->

[在线体验](https://design.palxp.com/) | [中文文档](https://xp.palxp.com/)

## 迅排设计

一款漂亮且功能强大的在线海报图片设计器，仿稿定设计。

让你轻松实现创意，迅速进行排版，感受云上设计带来的乐趣！

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

### 运行结果

![](https://xp.palxp.com/images/2023-7-16-1689500112694.gif)

合成图片时本地会启动一个 Chrome 浏览器实例。

### 打包前端页面

```
npm run v-build
```

### 打包图片生成服务

```
cd sreenshot
npm run build
```

### 服务端

可参考接口 API 文档自行实现服务端。

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

## 感谢

本项目使用或参考了以下优秀开源项目：

- [moveable](https://github.com/daybrush/moveable): 提供了画布中选择、拖动缩放等能力
- [html2canvas](https://github.com/niklasvh/html2canvas): 前端生成图片兜底方案
- [qr-code-styling](https://qr-code-styling.com/): 风格化二维码
- [sky](https://github.com/cfour-hi/sky): 参考了其 PSD 解析的实现
