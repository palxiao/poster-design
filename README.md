<p align="center">
<img style="height: 90px" src="https://github.com/user-attachments/assets/e2b8c788-aded-4b1a-83ee-9bde124f5808" alt="迅排设计 Poster Design 2.0">
</p>
<p align="center">
  迅排设计 AI Poster Design 2.0
</p>
<p align="center">
<a href="https://trendshift.io/repositories/8728" target="_blank"><img src="https://trendshift.io/api/badge/repositories/8728" alt="poster-design | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>
  <a href="https://hellogithub.com/repository/56a75cfc34da43549d2bb46dab305ba2" target="_blank"><img src="https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=56a75cfc34da43549d2bb46dab305ba2&claim_uid=fb0Nckng89FvyzP&theme=neutral" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</p>

一个开箱即用、可零开发部署生产的开源 AI 海报设计器 / 在线图片设计工具：原生 DOM 画布编辑器，前端与服务端混合出图，附完整后台管理与接口，简洁好用、易于开发。

适用于多种场景：海报图片生成、电商图、文章长图、视频/公众号封面等，助力轻松实现创意，迅速图文排版，「迅排」让设计高效又简单！

<p align="center">
<a href="https://design.palxp.cn/">更多功能访问 SaaS 官网</a> | <a href="https://plus.palxp.cn/">企业定制开发 / 私有化部署</a> | <a href="https://xp.palxp.cn/">项目文档（旧版）</a>
</p>

[![](https://xp.palxp.cn/images/2023-7-16-1689500112694.gif)](https://design.palxp.cn/)

全新开源版 2.0 增加了免费的 AI 功能，且相比旧版拥有完整的后台管理与接口，真正做到开箱即用，旧版请访问 mit-version 分支。

### 开源版 2.0 部分预览

| 编辑器100%全功能可用 | 高级文字、图片编辑工具 |
| --- | --- |
| <img width="1623" height="1037" alt="image" src="https://github.com/user-attachments/assets/69ef4fd0-4d83-48a0-8528-051e1159ef1e" /> | <img width="1243" height="826" alt="image" src="https://github.com/user-attachments/assets/d70a39cd-b28d-4b76-ab43-9c392a57e561" /> |

| 内置免费 AI 生图、文案 | AI 抠图，无需部署 |
| --- | --- |
| <img width="1316" height="790" alt="image" src="https://github.com/user-attachments/assets/4f0a2c9c-1774-4263-aba7-f51fd20d9220" /> | <img width="1582" height="978" alt="image" src="https://github.com/user-attachments/assets/9ba2177e-2ea4-4d03-9f5f-cb54a85a7383" /> |

### 项目特点

- 界面美观细节丰富，基础功能完善非Demo项目可比
- 原生 DOM 画布 + 服务端出图，操作体验丝滑，开发门槛低极易上手
- 支持导入 PSD 设计文件解析辅助生成模板
- AI 抠图工具一键去除背景，支持画笔修补擦除
- 主要技术栈与框架：Vue3 、Vite5 、Pinia 、TypeScript，Node.js + Express + ElementPlus
- 图片合成：Puppeteer（后端）、Html2canvas（前端），图像处理：sharp
- 数据库：better-sqlite3（内嵌 SQLite，DB：`service/data/poster.db`）

### 本地开发

```
git clone https://github.com/palxiao/poster-design.git
cd poster-design
npm run prepared
npm run serve
```

输入网址 http://127.0.0.1:5173/ 访问站点（如中途失败请拆开命令运行），更多详情[参阅文档(旧)](https://xp.palxp.cn/#/articles/1689319644311)。

管理后台：http://127.0.0.1:5173/admin（管理员默认账号 `admin / 123456`）

### 后端 & 图片生成

本项目的后端服务（位于 [/service](https://github.com/palxiao/poster-design/tree/main/service)）。

生成的图片与用户上传文件落盘到 `static/` 目录后，由服务以 `/static/*` 路径对外暴露。管理后台相关接口（模板/素材/用户图片/分类管理）由 `requireAdmin` 中间件鉴权保护。

注：早期版本的 [接口 API 文档](https://xp.palxp.cn/apidoc/index.html) 仍可作为部分接口形态的参考范本。

### 部署上线

1. 构建前端：根目录执行 `npm run build`，产物在 `dist/`（AI 抠图模型 `public/models/` 与 onnxruntime 运行时 `public/ort/` 会一并拷入产物，随仓库分发，无需额外下载）。
2. 启动后端：`service` 目录安装依赖后执行 `npm run build && npm run serverstart`（pm2），或 `npm run serve` 直接运行。
3. 反向代理：前端与后端同源部署，将 `/api`、`/design`、`/static` 转发到后端端口（默认 `7001`）。若前后端不同源，构建时设置环境变量 `VITE_API_URL=https://你的后端地址` 即可。

------------

### 迅排 Plus：企业版与私有化部署

本仓库是**开源版**，已包含完整的编辑器、后台管理与 AI 能力（见上方功能清单），无需付费即可使用、二开与学习。

如果您需要更全面的企业交付形态，可以了解：[迅排 Plus](https://plus.palxp.cn/)，我们提供专业的付费技术服务。

<img width="1024" height="1024" alt="技术服务" src="https://github.com/user-attachments/assets/118e2e46-aed6-4631-a003-61c1c5262899" />

| 维度 | 开源版（本仓库） | 迅排 Plus |
| --- | --- | --- |
| 适用对象 | 个人开发者、学习研究、内部二次开发 | 企业业务团队、需对外交付的设计站点 |
| 部署方式 | 自部署（详见「部署上线」） | 企业私有化部署 |
| 交付与开发 | 社区 Issue 交流 + 自行二开 | 源码交付、定制开发 |
| 支持与保障 | 社区支持 | 专属技术服务与长期维护 |
| 客户基础 | 5000+ 开发者的选择 | 已服务 20+ 中小企业与上市公司 |

「迅排」过去数年时间潜心打磨编辑器项目，产品已历经大量实际验证并广受好评！

| PSD 解析能力拔群，效果精准还原 | 让客户的设计资产重燃商业价值 |
| --- | --- |
| <img width="1720" height="1040" alt="image" src="https://github.com/user-attachments/assets/d2b2baa5-aa86-45fa-b6ae-1f69f609ea8d" /> | <img width="1646" height="1016" alt="image" src="https://github.com/user-attachments/assets/22a55b85-75f6-4834-84c2-5a786cbffaa5" /> |

| 实物定制、印刷设计类商城开发 | 一件DIY设计下单，覆盖各种品类 |
| --- | --- |
| <img width="1474" height="1088" alt="image" src="https://github.com/user-attachments/assets/f9bfe2d2-0c5e-4a70-89a1-d40c62969cd7" /> | <img width="1299" height="941" alt="image" src="https://github.com/user-attachments/assets/ba67f67e-c706-4d3a-a7f0-c0eb54d968a9" /> |

| 图片一键转成可编辑模板 | 各类 AI 工具，聊天出图 |
| --- | --- |
| <img width="1080" height="729" alt="image" src="https://github.com/user-attachments/assets/2b1d2aaf-1416-4b9f-8c1f-fbd9cd7ff5b4" /> | <img width="1080" height="909" alt="image" src="https://github.com/user-attachments/assets/11772a64-9667-41e4-adf6-109459d19759" /> |

若您有设计资源、渠道优势，或怀揣任何可产品化的想法，我们都期待能与您共商合作：

<img style="width: 180px;" alt="联系方式" src="https://plus.palxp.cn/assets/images/contact/wx.jpg" />

--------------

### （附录）开源版功能清单

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

#### 用户与作品管理

1. 用户注册、登录及登录状态维护。

2. 用户保存设计作品，可继续编辑已保存作品。

3. 用户访问和删除自己的作品，下载和保存。

#### 管理后台

1. 管理员权限校验，仅管理员可访问后台接口。

2. 模板与组件分开管理，支持列表查看、删除、编辑基础信息及修改分类。

3. 支持查看和管理用户作品、用户上传图片及用户列表。

4. 用户上传图片绑定归属，普通用户仅能查看自己的图片，管理员可查看全部。

5. 分类管理：模板、组件、素材、图片四类分类的新增、重命名、删除及数量查看。

6. 字体管理：分页、搜索、新增、编辑、删除及 woff/woff2 文件上传。

7. AI 配置：兼容任意 OpenAI 格式接口（默认智谱开放平台），可在后台配置接口地址、API Key、文案/生图模型与生图尺寸档位，并在线测试连通性。

#### 服务端数据与接口

1. 使用 SQLite 持久化模板、组件、分类、字体、用户、作品和图片数据，启动时自动执行表结构迁移。

2. 文件上传接口支持 multipart/form-data 图片及字体文件上传，文件保存到 `static/` 目录。

本项目使用或参考了一些优秀开源项目，感谢这些开源项目做出的杰出贡献，包括但不限于：

- [moveable](https://github.com/daybrush/moveable): 提供了画布中选择、拖动缩放等能力
- [html2canvas](https://github.com/niklasvh/html2canvas): 前端出图的简单方案
- [qr-code-styling](https://qr-code-styling.com/): 生成风格化二维码
- [rembg](https://github.com/danielgatis/rembg) / [rembg-web](https://github.com/bunnio/rembg-web): 浏览器端 AI 自动抠图（onnxruntime-web + u2netp 轻量模型，约 4.7MB）

### `Star` 仓库

开源不易，看到这别忘了给本项目点个 **Star** ~ 您的支持是对开源作者最大的鼓励 :heart:

<a href="https://www.star-history.com/?repos=palxiao%2Fposter-design&type=date&legend=top-left" target="_blank">
  <img src="https://api.star-history.com/chart?repos=palxiao/poster-design&type=date&legend=top-left&sealed_token=9jTOGHY5QQTM4AMJnl_kl2k_gpBHryAWKtzE0LxROivWVyq_NkxYrv90TUQ1rimbI60wmvUcFLzJ3Rbk3fcaduZP9kK1VWymajOMXjGZva0czGEn8lYtgehwqDB7Zhw_ibK7YGCPD9F6-gb-2UKc0MRzVuyCBqQSfAeXx8wLFwT8AANF2LjR9-hGzFuI" alt="Star History Chart" />
</a>

### 交流群

欢迎关注作者公众号《品味前端》，回复“加群”或添加作者微信。

<img width="480" src="https://xp.palxp.cn/images/2024-3-1-1709306365949.png" />

### 社区合作伙伴

| LeaferJS |
| --- |
| <a href="https://www.leaferjs.com/"> <img style="height: 64px" src="https://github.com/user-attachments/assets/def32ec0-67ff-486e-a5ca-16f95dab290b" /></a> |

### 友情链接

| APIMart |
| --- |
| <a href="https://go.apimart.ai/tw-poster-design"> <img style="height: 92px" alt="image" src="https://github.com/user-attachments/assets/731a2d96-f42d-405d-999e-67b9f246c9ed" /></a> |

### `LICENSE`

本项目遵循 [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.zh-cn.html) 开源协议，[中文版开源许可说明](https://github.com/palxiao/poster-design/blob/main/LICENSE-ZH)。
