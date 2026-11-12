/*
 * i18n: tiếng Việt luôn là mặc định (không tự nhận theo trình duyệt, vì nhiều người dùng Việt
 * cài trình duyệt/OS tiếng Anh); tiếng Anh là ngôn ngữ dự phòng khi thiếu key.
 * Bản `zh` giữ lại từ upstream nhưng không bổ sung key mới.
 */
import { createI18n } from 'vue-i18n'

import vi from './modules/vi'
import en from './modules/en'
import zh from './modules/zh'

const i18n = createI18n({
  allowComposition: true,
  legacy: false,
  locale: 'vi',
  fallbackLocale: 'en',
  messages: {
    vi,
    en,
    zh,
  },
})

export default i18n
