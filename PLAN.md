# PLAN — Việt hóa giao diện TinixPoster

> Trạng thái: **Hoàn tất triển khai và nghiệm thu (2026-11-12)** — chưa commit

## 1. Mục tiêu

Toàn bộ giao diện người dùng (trình chỉnh sửa, trang quản trị `/admin`, hộp thoại, thông báo, lỗi trả về từ server, nội dung do AI sinh ra) hiển thị bằng **tiếng Việt**. Giữ **tiếng Anh** cho thuật ngữ mà dân thiết kế/kỹ thuật Việt quen dùng hơn bản dịch (xem §5).

### Non-goals

- Không dịch comment trong code, log console phía server, README/DESIGN.md (trừ phần token font bị thay đổi).
- Không dịch nội dung bên trong các template mẫu (chữ trên poster) — đó là dữ liệu, không phải UI.
- Không refactor ngoài phạm vi cần để tách chuỗi khỏi logic.

## 2. Hiện trạng (đã khảo sát)

| Hạng mục | Số file có chữ Hán | Dòng (không tính comment) |
|---|---|---|
| `src/views` (gồm `Admin.vue` 242 dòng) | 16 | ~300 |
| `src/components/modules` (layout, panel, widgets, settings) | 56 | ~200 |
| `src/components/business` (AI, login, cutout, QR…) | 21 | ~115 |
| `src/store`, `src/mixins`, `src/common`, `src/utils`, `src/assets/data` | ~60 | ~95 |
| `packages/color-picker`, `packages/image-extraction` | ~5 (UI) | ~50 |
| `service/src` (thông báo lỗi API, prompt AI) | 31 | ~150 |
| **Tổng** | | **~900–1.000 chuỗi** |

Hạ tầng sẵn có:

- `vue-i18n` 9 đã cài, `src/languages/index.ts` có `zh`/`en` nhưng **chỉ 5 key** (`header.save`, `header.download`…). Gần như mọi chuỗi đang hard-code tiếng Trung.
- `App.vue` chọn locale Element Plus theo `getBrowserLang()` (chỉ `zh`/`en`).
- Thương hiệu: `index.html` title và `src/config.ts` `APP_NAME = '迅排设计'`.

Rủi ro phát hiện khi khảo sát:

1. **Chuỗi tiếng Trung dùng làm giá trị logic** — dịch thẳng sẽ gây lỗi:
   - `packages/color-picker/index.vue`: `mode === '纯色' | '渐变' | '图案'`, prop `modes` mặc định `['纯色','渐变']`.
   - `src/components/modules/layout/designBoard/pageStyle.vue`: `state.mode === '颜色' | '图片' | '渐变'`.
   - `src/views/Admin.vue:776,824`: so sánh `res.msg === '请先登录'` (phụ thuộc nội dung thông báo server).
2. **Font**: UI stack bắt đầu bằng `Hiragino Sans GB / Microsoft YaHei` — dấu tiếng Việt (ế, ỗ, ự…) có thể hiển thị lệch/ghép sai. Font chữ mặc định trên canvas là `SourceHanSansSC-Regular` và chữ mặc định `'双击编辑文字'`.
3. **Độ dài chữ**: tiếng Việt dài gấp ~2–3 lần tiếng Trung → nhãn icon rail 12px, nút, tab, cột bảng admin dễ tràn/xuống dòng.
4. **Prompt AI** (`service/src/service/ai.ts`) viết bằng tiếng Trung → AI trả về văn án tiếng Trung.
5. **Dữ liệu seed** (`service/seed/poster.db`, `service/src/db/bootstrap.ts`): tên danh mục template/tư liệu bằng tiếng Trung, hiển thị trực tiếp trong panel.

## 3. Quyết định cần chốt trước khi làm

| # | Câu hỏi | Đề xuất |
|---|---|---|
| D1 | Trích chuỗi vào i18n (`vi` + `en` + giữ `zh`) **hay** thay thẳng chuỗi Trung bằng Việt? | **i18n, locale mặc định `vi`, fallback `en`**. Hạ tầng có sẵn, dễ merge upstream hơn về lâu dài, có tiếng Anh dự phòng. Không bảo trì bản `zh` mới (để file cũ, không bổ sung key). |
| D2 | Server (thông báo lỗi API) có cần đa ngôn ngữ? | **Không** — server trả tiếng Việt cố định; frontend chuyển sang so sánh `code` thay vì `msg`. |
| D3 | Tên ứng dụng | `APP_NAME = 'TinixPoster'` (theo tên repo) — cần xác nhận. |
| D4 | Có đổi tên danh mục trong seed DB không? | Có, bằng một migration nhỏ trong `service/src/db/bootstrap.ts`/seed (không đổi schema). |
| D5 | Nguồn font hỗ trợ tiếng Việt cho canvas | **Đã chốt: tự host woff2.** Be Vietnam Pro (OFL, @fontsource 5.3.0) gộp latin + latin-ext + vietnamese thành `service/seed/static/fonts/be-vietnam-pro-{400,700}.woff2`; seed vào DB (id 100/101) bởi `ensureVietnameseFonts` trong `bootstrap.ts`; là font mặc định của widget văn bản. |

## 4. Kiến trúc i18n (theo D1)

```text
src/languages/
  index.ts              locale mặc định 'vi', fallbackLocale 'en', lưu lựa chọn vào localStorage
  modules/vi/           nguồn chuẩn (source of truth)
    index.ts
    common.ts           nút chung: Lưu, Hủy, Xóa, Xác nhận…
    header.ts  editor.ts  panel.ts  widget.ts  settings.ts
    business.ts         ai, login, cutout, qrcode, cropper, download
    admin.ts            /admin
    message.ts          ElMessage / confirm / validate
  modules/en/           cùng cấu trúc key
```

- Template: `{{ $t('panel.text.add') }}`; `<script setup>`: `const { t } = useI18n()`; ngoài component (store, mixins, utils): `import i18n from '@/languages'` → `i18n.global.t(...)`.
- Key đặt theo khu vực + ý nghĩa (`widget.image.replace`), không theo nội dung tiếng Trung.
- `App.vue`: map locale Element Plus `vi` (`element-plus/es/locale/lang/vi`) / `en`; `dayjs.locale('vi')` nếu có dùng hiển thị ngày.
- Locale luôn khởi tạo là `vi`, **không** tự nhận theo trình duyệt (nhiều người dùng Việt cài trình duyệt/OS tiếng Anh, tự nhận sẽ ra tiếng Anh).
- Có thể thêm bộ chọn ngôn ngữ (vi/en) trong menu người dùng — **tùy chọn**, không bắt buộc.

## 5. Bảng thuật ngữ (glossary)

Quy tắc: ưu tiên tiếng Việt tự nhiên; giữ tiếng Anh khi thuật ngữ đó là chuẩn ngành hoặc bản dịch gây khó hiểu. Viết hoa chữ đầu câu, không Title Case.

| Gốc (zh) | Dùng | Ghi chú |
|---|---|---|
| 模板 | Mẫu | "Mẫu thiết kế" khi cần rõ |
| 画布 / 画板 | Canvas / Artboard | Giữ EN |
| 图层 | Layer | Giữ EN, quen thuộc hơn "lớp" |
| 素材 | Tư liệu | |
| 贴纸 | Sticker | |
| 组合 / 取消组合 | Nhóm / Bỏ nhóm | |
| 字体 | Font | |
| 文字 / 标题 / 正文 | Văn bản / Tiêu đề / Nội dung | |
| 纯色 / 渐变 / 图案 | Màu đơn / Gradient / Họa tiết | |
| 透明度 | Độ mờ (Opacity) | Tooltip có thể kèm EN |
| 描边 / 阴影 / 模糊 | Viền / Đổ bóng / Làm mờ | |
| 对齐 / 分布 | Căn chỉnh / Phân bố | |
| 锁定 / 解锁 | Khóa / Mở khóa | |
| 撤销 / 重做 | Hoàn tác / Làm lại | |
| 缩放 | Thu phóng (Zoom) | |
| 裁剪 / 抠图 | Cắt ảnh / Xóa nền | |
| 容器 Mask | Mask | |
| 二维码 | Mã QR | |
| 保存 / 下载 / 导出 | Lưu / Tải xuống / Xuất | |
| 作品 | Thiết kế của tôi | |
| 上传 | Tải lên | |
| 后台 / 管理员 | Quản trị / Admin | |
| 仪表盘 / 概览 | Tổng quan (Dashboard) | |
| 分类 | Danh mục | |
| 封面 | Ảnh bìa | |
| 登录 / 退出登录 | Đăng nhập / Đăng xuất | |
| AI 文案 / 配色 / 生图 | AI viết nội dung / AI phối màu / AI tạo ảnh | |
| 密钥 / 模型 / 供应商 | API Key / Model / Provider | Giữ EN |
| PSD, PNG, JPG, SVG, Base URL, Prompt | giữ nguyên | |
| 双击编辑文字 | Nhấp đúp để sửa văn bản | |

Glossary sẽ được lưu thành phần đầu của `src/languages/modules/vi/README.md` (hoặc comment đầu `vi/index.ts`) để dịch nhất quán.

## 6. Các giai đoạn triển khai

> Đã xong: giai đoạn 0 (trừ font canvas — chờ D5), giai đoạn 1–7 (frontend + service; giai đoạn 6 đã gộp vào giai đoạn 4). D5 và nghiệm thu đã xong.

Mỗi giai đoạn là một lần thay đổi có thể kiểm tra độc lập; giai đoạn 0–1 phải xong trước.

### Giai đoạn 0 — Hạ tầng + font
- Tạo `modules/vi`, cập nhật `modules/en` theo cùng cấu trúc; locale mặc định `vi`; Element Plus `vi`.
- Font UI: đưa font hệ thống hỗ trợ tiếng Việt lên trước CJK trong `src/assets/styles/main.less` (vd. `system-ui, -apple-system, 'Segoe UI', Roboto, Arial, …` rồi mới đến Hiragino/YaHei). Cập nhật token `typography.family-ui` trong `DESIGN.md` §3 cho khớp.
- **Phát hiện:** font mặc định của widget văn bản là `站酷快乐体` (`zcool-kuaile`, `wTextSetting.ts` `fontClass`) và cả 4 font trong `service/seed/poster.db` đều là font tiếng Trung (tải từ `lib.baomitu.com`) — gần như chắc chắn thiếu glyph dấu tiếng Việt. Cần bổ sung font hỗ trợ tiếng Việt (vd. Be Vietnam Pro, Roboto, Montserrat…) vào seed + đổi font mặc định. **Chờ quyết định nguồn font (D5).**
- `index.html` title + `APP_NAME` (theo D3).
- Thêm script kiểm tra `scripts/check-cjk.mjs` (Node thuần, không thêm dependency): liệt kê chuỗi chữ Hán còn sót trong `src/`, `packages/*/` (bỏ qua comment, `modules/zh`). Dùng làm tiêu chí nghiệm thu.

### Giai đoạn 1 — Tách chuỗi khỏi logic
- `color-picker`: đổi mode thành ID ổn định (`'solid' | 'gradient' | 'pattern'`), nhãn hiển thị qua map/i18n; cập nhật mọi nơi truyền prop `modes`.
- `pageStyle.vue`: `'color' | 'image' | 'gradient'`.
- `Admin.vue`: thay so sánh `msg === '请先登录'` bằng `code` (401 + mã con nếu server có; nếu không, thêm trường phân biệt tối thiểu trong `service/src/utils/auth.ts`).
- Rà thêm `switch/case`, key object, `v-if` dùng chuỗi Trung (lệnh grep ở §8).

### Giai đoạn 2 — Khung trình chỉnh sửa
`src/views/Index.vue`, `views/components/HeaderOptions.vue`, `UploadTemplate.vue`, `layout/` (designBoard, zoom, sidebar, icon rail), `panel/wrap/*` (Text, Photo, Template, User, Material…).

### Giai đoạn 3 — Widget, settings, store
`widgets/*Style.vue` (wText, wImage, wSvg, wQrcode…), `settings/*` (EffectSelect, TextWrap…), `store/design/*` (tên layer mặc định, thông báo), `mixins/scKeyCodes.ts`, `keyCodeOptions.ts` (mô tả phím tắt), `assets/data/*` (TextIconsData…), chữ mặc định `'双击编辑文字'`.

### Giai đoạn 4 — Thành phần nghiệp vụ
`ai-assistant`, `login-dialog` (+ ChangePassword), `image-cutout`, `qrcode`, `cropper`, `save-download`, `right-click-menu`, `picture-selector`, `create-design`, `common/Uploader`, `ProgressLoading`, `PopoverTip`, `views/Psd.vue`, `Draw.vue`, `Html.vue`.

### Giai đoạn 5 — Trang quản trị `/admin`
`views/Admin.vue` (242 dòng), `views/admin/constants.ts` và component con. Đặc biệt chú ý độ rộng cột bảng, nhãn bộ lọc, hộp thoại xác nhận xóa.

### Giai đoạn 6 — Packages
`packages/color-picker` (nhãn + tooltip "按Esc可退出"), `packages/image-extraction` (UI). Package nhận nhãn qua prop/i18n của app hoặc có map nhãn riêng — không để package phụ thuộc trực tiếp `vue-i18n` của app nếu hiện chưa có.

### Giai đoạn 7 — Service
- Dịch mọi chuỗi trả về client qua `send.error`/`send.success` và `throw new Error` hiển thị cho người dùng (`service/admin.ts`, `ai.ts`, `user.ts`, `auth.ts`, `design.ts`, `screenshots.ts`, `files.ts`, `utils/download*.ts`, `db/settings.ts` label).
- Viết lại prompt AI trong `ai.ts` để **sinh văn án tiếng Việt** (giữ nguyên cấu trúc yêu cầu JSON/định dạng đầu ra và parser); prompt ping có thể chuyển sang tiếng Anh.
- Danh mục mặc định trong `db/bootstrap.ts` + migration đổi tên danh mục seed (theo D4).
- Không dịch `console.*` (log vận hành) — ngoài phạm vi.

### Giai đoạn 8 — Nghiệm thu
Xem §7–8.

## 7. Tiêu chí nghiệm thu

- `node scripts/check-cjk.mjs` không còn chuỗi chữ Hán hiển thị trong `src/`, `packages/*` (UI) và thông báo trả về client của `service/src` (ngoại trừ danh sách cho phép: comment, `modules/zh`, tên font).
- Mở app với trình duyệt locale bất kỳ → mặc định tiếng Việt; Element Plus (date picker, pagination, confirm) cũng tiếng Việt.
- Các luồng chính chạy đúng: tạo thiết kế, thêm văn bản/ảnh/sticker/QR, đổi nền (màu đơn/gradient/ảnh), color picker cả 3 mode, cắt ảnh, xóa nền, lưu, tải xuống, đăng nhập/đổi mật khẩu, AI 3 chức năng, toàn bộ tab `/admin`, phiên đăng nhập hết hạn ở `/admin`.
- Không có chữ tràn/vỡ layout ở độ rộng tối thiểu 1180px.
- Dấu tiếng Việt hiển thị đúng trong UI và trên canvas (font mặc định).
- AI viết nội dung trả về tiếng Việt.

## 8. Kiểm tra / xác minh

- Typecheck + build frontend: `npm run v-build-hard`.
- Build service: `cd service && npm run build`.
- Lệnh rà chuỗi logic còn sót:
  `git grep -nP "(===|==|!==|includes\(|case )\s*['\"][^'\"]*[\x{4e00}-\x{9fff}]" -- src packages service/src`
- Chạy app (`npm run serve`) và đi qua checklist §7 bằng trình duyệt, chụp màn hình các màn chính để soát tràn chữ.

## 9. Ước lượng

| Giai đoạn | Khối lượng |
|---|---|
| 0–1 Hạ tầng, font, tách logic | ~0,5 ngày |
| 2–4 Editor + business (~550 chuỗi) | ~1,5 ngày |
| 5 Admin (~270 chuỗi) | ~0,5 ngày |
| 6–7 Packages + service + prompt AI | ~0,5 ngày |
| 8 QA giao diện + sửa tràn chữ | ~0,5 ngày |

Có thể chạy song song các giai đoạn 2, 4, 5, 7 sau khi giai đoạn 0–1 xong (mỗi giai đoạn sở hữu file `vi/<khu vực>.ts` riêng để tránh xung đột).
