**[在线体验](https://design.palxp.cn/)** | **[中文文档网站](https://xp.palxp.cn/)** | [架构及目录说明](https://xp.palxp.cn/#/articles/1689321259854)

---

## 迅排设计

一款漂亮且功能强大的在线海报图片设计器，仿稿定设计。

适用于海报图片生成、电商分享图、文章长图、视频/公众号封面等多种场景。

![](https://xp.palxp.cn/images/2023-7-16-1689500112694.gif)

- 丝滑的操作体验，丰富的交互细节，基础功能完善
- 采用服务端生成图片，确保多端出图统一性，支持各种 CSS 特性
- 简易 AI 抠图工具，上传图片一键去除背景
- 技术栈：Vue3 、Vite2 、Vuex 、ElementPlus
- 图片生成：Puppeteer、Express

### 支持功能

- 导入 PSD 文件解析成模板、在线导出图片下载
- 元素拖拽、组合、缩放、层级调整、对齐等操作。
- 图片素材插入、替换、裁剪，图片容器等功能。
- SVG 素材颜色、透明度编辑，文字花字组合。
- 画布自定义尺寸、滚轮缩放、自适应画布
- 吸附对齐、辅助引导线、标尺功能。
- 键盘快捷键、右键菜单快捷操作，复制删除等常用操作。
- 风格二维码编辑，支持单色、渐变、自定义 logo 等。
- 图层操作，支持拖拽变更层级。
- 颜色调色板，原生级取色器颜色吸管（Chrome）。

### 拉取源码

> 环境需求：**Node.js v16.18** 以上版本

```
git clone https://github.com/palxiao/poster-design.git
cd poster-design
```

### 安装依赖

```
npm run prepared
```

> 网络太慢？尝试运行：npm config set registry https://registry.npmmirror.com 再安装依赖

### 本地运行

```
npm run serve
```

> 将会同时运行前端界面与图片生成服务(`3000`端口为前端项目，`7001`端口为图片生成服务)：
>
> ![](https://xp.palxp.cn/images/2023-7-16-1689498291322.png)
>
> 如果你本地没有成功启动两个服务，可能是 win 系统不兼容，手动进 `screenshot` 目录安装依赖(`npm install`)并启动服务(`npm run dev`) 或者使用 VSCode 自带的终端来运行命令，注意不要使用 CMD。

### 打包

| 前端页面          | 截图服务                              |
| ----------------- | ------------------------------------- |
| `npm run v-build` | `cd sreenshot` <br /> `npm run build` |

### 截图服务

代码位于 [screenshots/](https://github.com/palxiao/poster-design/tree/main/screenshot) 目录下，查看[接口 API 文档](https://xp.palxp.cn/apidoc/screenshot.html)。

> 打包注意事项与服务器配置相关请进入该目录下查看 README 文件说明。

### 截图服务 Docker 部署

可以通过 Docker 运行一个带 Linux 浏览器的容器，[参考说明](https://xp.palxp.cn/#/articles/1689319644311?id=docker%e5%ae%b9%e5%99%a8)。

### 服务端

根据你的具体场景自行实现，目前本项目中的所有后端接口可参考：[接口 API 文档](https://xp.palxp.cn/apidoc/index.html)。

### 抠图服务部署

```
docker run -d -p 5000:5000 --restart always danielgatis/rembg s
```

### 感谢

本项目使用或参考了一些优秀开源项目，包括但不限于：

- [moveable](https://github.com/daybrush/moveable): 提供了画布中选择、拖动缩放等能力
- [html2canvas](https://github.com/niklasvh/html2canvas): 前端生成图片兜底方案
- [qr-code-styling](https://qr-code-styling.com/): 风格化二维码
- [sky](https://github.com/cfour-hi/sky): 参考了其 PSD 解析的代码实现
- [rembg](https://github.com/danielgatis/rembg): 图片删除背景，使用 u2net 预训练模型

### Q&A

Q：**项目可以直接部署上线吗？**

A：本项目支持本地运行体验完整功能，如需部署到生产，需自行开发配套的后端接口，自行部署图片生成服务，部署方法参考项目中的文档。

Q：**后端源码不开源吗？**

A：考虑到服务端的开发语言、数据库类型都可能不尽相同，且本项目中实现简单，代码不具备参考性，所以暂时只提供接口 API 文档。（目前仅是一些增删改查）

### 其它

项目最早使用 Vue2 开发，后改用 Vue3 重构，所以有部分代码混合了 Options 写法。

或许你在工作中有类似的需求，或许你也对开发编辑器感兴趣，希望这个项目能给到你一些微薄帮助！

目前本项目也还在迭代中，有很多的不足，我也是一边学习一边成长。开源不易，希望看到这里的你可以给本项目点个 **Star** 支持一下~

[![Star History Chart](https://api.star-history.com/svg?repos=palxiao/poster-design&type=Date)](https://star-history.com/#palxiao/poster-design&Date)

[后续部分迭代计划记录](https://xp.palxp.cn/#/articles/1689319986889?id=%e8%bf%ad%e4%bb%a3%e8%ae%a1%e5%88%92)

### LICENSE

[MIT License](https://github.com/palxiao/poster-design/blob/main/LICENSE)
