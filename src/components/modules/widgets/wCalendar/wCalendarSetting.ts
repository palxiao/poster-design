export const wCalendarSetting: TWCalendarSetting = {
  name: '日历',
  type: 'w-calendar',
  uuid: -1,
  width: 600,
  height: 600,
  left: 0,
  top: 0,
  zoom: 1,
  transform: '',
  radius: 0,
  opacity: 1,
  parent: '-1',
  value: '2024-05-09', // 日期
  icon: 'love', // 图标
  transition: '',
  date: {
    color: 'blue', // 日期颜色
    fontSize: '25', // 日期字体大小
    fontClass: { // 字体样式
      alias: '站酷快乐体',
      id: 543,
      value: 'zcool-kuaile-regular',
      url: 'https://lib.baomitu.com/fonts/zcool-kuaile/zcool-kuaile-regular.woff2',
    },
  },
  week: {
    color: '#8b1d1d', // 星期颜色
    fontSize: 36, // 星期字体大小
    fontClass: { // 字体样式
      alias: '站酷快乐体',
      id: 543,
      value: 'long-cang-regular',
      url: 'https://lib.baomitu.com/fonts/long-cang/long-cang-regular.woff2',
    },
  },
  lunarDate: {
    color: 'red', // 农历颜色
    fontSize: '24', // 农历字体大小
    fontClass: { // 字体样式
      alias: '站酷快乐体',
      id: 543,
      value: 'zcool-qingke-huangyou-regular',
      url: 'https://lib.baomitu.com/fonts/zcool-qingke-huangyou/zcool-qingke-huangyou-regular.woff2',
    },
  },
  chooseColor: '', // 选中的颜色
  bgColor: 'blue', // 背景颜色
  border: {
    color: 'black', // 边框颜色
    size: '10', // 边框大小，px
    style: 'solid', // 边框样式，虚线实线
    radius: '8', // 圆角大小
  },
  padding: '10', // 边距
  setting: [],
  record: {
    width: 0,
    height: 0,
    minWidth: 10,
    minHeight: 10,
    dir: 'all',
  },
}
