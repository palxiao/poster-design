<h2 align="center">迅排设计 - Poster Design</h2>

<p align="center">
<a href=""><img src="https://img.shields.io/github/stars/palxiao/poster-design?style=flat" alt="starts"></a>
<a href="https://github.com/palxiao/poster-design?tab=MIT-1-ov-file"><img src="https://img.shields.io/github/license/palxiao/poster-design?style=flat" alt="License"></a>
</p>

<p align="center">
<a href="https://trendshift.io/repositories/8728" target="_blank"><img src="https://trendshift.io/api/badge/repositories/8728" alt="palxiao%2Fposter-design | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>
</p>

漂亮易用且功能强大的在线创意图片编辑器，对标稿定设计、创客贴、Canva 等产品，开源免费。

适用于多种场景：海报图片生成、电商图文分享、制作文章长图、视频/公众号封面等，在线实现创意，迅速图文排版，设计就是如此简单！

[![](https://xp.palxp.cn/images/2023-7-16-1689500112694.gif)](https://design.palxp.cn/)

**[官方网站](https://design.palxp.cn/)** | **[在线文档](https://xp.palxp.cn/)** | [常见问题](https://xp.palxp.cn/#/articles/1689323321667) | [性能压测](https://juejin.cn/post/7348288810722869300)

- 丝滑的操作体验，丰富的交互细节，基础功能完善
- 服务端生成图片，支持各种 HTML5 特性
- 主要技术栈：Vue3 、Vite5 、Pinia 、ElementPlus、Puppeteer、Express

### 功能简介

- 导入 PSD 文件解析成模板、在线导出图片下载。
- 简易 AI 抠图工具，上传图片一键去除背景。
- 元素拖拽、组合、缩放、层级调整、对齐等操作。
- 图片素材插入、替换、裁剪，图片容器等功能。
- SVG 素材颜色、透明度编辑，文字花字组合。
- 支持图层管理、多画板管理、自适应画布。
- 吸附对齐、辅助引导线、标尺功能。
- 键盘快捷键、右键菜单快捷操作，复制删除等常用操作。
- 风格二维码编辑，支持单色、渐变、自定义 logo 等。
- 颜色调色板，原生级取色器颜色吸管（Chrome）。

### 快速开始

```
git clone https://github.com/palxiao/poster-design.git
cd poster-design
npm run prepared
npm run server
```

输入网址 http://127.0.0.1:5173/ 访问站点，更多参阅[详细说明文档](https://xp.palxp.cn/#/articles/1689319644311)。

### 服务端 & 图片生成

本仓库中所提供的后端代码仅为示例作用，目的在于帮助开发者更好地理解项目，实际生产则推荐根据自身需求进行开发。原项目中请求的远程 API 接口已不再适用，但 [接口 API 文档](https://xp.palxp.cn/apidoc/index.html) 仍具有一定参考性。

关于部署等说明请前往项目中查看，后端项目代码位于根目录 [/service](https://github.com/palxiao/poster-design/tree/main/service) 下。

### 其它

项目持续迭代中，还有很多不足，可以将你遇到的问题在 Issues 中提出，或者提交 Pull Request 帮助完善。

### 交流群

了解项目最新资讯、或技术交流，欢迎关注公众号《品味前端》；回复“加群”获取群号。

<img style="width: 380px;" src="https://xp.palxp.cn/images/2024-3-1-1709306365949.png" />

### 感谢

项目还使用或参考了一些优秀开源项目，包括但不限于：

- [moveable](https://github.com/daybrush/moveable): 提供了画布中选择、拖动缩放等能力
- [html2canvas](https://github.com/niklasvh/html2canvas): 前端出图的简单方案
- [qr-code-styling](https://qr-code-styling.com/): 生成风格化二维码
- [rembg](https://github.com/danielgatis/rembg): 图片自动抠图，使用 u2net 预训练模型

### `Star`

开源不易，最后别忘了给本项目点个 **Star** ~

[![Star History Chart](https://api.star-history.com/svg?repos=palxiao/poster-design&type=Date)](https://star-history.com/#palxiao/poster-design&Date)

感谢所有喜欢并支持本项目的朋友 :heart:

[![Stargazers](https://bytecrank.com/nastyox/reporoster/php/stargazersSVG.php?user=palxiao&repo=poster-design)](https://github.com/palxiao/poster-design/stargazers)

### 友情赞助商

| Dooring低代码 | DrawOn桌案 |
| --- | --- |
| <a href="https://dooring.vip/"> <img style="height: 90px" src="https://github.com/palxiao/poster-design/assets/21021314/2240801f-8484-4fd2-8505-8205daa6d53c" /></a> | <a href="https://www.drawon.cn?useSource=hb1"> <img style="height: 120px" src="https://github.com/palxiao/poster-design/assets/21021314/258bb6ec-4e1e-4c86-b45c-22946213f209" /></a> |

### `Contributions`

<a href="https://github.com/palxiao/poster-design/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=palxiao/poster-design" />
</a>

### `LICENSE`

本项目遵循 MIT 开源协议，如有疑问，建议仔细阅读并保留此 [中文版开源许可证](https://github.com/palxiao/poster-design?tab=License-2-ov-file)。
