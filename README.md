**[在线体验](https://design.palxp.com/)** | **[中文文档网站](https://xp.palxp.com/)** | [架构及目录说明](https://xp.palxp.com/#/articles/1689321259854)

---

## 迅排设计

一款漂亮且功能强大的在线海报图片设计器，仿稿定设计。

适用于海报图片生成、电商分享图、文章长图、视频/公众号封面等多种场景。

![](https://xp.palxp.com/images/2023-7-16-1689500112694.gif)

- 丝滑的操作体验，丰富的交互细节，基础功能完善
- 采用服务端生成图片，确保多端出图统一性，支持各种 CSS 特性
- 支持将上传的 PSD 文件解析成模板，方便导入已有设计图
- 技术栈：Vue3 、Vite2 、Vuex 、ElementPlus
- 图片生成：Puppeteer、Express

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
> ![](https://xp.palxp.com/images/2023-7-16-1689498291322.png)
> 如果你本地没有成功启动两个服务，可能是 win 系统不兼容，手动进 `screenshot` 目录安装依赖(`npm install`)并启动服务(`npm run dev`)
> 或者使用 VSCode 自带的终端来运行命令，不要使用 CMD。

合成图片时本地会启动一个 Chrome 浏览器实例。

### 打包

| 前端页面          | 图片生成服务                          |
| ----------------- | ------------------------------------- |
| `npm run v-build` | `cd sreenshot` <br /> `npm run build` |

### 服务端

根据你的具体场景自行实现，目前本项目中的所有服务端接口可参考：[接口 API 文档](https://xp.palxp.com/apidoc/index.html)。

### 图片生成服务

代码位于 [screenshots/](https://github.com/palxiao/poster-design/tree/main/screenshot) 目录下，查看[接口 API 文档](https://xp.palxp.com/apidoc/screenshot.html)。

> 打包注意事项与服务器配置相关请进入该目录下查看 README 文件说明。

### Docker 容器部署

可以通过 Docker 运行一个带 Linux 浏览器的容器，[参考说明](https://xp.palxp.com/#/articles/1689319644311?id=docker%e5%ae%b9%e5%99%a8)。

### 感谢

本项目使用或参考了一些优秀开源项目，包括但不限于：

- [moveable](https://github.com/daybrush/moveable): 提供了画布中选择、拖动缩放等能力
- [html2canvas](https://github.com/niklasvh/html2canvas): 前端生成图片兜底方案
- [qr-code-styling](https://qr-code-styling.com/): 风格化二维码
- [sky](https://github.com/cfour-hi/sky): 参考了其 PSD 解析的代码实现

### Q&A

Q：**我想二次开发，但是不会编写代码，可以付费开发吗？**

A：抱歉，因本人时间精力有限，无法提供私有化部署或二次开发的服务，故不接受定制化开发的需求。如果您对项目有任何建议或意见，非常欢迎与我交流。

Q：**服务端源码不开源吗？**

A：考虑到服务端的开发语言、数据库类型都可能不尽相同，且分离代码出来有一定成本，所以暂时不考虑直接开源，只提供接口 API 文档供参考。目前服务端仅是一些简单的增删改查，自行实现的技术难度并不高。

### 其它

项目最早使用 Vue2 开发，后改用 Vue3 重构，所以有部分代码混合了 Options 写法。

或许你在工作中有这类需求，这个项目能给到你一些微薄帮助的话，那就再好不过了！

目前本项目也还在不断迭代中，有很多的不足之处，我也是一边学习一边成长。开源不易，希望看到这里的你可以给本项目点个 **Star** 支持一下~ 感谢！
