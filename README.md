**[在线体验网站](https://design.palxp.cn/)** | **[在线文档](https://xp.palxp.cn/)** | [常见问题](https://xp.palxp.cn/#/articles/1689323321667) | [性能压测](https://juejin.cn/post/7348288810722869300)

---

## 迅排设计

一款漂亮易用且功能强大的创意图片编辑器，对标稿定设计、创客贴、Canva 等商业产品。

适用于多种场景：海报图片生成、电商分享图、文章长图、视频/公众号封面等，无需下载软件即可轻松实现云端编辑、迅速完成图文排版。

[![](https://xp.palxp.cn/images/2023-7-16-1689500112694.gif)](https://design.palxp.cn/)

### 特点

- 丝滑的页面操作体验，丰富的交互细节，基础功能完善
- 采用服务端生成图片，确保多端出图统一性，支持各种 HTML5 特性
- 简易 AI 抠图工具，上传图片一键去除背景
- 技术栈：Vue3 、Vite5 、Pinia 、ElementPlus
- 图片生成：Puppeteer、Express

### 支持功能

- 导入 PSD 文件解析成模板、在线导出图片下载。
- 元素拖拽、组合、缩放、层级调整、对齐等操作。
- 图片素材插入、替换、裁剪，图片容器等功能。
- SVG 素材颜色、透明度编辑，文字花字组合。
- 支持图层管理、多画板管理、自适应画布。
- 吸附对齐、辅助引导线、标尺功能。
- 键盘快捷键、右键菜单快捷操作，复制删除等常用操作。
- 风格二维码编辑，支持单色、渐变、自定义 logo 等。
- 颜色调色板，原生级取色器颜色吸管（Chrome）。

## 快速开始

```
git clone https://github.com/palxiao/poster-design.git
cd poster-design
npm run prepared
npm run dev
cd screenshot
npm run dev
```

![](https://xp.palxp.cn/images/2023-7-16-1689498291322.png)

访问 http://127.0.0.1:5173/ 查看网页。点此查看[更多说明文档](https://xp.palxp.cn/#/articles/1689319644311)。

### 图片生成服务

代码位于根目录 [/screenshot](https://github.com/palxiao/poster-design/tree/main/screenshot)，接口API文档点此查看：[接口 API 文档](https://xp.palxp.cn/apidoc/screenshot.html)。

### 服务端

后端需要自己开发，目前本项目演示 Demo 中的后端接口参考：[接口 API 文档](https://xp.palxp.cn/apidoc/index.html)。

### 其它

一些问题修改与记录[点击这里查看](https://xp.palxp.cn/#/articles/1689319986889?id=%e8%bf%ad%e4%bb%a3%e8%ae%a1%e5%88%92)，项目持续迭代中，还有很多不足，可以将你遇到的问题在 Issues 中提出，或者提交 Pull Request 帮助完善。

### 交流群

关注公众号：品味前端，回复 “加群” 获取二维码，更新公告不错过。

<img style="width: 380px;" src="https://xp.palxp.cn/images/2024-3-1-1709306365949.png" />

### 感谢

项目还使用或参考了一些优秀开源项目，包括但不限于：

- [moveable](https://github.com/daybrush/moveable): 提供了画布中选择、拖动缩放等能力
- [html2canvas](https://github.com/niklasvh/html2canvas): 前端生图的一种快捷方案
- [qr-code-styling](https://qr-code-styling.com/): 风格化二维码
- [rembg](https://github.com/danielgatis/rembg): 图片抠图，使用 u2net 预训练模型

开源不易，最后别忘了给本项目点个 **Star** ~

[![Star History Chart](https://api.star-history.com/svg?repos=palxiao/poster-design&type=Date)](https://star-history.com/#palxiao/poster-design&Date)

### `Star`

感谢所有支持本项目的朋友 :heart:

[![Stargazers](https://bytecrank.com/nastyox/reporoster/php/stargazersSVG.php?user=palxiao&repo=poster-design)](https://github.com/palxiao/poster-design/stargazers)

### `Fork`

这些小伙伴都在使用迅排设计 :heart:

[![Forkers](https://bytecrank.com/nastyox/reporoster/php/forkersSVG.php?user=palxiao&repo=poster-design)](https://github.com/palxiao/poster-design/network/members)

### 友情赞助商

| Dooring低代码 | DrawOn桌案 |
| --- | --- |
| <a href="https://dooring.vip/"> <img style="height: 90px" src="https://github.com/palxiao/poster-design/assets/21021314/2240801f-8484-4fd2-8505-8205daa6d53c" /></a> | <a href="https://www.drawon.cn?useSource=hb1"> <img style="height: 120px" src="https://github.com/palxiao/poster-design/assets/21021314/258bb6ec-4e1e-4c86-b45c-22946213f209" /></a> |

### `Contributions`

<a href="https://github.com/palxiao/poster-design/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=palxiao/poster-design" />
</a>

### `LICENSE`

本项目完全免费，可在保留 [MIT 开源许可证](https://github.com/palxiao/poster-design/blob/main/LICENSE) 的前提下使用。

