/*
 * @Author: ShawnPhang
 * @Date: 2022-04-15 11:16:20
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-04-15 11:22:49
 */
/**
 * 显示全局提示
 * @param content
 * @param tooltipVisible
 * @returns
 */
export function toolTip(content: string) {
  const tooltip = drawTooltip(content)
  document.body.appendChild(tooltip)
  setTimeout(() => tooltip?.parentNode?.removeChild(tooltip), 2000)
}

function drawTooltip(content: string, tooltipVisible = true) {
  const tooltip: any = document.createElement('div')
  tooltip.id = 'color-pipette-tooltip-container'
  tooltip.innerHTML = content
  tooltip.style = `
    position: fixed;
    left: 50%;
    top: 9%;
    z-index: 10002;
    display: ${tooltipVisible ? 'flex' : 'none'};
    align-items: center;
    background-color: rgba(0,0,0,0.4);
    padding: 6px 12px;
    border-radius: 4px;
    color: #fff;
    font-size: 18px;
    pointer-events: none;
  `
  return tooltip
}
