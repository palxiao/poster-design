**[在线体验网址](https://design.palxp.cn/)** | **[中文文档](https://xp.palxp.cn/)** | [常见问题](https://xp.palxp.cn/#/articles/1689323321667) | [架构说明](https://xp.palxp.cn/#/articles/1689321259854)

---

## 迅排设计

一款漂亮且功能强大的在线海报图片设计器，仿稿定设计。

适用于海报图片生成、电商分享图、文章长图、视频/公众号封面等多种场景。

[![](https://xp.palxp.cn/images/2023-7-16-1689500112694.gif)](https://design.palxp.cn/)

- 丝滑的页面操作体验，丰富的交互细节，基础功能完善
- 采用服务端生成图片，能确保多端出图统一性，支持各种 CSS 特性
- 简易 AI 抠图工具，上传图片一键去除背景
- 技术栈：Vue3 、Vite2 、Vuex 、ElementPlus，开发体验畅快
- 图片生成：Puppeteer、Express

### 支持功能

- 导入 PSD 文件解析成模板、在线导出图片下载。
- 元素拖拽、组合、缩放、层级调整、对齐等操作。
- 图片素材插入、替换、裁剪，图片容器等功能。
- SVG 素材颜色、透明度编辑，文字花字组合。
- 画布自定义尺寸、滚轮缩放、自适应画布
- 吸附对齐、辅助引导线、标尺功能。
- 键盘快捷键、右键菜单快捷操作，复制删除等常用操作。
- 风格二维码编辑，支持单色、渐变、自定义 logo 等。
- 图层操作，支持拖拽变更层级。
- 颜色调色板，原生级取色器颜色吸管（Chrome）。

## 快速开始

```
git clone https://github.com/palxiao/poster-design.git
cd poster-design
npm run prepared
npm run serve
```

![](https://xp.palxp.cn/images/2023-7-16-1689498291322.png)

访问 http://127.0.0.1:3000/ 查看网页。点此查看[完整说明文档](https://xp.palxp.cn/#/articles/1689319644311)。

### 图片生成服务

代码位于根目录 [/screenshot](https://github.com/palxiao/poster-design/tree/main/screenshot)，接口API文档点此查看：[接口 API 文档](https://xp.palxp.cn/apidoc/screenshot.html)。

> 更多相关事项请进入该目录下查看 [README.md](https://github.com/palxiao/poster-design/blob/main/screenshot/README.md) 文件。 Docker 部署：[参考说明](https://xp.palxp.cn/#/articles/1689319644311?id=docker%e5%ae%b9%e5%99%a8)。

### 服务端

目前本项目演示 Demo 中的后端接口参考：[接口 API 文档](https://xp.palxp.cn/apidoc/index.html)。

## 其它

本项目最早使用 Vue2 开发，现改用 Vue3 重构中。[一些迭代计划记录](https://xp.palxp.cn/#/articles/1689319986889?id=%e8%bf%ad%e4%bb%a3%e8%ae%a1%e5%88%92).

目前开源版仍在持续迭代中，还有很多的不足，我的目标是做一款能对标稿定设计、创客贴、Canva等商业产品的强大在线设计器。

### 感谢

项目还使用或参考了一些优秀开源项目，包括但不限于：

- [moveable](https://github.com/daybrush/moveable): 提供了画布中选择、拖动缩放等能力
- [html2canvas](https://github.com/niklasvh/html2canvas): 前端生图的一种快捷方案
- [qr-code-styling](https://qr-code-styling.com/): 风格化二维码
- [rembg](https://github.com/danielgatis/rembg): 图片抠图，使用 u2net 预训练模型

### 交流群

| 作者微信：备注加群 | 关注公众号 |
| --- | --- |
| <img style="width: 240px;" src="https://xp.palxp.cn/images/2024-3-1-1709306328344.png" /> | <img style="width: 320px;" src="https://xp.palxp.cn/images/2024-3-1-1709306365949.png" /> |

开源不易，别忘了给本项目点个 **Star** ~

[![Star History Chart](https://api.star-history.com/svg?repos=palxiao/poster-design&type=Date)](https://star-history.com/#palxiao/poster-design&Date)

### `Star`

感谢所有支持本项目的朋友 :heart:

[![Stargazers](https://bytecrank.com/nastyox/reporoster/php/stargazersSVG.php?user=palxiao&repo=poster-design)](https://github.com/palxiao/poster-design/stargazers)

### `Fork`

这些小伙伴都在使用迅排设计 :heart:

[![Forkers](https://bytecrank.com/nastyox/reporoster/php/forkersSVG.php?user=palxiao&repo=poster-design)](https://github.com/palxiao/poster-design/network/members)

### 友情赞助商

[![](https://xp.palxp.cn/images/2024-3-3-1709450701432.png)](https://dooring.vip/)

### `Contributions`

<a href="https://github.com/palxiao/poster-design/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=palxiao/poster-design" />
</a>

### `LICENSE`

本项目完全免费，遵循 [MIT 开源许可证](https://github.com/palxiao/poster-design/blob/main/LICENSE)

