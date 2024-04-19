// #!zh: 可选的动画列表的第一个层级
export const firstLevelAnimationOptions = [
  {
    label: '进入',
    isAnimating: false,
      value: /进/
  },
  {
    label: '退出',
    isAnimating: false,
      value: /退/
  },
  {
    label: '强调',
    isAnimating: false,
      value: /强调|特殊/
  }
]

export const animationOptions = [
  {
    label: '空',
    isAnimating: false,
      value: '',
    children: [
      {
        label: '无',
        isAnimating: false,
      value: ''
      }
    ]
  },
  {
    label: '强调',
    isAnimating: false,
      value: 'Attention Seekers',
    children: [
      {
        label: '旋转',
        isAnimating: false,
      value: 'justRotate'
      }, {
        label: '弹跳',
        isAnimating: false,
      value: 'bounce'
      },
      {
        label: '闪烁',
        isAnimating: false,
      value: 'flash'
      },
      {
        label: '跳动',
        isAnimating: false,
      value: 'pulse'
      },
      {
        label: '抖动',
        isAnimating: false,
      value: 'shake'
      },
      {
        label: '摇摆',
        isAnimating: false,
      value: 'swing'
      },
      {
        label: '橡皮圈',
        isAnimating: false,
      value: 'rubberBand'
      },
      {
        label: '果冻',
        isAnimating: false,
      value: 'jello'
      },
      {
        label: '左右上下晃动',
        isAnimating: false,
      value: 'tada'
      },
      {
        label: '左右摆动',
        isAnimating: false,
      value: 'wobble'
      }
    ]
  },

  {
    label: '弹跳进入',
    isAnimating: false,
      value: 'Bouncing Entrances',
    children: [{
      label: '弹跳进入',
      isAnimating: false,
      value: 'bounceIn'
    },
    {
      label: '向下弹跳进入',
      isAnimating: false,
      value: 'bounceInDown'
    },
    {
      label: '向右弹跳进入',
      isAnimating: false,
      value: 'bounceInLeft'
    },
    {
      label: '向左弹跳进入',
      isAnimating: false,
      value: 'bounceInRight'
    },
    {
      label: '向上弹跳进入',
      isAnimating: false,
      value: 'bounceInUp'
    }
    ]
  },

  {
    label: '弹跳退出',
    isAnimating: false,
      value: 'Bouncing Exits',
    children: [{
      label: '弹跳退出',
      isAnimating: false,
      value: 'bounceOut'
    },
    {
      label: '向下弹跳退出',
      isAnimating: false,
      value: 'bounceOutDown'
    },
    {
      label: '向左弹跳退出',
      isAnimating: false,
      value: 'bounceOutLeft'
    },
    {
      label: '向右弹跳退出',
      isAnimating: false,
      value: 'bounceOutRight'
    },
    {
      label: '向上弹跳退出',
      isAnimating: false,
      value: 'bounceOutUp'
    }
    ]
  },

  {
    label: '渐显进入',
    isAnimating: false,
      value: 'Fading Entrances',
    children: [
      {
        label: '渐显进入',
        isAnimating: false,
      value: 'fadeIn'
      },
      {
        label: '向下渐显进入',
        isAnimating: false,
      value: 'fadeInDown'
      },
      {
        label: '由屏幕外向下渐显进入',
        isAnimating: false,
      value: 'fadeInDownBig'
      },
      {
        label: '向右显进入',
        isAnimating: false,
      value: 'fadeInLeft'
      },
      {
        label: '由屏幕外向右渐显进入',
        isAnimating: false,
      value: 'fadeInLeftBig'
      },
      {
        label: '向左渐显进入',
        isAnimating: false,
      value: 'fadeInRight'
      },
      {
        label: '由屏幕外向左渐显进入',
        isAnimating: false,
      value: 'fadeInRightBig'
      },
      {
        label: '向上渐显进入',
        isAnimating: false,
      value: 'fadeInUp'
      },
      {
        label: '由屏幕外向上渐显进入',
        isAnimating: false,
      value: 'fadeInUpBig'
      }
    ]
  },

  {
    label: '渐隐退出',
    isAnimating: false,
      value: 'Fading Exits',
    children: [
      {
        label: '渐隐退出',
        isAnimating: false,
      value: 'fadeOut'
      },
      {
        label: '向下渐隐退出',
        isAnimating: false,
      value: 'fadeOutDown'
      },
      {
        label: '向下渐隐退出屏幕外',
        isAnimating: false,
      value: 'fadeOutDownBig'
      },
      {
        label: '向左渐隐退出',
        isAnimating: false,
      value: 'fadeOutLeft'
      },
      {
        label: '向左渐隐退出屏幕外',
        isAnimating: false,
      value: 'fadeOutLeftBig'
      },
      {
        label: '向右渐隐退出',
        isAnimating: false,
      value: 'fadeOutRight'
      },
      {
        label: '向右渐隐退出屏幕外',
        isAnimating: false,
      value: 'fadeOutRightBig'
      },
      {
        label: '向上渐隐退出',
        isAnimating: false,
      value: 'fadeOutUp'
      },
      {
        label: '向上渐隐退出屏幕外',
        isAnimating: false,
      value: 'fadeOutUpBig'
      }
    ]
  },

  {
    label: '翻动',
    isAnimating: false,
      value: 'Flippers',
    children: [{
      label: '翻动',
      isAnimating: false,
      value: 'flip'
    },
    {
      label: '纵向翻动',
      isAnimating: false,
      value: 'flipInX'
    },
    {
      label: '横向翻动',
      isAnimating: false,
      value: 'flipInY'
    },
    {
      label: '立体纵向翻动',
      isAnimating: false,
      value: 'flipOutX'
    },
    {
      label: '立体横向翻动',
      isAnimating: false,
      value: 'flipOutY'
    }
    ]
  },

  {
    label: '加速进出',
    isAnimating: false,
      value: 'Lightspeed',
    children: [{
      label: '加速进入',
      isAnimating: false,
      value: 'lightSpeedIn'
    },
    {
      label: '加速退出',
      isAnimating: false,
      value: 'lightSpeedOut'
    }
    ]
  },

  {
    label: '旋转渐显',
    isAnimating: false,
      value: 'Rotating Entrances',
    children: [{
      label: '旋转渐显',
      isAnimating: false,
      value: 'rotateIn'
    },
    {
      label: '左下角旋转渐显',
      isAnimating: false,
      value: 'rotateInDownLeft'
    },
    {
      label: '右下角旋转渐显',
      isAnimating: false,
      value: 'rotateInDownRight'
    },
    {
      label: '左上角旋转渐显',
      isAnimating: false,
      value: 'rotateInUpLeft'
    },
    {
      label: '右上角旋转渐显',
      isAnimating: false,
      value: 'rotateInUpRight'
    }
    ]
  },

  {
    label: '旋转渐隐',
    isAnimating: false,
      value: 'Rotating Exits',
    children: [
      {
        label: '旋转渐隐',
        isAnimating: false,
      value: 'rotateOut'
      },
      {
        label: '左下角旋转渐隐',
        isAnimating: false,
      value: 'rotateOutDownLeft'
      },
      {
        label: '左下角旋转渐隐',
        isAnimating: false,
      value: 'rotateOutDownRight'
      },
      {
        label: '左上角旋转渐隐',
        isAnimating: false,
      value: 'rotateOutUpLeft'
      },
      {
        label: '右上角旋转渐隐',
        isAnimating: false,
      value: 'rotateOutUpRight'
      }
    ]
  },

  {
    label: '平移进入',
    isAnimating: false,
      value: 'Sliding Entrances',
    children: [{
      label: '向上平移进入',
      isAnimating: false,
      value: 'slideInUp'
    },
    {
      label: '向下平移进入',
      isAnimating: false,
      value: 'slideInDown'
    },
    {
      label: '向右平移进入',
      isAnimating: false,
      value: 'slideInLeft'
    },
    {
      label: '向左平移进入',
      isAnimating: false,
      value: 'slideInRight'
    }

    ]
  },
  {
    label: '平移退出',
    isAnimating: false,
      value: 'Sliding Exits',
    children: [{
      label: '向上平移退出',
      isAnimating: false,
      value: 'slideOutUp'
    },
    {
      label: '向下平移退出',
      isAnimating: false,
      value: 'slideOutDown'
    },
    {
      label: '向左平移退出',
      isAnimating: false,
      value: 'slideOutLeft'
    },
    {
      label: '向右平移退出',
      isAnimating: false,
      value: 'slideOutRight'
    }
    ]
  },

  {
    label: '放大进入',
    isAnimating: false,
      value: 'Zoom Entrances',
    children: [{
      label: '放大进入',
      isAnimating: false,
      value: 'zoomIn'
    },
    {
      label: '向下放大进入',
      isAnimating: false,
      value: 'zoomInDown'
    },
    {
      label: '向右放大进入',
      isAnimating: false,
      value: 'zoomInLeft'
    },
    {
      label: '向左放大进入',
      isAnimating: false,
      value: 'zoomInRight'
    },
    {
      label: '向上放大进入',
      isAnimating: false,
      value: 'zoomInUp'
    }
    ]
  },

  {
    label: '缩小退出',
    isAnimating: false,
      value: 'Zoom Exits',
    children: [{
      label: '缩小退出',
      isAnimating: false,
      value: 'zoomOut'
    },
    {
      label: '向下缩小退出',
      isAnimating: false,
      value: 'zoomOutDown'
    },
    {
      label: '向左缩小退出',
      isAnimating: false,
      value: 'zoomOutLeft'
    },
    {
      label: '向右缩小退出',
      isAnimating: false,
      value: 'zoomOutRight'
    },
    {
      label: '向上缩小退出',
      isAnimating: false,
      value: 'zoomOutUp'
    }
    ]
  },

  {
    label: '特殊效果',
    isAnimating: false,
      value: 'Specials',
    children: [
      {
        label: '悬挂',
        isAnimating: false,
      value: 'hinge'
      },
      {
        label: '滚动进入',
        isAnimating: false,
      value: 'rollIn'
      },
      {
        label: '滚动退出',
        isAnimating: false,
      value: 'rollOut'
      }
    ]
  }
]

/**
 * @return {Object} { animationValue: animatonLabel }
 */
export const animationValue2Name = animationOptions.reduce((obj, curr) => {
  const items = curr.children
  items.forEach(item => { obj[item.value] = item.label })
  return obj
}, {})
