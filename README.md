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

一个开箱即用，零开发可部署生产的 AI 海报编辑器、在线创意图片设计工具，简洁好用、易于开发，最初灵感是模仿稿定设计等产品。

全新开源版 2.0 增加了免费的 AI 功能，且相比旧版拥有完整的后台管理与接口，真正做到开箱即用，旧版请访问 mit-version 分支。

[![](https://xp.palxp.cn/images/2023-7-16-1689500112694.gif)](https://design.palxp.cn/)

适用于多种场景：海报图片生成、电商分享图、文章长图、视频/公众号封面等，轻松实现创意，迅速完成图文排版，设计如此简单！

<p align="center">
<a href="https://design.palxp.cn/">访问迅排设计 SaaS 官网</a> | <a href="https://xp.palxp.cn/">项目文档(旧版)</a>
</p>

### 开源版 2.0 部分预览

| 编辑器100%全功能可用 | 高级文字、图片编辑工具 |
| --- | --- |
| <img width="1623" height="1037" alt="image" src="https://github.com/user-attachments/assets/69ef4fd0-4d83-48a0-8528-051e1159ef1e" /> | <img width="1243" height="826" alt="image" src="https://github.com/user-attachments/assets/d70a39cd-b28d-4b76-ab43-9c392a57e561" /> |

| 内置免费 AI 生图、文案 | AI 抠图，无需部署 |
| --- | --- |
| <img width="1316" height="790" alt="image" src="https://github.com/user-attachments/assets/4f0a2c9c-1774-4263-aba7-f51fd20d9220" /> | <img width="1582" height="978" alt="image" src="https://github.com/user-attachments/assets/9ba2177e-2ea4-4d03-9f5f-cb54a85a7383" /> |

<p align="center">
<img width="1132" height="584" alt="image" src="https://github.com/user-attachments/assets/c7400975-4da1-424f-87f8-19152cbc5f4a" />
</p>

### 项目特点

- 交互与细节丰富，基础功能完善
- 原生 DOM 画布编辑器，操作体验丝滑
- 前端 + 服务端混合出图，维护门槛低，极易上手开发
- 支持导入 PSD 设计文件解析辅助生成模板
- AI 抠图工具一键去除背景，支持画笔修补擦除
- 主要技术栈：Vue3 、Vite5 、Pinia 、TypeScript
- 运行时与框架：Node.js + Express + ElementPlus
- 图片合成：Puppeteer（后端）内置并发队列与熔断阈值、Html2canvas（前端）
- 图像处理：sharp
- 数据库：better-sqlite3（内嵌 SQLite，DB：`service/data/poster.db`，WAL 模式）
- 上传解析：body-parser、multiparty

### 快速开始

```
git clone https://github.com/palxiao/poster-design.git
cd poster-design
npm run prepared
npm run serve
```

输入网址 http://127.0.0.1:5173/ 访问站点，如遇失败请拆开命令运行，更多详情[参阅文档(旧)](https://xp.palxp.cn/#/articles/1689319644311)。

管理后台：http://127.0.0.1:5173/admin（仅管理员可访问）
默认管理员账号：admin、密码：123456

### 后端 & 图片生成

本项目的后端服务（位于 [/service](https://github.com/palxiao/poster-design/tree/main/service)），提供海报截图、文件上传、用户/管理员认证、模板与素材存取等接口。

生成的图片与用户上传文件落盘到 `static/` 目录后，由服务以 `/static/*` 路径对外暴露。管理后台相关接口（模板/素材/用户图片/分类管理）由 `requireAdmin` 中间件鉴权保护。

注：早期版本的 [接口 API 文档](https://xp.palxp.cn/apidoc/index.html) 仍可作为部分接口形态的参考范本。

### 部署上线

1. 构建前端：根目录执行 `npm run build`，产物在 `dist/`（AI 抠图模型 `public/models/` 与 onnxruntime 运行时 `public/ort/` 会一并拷入产物，随仓库分发，无需额外下载）。
2. 启动后端：`service` 目录安装依赖后执行 `npm run build && npm run serverstart`（pm2），或 `npm run serve` 直接运行。
3. 反向代理：前端与后端同源部署，将 `/api`、`/design`、`/static` 转发到后端端口（默认 `7001`）。若前后端不同源，构建时设置环境变量 `VITE_API_URL=https://你的后端地址` 即可。
4. 安全事项：
   - 管理员默认账号 `admin / 123456`，**首次登录后请立即修改密码**；
   - 登录态使用 JWT，生产环境务必通过环境变量配置服务端密钥（见 `service/src/configs.ts`），不要使用默认值；
   - SQLite 为 WAL 模式，备份/迁移时请将 `poster.db`、`poster.db-shm`、`poster.db-wal` 三个文件一并处理，或先停服后再拷贝。

### `Star` 仓库

开源不易，别忘了给本项目点个 **Star** ~ 您的支持是对开源作者最大的鼓励 :heart:

[![Star History Chart](https://api.star-history.com/chart?repos=palxiao/poster-design&type=date&legend=top-left&sealed_token=9jTOGHY5QQTM4AMJnl_kl2k_gpBHryAWKtzE0LxROivWVyq_NkxYrv90TUQ1rimbI60wmvUcFLzJ3Rbk3fcaduZP9kK1VWymajOMXjGZva0czGEn8lYtgehwqDB7Zhw_ibK7YGCPD9F6-gb-2UKc0MRzVuyCBqQSfAeXx8wLFwT8AANF2LjR9-hGzFuI)](https://www.star-history.com/?repos=palxiao%2Fposter-design&type=date&legend=top-left)

每一个 Star 都是我不断前进的动力 :heart:

[![Stargazers](https://bytecrank.com/nastyox/reporoster/php/stargazersSVG.php?user=palxiao&repo=poster-design)](https://github.com/palxiao/poster-design/stargazers)

### 交流群

了解项目最新动态、交流前端全栈技术：欢迎关注公众号《品味前端》，回复“加群”或添加作者微信。

<img style="width: 380px;" src="https://xp.palxp.cn/images/2024-3-1-1709306365949.png" />

### 附功能清单

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

#### 服务端数据与接口

1. 使用 SQLite 持久化模板、组件、分类、字体、用户、作品和图片数据，启动时自动执行表结构迁移。

2. 文件上传接口支持 multipart/form-data 图片及字体文件上传，文件保存到 `static/` 目录。

项目使用/参考了一些优秀开源项目，感谢这些开源项目作者所做出的杰出贡献，包括但不限于：

- [moveable](https://github.com/daybrush/moveable): 提供了画布中选择、拖动缩放等能力
- [html2canvas](https://github.com/niklasvh/html2canvas): 前端出图的简单方案
- [qr-code-styling](https://qr-code-styling.com/): 生成风格化二维码
- [rembg](https://github.com/danielgatis/rembg) / [rembg-web](https://github.com/bunnio/rembg-web): 浏览器端 AI 自动抠图（onnxruntime-web + u2netp 轻量模型，约 4.7MB，首次使用时自动加载，无需后端服务）

### 社区合作伙伴

| LeaferJS |
| --- |
| <a href="https://www.leaferjs.com/"> <img style="height: 64px" src="https://github.com/user-attachments/assets/def32ec0-67ff-486e-a5ca-16f95dab290b" /></a> |

### `LICENSE`

本项目遵循 [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.zh-cn.html) 开源协议，[中文版开源许可说明](https://github.com/palxiao/poster-design?tab=AGPL-3.0-1-ov-file)。

### 技术支持

开源版作为迅排设计早期项目底座，功能比较有限，只适合二开和学习研究。如果您有明确的业务需求，想快速开发部署一个更完善、稳定且强大的在线设计站点，可以了解：[迅排 Plus 服务](https://plus.palxp.cn/)，我们提供定制开发、企业私有化部署等全方位技术服务。过去迅排花费了数年时间潜心打磨编辑器项目，已服务了 20+ 中小企业和上市公司，产品经历大量实际验证，且广受好评，诚挚欢迎洽谈合作。


## 🌐 Web Resources & Interactive Index
- [PUSH PUSH CAT](https://skillplay.github.io/push-push-cat.html)
- [MINE FPS SHOOTER NOOB ARENA](https://thelearnquesters.pages.dev/mine-fps-shooter-noob-arena.html)
- [SORTING FROGS](https://studyplayings.web.app/sorting-frogs.html)
- [CATEGORY TRAIN YOUR BRAIN24](https://studyplayings.pages.dev/category-train-your-brain24.html)
- [JELI2D](https://studyplayings.web.app/jeli2d.html)
- [ASMR BEAUTY CLINIC](https://learnquester.pages.dev/asmr-beauty-clinic.html)
- [CIRCLE RUN ENDLESS](https://studyplayings.pages.dev/circle-run-endless.html)
- [CATEGORY DESTROY](https://studyplayings.pages.dev/category-destroy.html)
- [BEAM DRIVE CAR CRASH TEST SIMULATOR](https://studyplayings.pages.dev/beam-drive-car-crash-test-simulator.html)
- [BIG BLOCK BLAST](https://learnquester.github.io/big-block-blast.html)
- [2048 MAYHEMIO](https://learnquester.github.io/2048-mayhemio.html)
- [COLOR SCREW RESCUE PUZZLE](https://studyplayings.web.app/color-screw-rescue-puzzle.html)
- [CATEGORY THINKY](https://thelearnquester.web.app/category-thinky.html)
- [FITNESS CLUB 3D](https://studyplayings.web.app/fitness-club-3d.html)
- [CATEGORY RACING DRIVING](https://studyplayings.pages.dev/category-racing-driving.html)
- [CATEGORY CASUAL 9](https://studyquests.github.io/category-casual-9.html)
- [THE SORT AGENCY](https://studyplayings.web.app/the-sort-agency.html)
- [CATEGORY CASUAL 17](https://thelearnquesters.pages.dev/category-casual-17.html)
- [SEA MONSTERS MAHJONG](https://learnquesters.pages.dev/sea-monsters-mahjong.html)
- [TRIANGLE WAY](https://quizverses.pages.dev/triangle-way.html)
- [CATEGORY MOUSE1 707](https://quizverses.pages.dev/category-mouse1-707.html)
- [HOOP RIVALS](https://quizverses.pages.dev/hoop-rivals.html)
- [CATEGORY FASHION105](https://learnquesters.pages.dev/category-fashion105.html)
- [ANIMAL BLOCKS](https://studyplayings.web.app/animal-blocks.html)
- [CATEGORY TURN BASED30](https://quizverses.github.io/category-turn-based30.html)
- [SLIPPERY DRIFT RACING](https://studyplayings.web.app/slippery-drift-racing.html)
- [INDEX39](https://thelearnquesters.pages.dev/index39.html)
- [SLIME ATTACK PUZZLE](https://studyplayings.web.app/slime-attack-puzzle.html)
- [COOL CARS RACING AT ALTITUDE](https://learnquesters.pages.dev/cool-cars-racing-at-altitude.html)
- [CATEGORY MAHJONG](https://quizverses.github.io/category-mahjong.html)
- [SUPER STAR ANIMAL SALON](https://thelearnquester.web.app/super-star-animal-salon.html)
- [INDEX2](https://studyquests.github.io/index2.html)
- [BOLTS AND NUTS PUZZLE](https://learnquesters.pages.dev/bolts-and-nuts-puzzle.html)
- [COZY GARDEN IDLE](https://studyplayings.web.app/cozy-garden-idle.html)
- [CATEGORY HERO72](https://studyplayings.pages.dev/category-hero72.html)
- [ONE HERO](https://studyplayings.web.app/one-hero.html)
- [CATEGORY SHOOTER 2](https://studyplayings.pages.dev/category-shooter-2.html)
- [CATEGORY DEEP IMMERSIVE24](https://quizverses.github.io/category-deep-immersive24.html)
- [CATEGORY ESCAPE](https://studyplayings.pages.dev/category-escape.html)
- [CATEGORY IDLE448](https://quizverses.github.io/category-idle448.html)
- [CATEGORY STRATEGY](https://quizverses.github.io/category-strategy.html)
- [2048 MAYHEMIO](https://studyplayings.web.app/2048-mayhemio.html)
- [IDLE TRADE ROUTES](https://thelearnquester.web.app/idle-trade-routes.html)
- [SPRUNKI 3D SHOOTER](https://studyquests.github.io/sprunki-3d-shooter.html)
- [GARDEN GUARDIANS](https://studyquests.github.io/garden-guardians.html)
- [CATEGORY SOCCER 2](https://studyplayings.pages.dev/category-soccer-2.html)
- [CATEGORY SOCCER 3](https://quizverses.github.io/category-soccer-3.html)
- [WORLD SOCCER](https://studyplayings.web.app/world-soccer.html)
- [CATEGORY SIMULATION 3](https://quizverses.pages.dev/category-simulation-3.html)
- [BUBBLE SHOOTER TEMPLE JEWELS](https://learnquesters.pages.dev/bubble-shooter-temple-jewels.html)
- [CATEGORY TOWER DEFENSE 2](https://quizverses.pages.dev/category-tower-defense-2.html)
- [CANDY MAKER DESSERT GAMES](https://learnquester.pages.dev/candy-maker-dessert-games.html)
- [LAST PLAY RAGDOLL SANDBOX KQB](https://studyquests.github.io/last-play-ragdoll-sandbox-kqb.html)
- [CATEGORY TRAFFIC34](https://studyquests.github.io/category-traffic34.html)
- [MR DRIFTER CAR CHASE SIMULATOR](https://quizverses.pages.dev/mr-drifter-car-chase-simulator.html)
- [SPRUNKI PUZZLES AND SINGING](https://thelearnquester.web.app/sprunki-puzzles-and-singing.html)
- [DRAW TO HOME 3D](https://learnquester.github.io/draw-to-home-3d.html)
- [MUSTANG CITY DRIVER](https://studyplayings.web.app/mustang-city-driver.html)
- [ELEMENTZ](https://thelearnquester.web.app/elementz.html)
- [CATEGORY ESCAPE 2](https://studyplayings.pages.dev/category-escape-2.html)
- [LOST PUPPY RESCUE AND CARE](https://studyquests.github.io/lost-puppy-rescue-and-care.html)
- [SQUID SPRUNKI SLITHER GAME 2](https://studyplayings.web.app/squid-sprunki-slither-game-2.html)
- [IDLE TOWN BILLIONAIRE](https://studyquests.github.io/idle-town-billionaire.html)
- [FRUIT PARTY](https://thelearnquester.web.app/fruit-party.html)
- [SERIOUS BRO](https://learnquester.pages.dev/serious-bro.html)
- [CAPYBARA SUIKA](https://quizverses.pages.dev/capybara-suika.html)
- [HYDRO RACING 3D](https://quizverses.pages.dev/hydro-racing-3d.html)
- [POWERWASH SIMULATOR 3D WASH](https://quizverses.pages.dev/powerwash-simulator-3d-wash.html)
- [MERGE CUBE CHALLENGE](https://quizverses.pages.dev/merge-cube-challenge.html)
- [CATEGORY IDLE](https://quizverses.github.io/category-idle.html)
- [CATEGORY IDLE CLICKER GAME](https://quizverses.pages.dev/category-idle-clicker-game.html)
- [CATEGORY RPG80](https://studyplayings.pages.dev/category-rpg80.html)
- [CATEGORY SOCCER 2](https://studyquests.github.io/category-soccer-2.html)
- [CATEGORY JUMPING147](https://quizverses.github.io/category-jumping147.html)
- [DIRTY THEM ALL](https://quizverses-9d2f2.web.app/dirty-them-all.html)
- [CATEGORY SPACE](https://quizverses-9d2f2.web.app/category-space.html)
- [GRANNY GTA VEGAS](https://studyquests.github.io/granny-gta-vegas.html)
- [CATEGORY SKILL254](https://studyplayings.pages.dev/category-skill254.html)
- [CATEGORY RACING DRIVING 2](https://studyquests.github.io/category-racing-driving-2.html)
- [CATEGORY PUZZLE 6](https://studyquests.github.io/category-puzzle-6.html)
- [CATEGORY SNIPER39](https://studyquests.github.io/category-sniper39.html)
- [LITTLE ALCHEMY](https://quizverses-9d2f2.web.app/little-alchemy.html)
- [CATEGORY TOWER DEFENSE](https://quizverses.github.io/category-tower-defense.html)
- [CATEGORY COLOR197](https://studyplayings.pages.dev/category-color197.html)
- [THE ROMAN EMPIRE COLOSSEUM](https://learnquester.pages.dev/the-roman-empire-colosseum.html)
- [CATEGORY SCHOOL UNBLOCKER](https://studyquests.github.io/category-school-unblocker.html)
- [SUGAR HEROES](https://learnquester.pages.dev/sugar-heroes.html)
- [CATEGORY TOP DOWN251](https://quizverses.github.io/category-top-down251.html)
- [CATEGORY ADVENTURE](https://thelearnquesters.pages.dev/category-adventure.html)
- [TAPKO](https://studyplayings.web.app/tapko.html)
- [BACKGAMMON DUEL](https://quizverses.pages.dev/backgammon-duel.html)
- [HOSPITAL INC](https://thelearnquester.web.app/hospital-inc.html)
- [NUTS BOLTS WOOD PUZZLE GAME](https://studyplayings.web.app/nuts-bolts-wood-puzzle-game.html)
- [SHELF SHIFT MATCH](https://quizverses.pages.dev/shelf-shift-match.html)
- [CATEGORY SCHOOL](https://studyquests.github.io/category-school.html)
- [DIEPIO](https://quizverses.github.io/diepio.html)
- [CATEGORY ARENA255](https://thelearnquesters.pages.dev/category-arena255.html)
- [CATEGORY EXPLOIT](https://studyplayings.pages.dev/category-exploit.html)
- [MANSION STORY MATCH](https://studyplayings.web.app/mansion-story-match.html)
- [CATEGORY CAR 2](https://studyplayings.pages.dev/category-car-2.html)
- [MALL ANOMALY](https://studyplayings.web.app/mall-anomaly.html)
- [HERO RABBIT IDLE SURVIVOR RPG](https://quizverses.github.io/hero-rabbit-idle-survivor-rpg.html)
- [DAILY CHESS PUZZLE](https://studyplayings.web.app/daily-chess-puzzle.html)
- [EGG FARM](https://thelearnquester.web.app/egg-farm.html)
- [PAWS OFF MY CLUES](https://studyplaying.github.io/paws-off-my-clues.html)
- [CATEGORY SIMULATION 3](https://studyplayings.pages.dev/category-simulation-3.html)
- [CUTE COLORING GAMES](https://learnquesters.pages.dev/cute-coloring-games.html)
- [MEMEVOIO](https://studyquests.github.io/memevoio.html)
- [CAR PAINT](https://studyquests.github.io/car-paint.html)
- [CATEGORY SNAKE40](https://studyquests.github.io/category-snake40.html)
- [BUILD AND RUN](https://quizverses.github.io/build-and-run.html)
- [ARROW ESCAPE](https://quizverses.github.io/arrow-escape.html)
- [SUPER FOOTBALL FEVER](https://learnquesters.pages.dev/super-football-fever.html)
- [FUNNY BALLS 2048](https://studyplayings.web.app/funny-balls-2048.html)
- [CELEBRITY SPRING FASHION TRENDS](https://studyplayings.web.app/celebrity-spring-fashion-trends.html)
- [COLOR MIX JELLY MERGE](https://studyquests.github.io/color-mix-jelly-merge.html)
- [SUDOKU BRAIN BLOCKS](https://studyquests.github.io/sudoku-brain-blocks.html)
- [PATTERNS](https://quizverses-9d2f2.web.app/patterns.html)
- [MEMORY WARS](https://quizverses-9d2f2.web.app/memory-wars.html)
- [ARCHERS RANDOM](https://quizverses-9d2f2.web.app/archers-random.html)
- [FARM OF WORDS](https://studyplayings.web.app/farm-of-words.html)
- [CATEGORY BASKETBALL](https://studyquests.github.io/category-basketball.html)
- [MAGIC PIANO MUSIC](https://learnquester.github.io/magic-piano-music.html)
- [OPENGUESSR](https://studyplaying.github.io/openguessr.html)
- [ESCAPE AGAIN](https://studyplayings.web.app/escape-again.html)
- [CATEGORY UNBLOCKER](https://learnquester.github.io/category-unblocker.html)
- [ACOX RUNNER](https://quizverses.github.io/acox-runner.html)
- [SUPER RACING GT DRAG PRO](https://studyplayings.pages.dev/super-racing-gt-drag-pro.html)
- [CATEGORY SHOOTER](https://studyquests.github.io/category-shooter.html)
- [MAHJONG CONNECT SPOOKY](https://quizverses.github.io/mahjong-connect-spooky.html)
