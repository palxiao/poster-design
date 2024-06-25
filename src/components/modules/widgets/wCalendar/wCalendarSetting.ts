export const wCalendarSetting: TWCalendarSetting = {
  name: '日历',
  type: 'w-calendar',
  uuid: -1,
  width: 700,
  height: 830,
  left: 0,
  top: 0,
  zoom: 1,
  transform: '',
  radius: 0,
  opacity: 1,
  parent: '-1',
  value: '2024-05-09', // 日期
  icon: 'double', // 图标
  iconColor: '#d81e06', // 图标颜色
  transition: '',
  date: {
    color: '#000', // 日期颜色
    fontSize: '36', // 日期字体大小
    fontClass: { // 字体样式
      alias: '站酷黄油体',
      id: 543,
      value: 'zcool-qingke-huangyou-regular',
      url: "https://lib.baomitu.com/fonts/zcool-qingke-huangyou/zcool-qingke-huangyou-regular.woff2",
    },
  },
  week: {
    color: '#851e1e', // 星期颜色
    fontSize: 36, // 星期字体大小
    fontClass: { // 字体样式
      alias: "阿里妈妈数黑体",
      id: 543,
      value: 'AlimamaShuHeiTi',
      url: "https://res.palxp.cn/static/fonts/202303241038-b829.woff",
    },
  },
  lunarDate: {
    color: '#aaaaaa', // 农历颜色
    fontSize: '26', // 农历字体大小
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
    size: '0', // 边框大小，px
    style: 'solid', // 边框样式，虚线实线
    radius: '8', // 圆角大小
  },
  padding: '0', // 边距
  setting: [],
  record: {
    width: 0,
    height: 0,
    minWidth: 10,
    minHeight: 10,
    dir: 'all',
  },
}
