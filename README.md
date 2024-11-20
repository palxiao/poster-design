<h2 align="center">迅排设计 - Poster Design</h2>

<p align="center">
<a href=""><img src="https://img.shields.io/github/stars/palxiao/poster-design?style=flat" alt="starts"></a>
<a href="https://github.com/palxiao/poster-design?tab=MIT-1-ov-file"><img src="https://img.shields.io/github/license/palxiao/poster-design?style=flat" alt="License"></a>
</p>

<p align="center">
<a href="https://design.palxp.cn/">迅排官方网站</a> | <a href="https://xp.palxp.cn/">在线文档</a> | <a href="https://xp.palxp.cn/#/articles/1689323321667">常见问题</a> | <a href="https://juejin.cn/post/7348288810722869300">性能压测</a>
</p>

<p align="center">
<a href="https://trendshift.io/repositories/8728" target="_blank"><img src="https://trendshift.io/api/badge/repositories/8728" alt="poster-design | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>
  <a href="https://hellogithub.com/repository/56a75cfc34da43549d2bb46dab305ba2" target="_blank"><img src="https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=56a75cfc34da43549d2bb46dab305ba2" alt="Featured｜HelloGitHub" style="width: 250px; height: 55px;" width="250" height="55" /></a>
</p>

漂亮易用的在线创意图片编辑器、海报设计器，仿造稿定设计等产品，开源、强大、好玩是我们的关键词。

适用于多种场景：海报图片生成、电商分享图、文章长图、视频/公众号封面等，轻松实现创意，迅速完成图文排版，设计如此简单！

[![](https://xp.palxp.cn/images/2023-7-16-1689500112694.gif)](https://design.palxp.cn/)

### 项目特点

- 丰富的交互细节，基础功能完善
- 原生 DOM 画布编辑器，操作体验丝滑，支持各种 HTML5 特性，扩展生态更方便
- 前端 + 服务端混合出图，确保高质量图像输出，准确还原网页细节和效果
- 支持导入 PSD 设计文件解析辅助生成模板
- AI 抠图工具一键去除背景，支持画笔修补擦除
- 技术栈：Vue3 、Vite5 、Pinia 、ElementPlus、Express
- 图片生成：Puppeteer、Html2canvas

### 快速开始

```
git clone https://github.com/palxiao/poster-design.git
cd poster-design
npm run prepared
npm run serve
```

输入网址 http://127.0.0.1:5173/ 访问站点，如遇失败请拆开命令运行，更多详情[参阅文档](https://xp.palxp.cn/#/articles/1689319644311)。

### 服务端 & 图片生成

本仓库中所提供的后端代码仅为示例作用，目的在于帮助开发者更好地理解项目，实际生产则根据自身需求进行开发。（原项目中请求的远程 API 接口已不再适用，但 [接口 API 文档](https://xp.palxp.cn/apidoc/index.html) 仍具有一定参考性）

关于部署等说明请前往项目中查看，后端项目代码位于根目录 [/service](https://github.com/palxiao/poster-design/tree/main/service) 下。

### 付费技术支持

支持基于开源版定制有限功能，帮助开发者节省研发时间和成本，并提供全方位技术指导与答疑。了解/获取技术支持请访问：[迅排 Plus 服务](https://plus.palxp.cn/)。

### 交流群

欢迎关注公众号《品味前端》，回复“加群”或添加作者微信，了解项目最新动态、交流前端全栈技术。

<img style="width: 380px;" src="https://xp.palxp.cn/images/2024-3-1-1709306365949.png" />

### `Star` 仓库

开源不易，别忘了给本项目点个 **Star** ~ 您的支持是对开源作者最大的鼓励 :heart:

[![Star History Chart](https://api.star-history.com/svg?repos=palxiao/poster-design&type=Date)](https://star-history.com/#palxiao/poster-design&Date)

每一个 Star 都是我不断前进的动力 :heart:

[![Stargazers](https://bytecrank.com/nastyox/reporoster/php/stargazersSVG.php?user=palxiao&repo=poster-design)](https://github.com/palxiao/poster-design/stargazers)

### `Contributions`

<a href="https://github.com/palxiao/poster-design/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=palxiao/poster-design" />
</a>

### 其它

项目持续迭代中，还有很多不足，可以将你遇到的问题在 Issues 中提出，或者提交 Pull Request 帮助完善。

### 详细功能清单

#### 基础设计功能

1. 元素拖拽放置操作，自由定位。

2. 组合与拆分操作，多个元素组合成一个整体。

3. 缩放操作。

4. 对齐与分布，支持水平、垂直对齐以及多个元素的均匀分布。

#### 文本功能

1. 基础文字编辑，支持修改字体、字号、颜色、斜体、下划线加粗、间距行距、对齐方式等。

2. 基于 CSS 的文字高级特效，如阴影、描边、渐变等，支持组合使用，创造丰富多样的文字效果。

3. 花字组合，文字与图片icon的自由组合组件。

#### 图像处理功能

1. 图片素材插入与替换，从本地或素材库插入图片。

2. 图片裁剪：支持圆角，或缩放裁剪显示区域以适应设计需求。

3. 图片蒙版/容器：可自定义容器填充图片，支持通过蒙版调整显示区域。

4. SVG 素材编辑颜色、透明度等属性。

#### 画布与画板设置

1. 自定义画布尺寸：支持拖动把手实时改变画布尺寸，内置尺寸预设。

2. 缩放功能：鼠标滚轮或点击进行画布的缩放。

3. 画布颜色或背景图片修改：支持单色、或渐变色背景。

4. 前端水印。

5. 历史记录，撤销重做。

6. 多画板支持：可以在作品中创建多个画板。

#### 辅助功能

1. PSD 解析：设计稿还原到网页，方便辅助创建模板。

2. 画笔修补擦除抠图工具。

3. 吸附线对齐线。

4. 标尺和辅助引导线。

5. 漫游导航：引导新手操作。

#### 快捷操作与交互

1. 键盘快捷键：复制、粘贴、撤销、重做、成组等。

2. 右键菜单：支持常见操作如复制、删除、层级调整等。

#### 二维码功能

1. 二维码生成：支持自定义二维码的颜色、大小、样式。

2. 二维码风格设置：支持单色、渐变色和自定义 logo 嵌入功能等。

#### 图层与颜色工具

1. 图层操作：自由拖拽元素变更层级、锁定/解锁图层等。

2. 调色板与吸色器：内置取色工具，从电脑画面中吸取颜色。

3. 渐变色支持：调色盘支持渐变色编辑，自由定制多个颜色节点、调整角度等。

### 感谢

项目使用或参考了一些优秀开源项目，包括但不限于：

- [moveable](https://github.com/daybrush/moveable): 提供了画布中选择、拖动缩放等能力
- [html2canvas](https://github.com/niklasvh/html2canvas): 前端出图的简单方案
- [qr-code-styling](https://qr-code-styling.com/): 生成风格化二维码
- [rembg](https://github.com/danielgatis/rembg): 图片自动抠图，使用 u2net 预训练模型

### 感谢以下伙伴打赏支持

| Dooring低代码 | DrawOn桌案 |
| --- | --- |
| <a href="https://dooring.vip/"> <img style="height: 90px" src="https://github.com/palxiao/poster-design/assets/21021314/2240801f-8484-4fd2-8505-8205daa6d53c" /></a> | <a href="https://www.drawon.cn?useSource=hb1"> <img style="height: 120px" src="https://github.com/palxiao/poster-design/assets/21021314/258bb6ec-4e1e-4c86-b45c-22946213f209" /></a> |

### `LICENSE`

本项目遵循 MIT 开源协议，如有疑问，建议仔细阅读并保留此 [中文版开源许可证](https://github.com/palxiao/poster-design?tab=License-2-ov-file)。
