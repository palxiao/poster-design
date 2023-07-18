// import { colorer } from './color'
import { RGBA2HexA } from './color/color'
const colorer = { RGBA2HexA }

export const CLOUD_TYPE = {
  text: 'text',
  image: 'image',
}
export const WRITING_MODE = {
  h: 'horizontal-tb',
  v: 'vertical-rl',
}

export async function parsePSDFromURL(url: string) {
  return await (window as any).PSD.fromURL(url)
}

function toRGBAColor(data: number[]) {
  const [r, g, b] = data
  let [, , , a] = data
  if (a > 1) {
    a = a / 255
  }
  return [r, g, b, a] as const
}

function toRGBAColor1(data: number[]) {
  const [a, b, g, r] = data
  return [r * 255, g * 255, b * 255, a] as const
}

const STROKE_TYPE = {
  InsF: 'inner',
  CtrF: 'center',
  OutF: 'outer',
}

function calcTransform({ xx, xy }: { xx: number; xy: number }): {
  scale: number
  angle: number
} {
  /**
   * xx yx tx
   * xy yy ty
   * 0  0  1
   */
  const scale = Math.sqrt(xx * xx + xy * xy)
  const angle = (Math.asin(xy / scale) * 180) / Math.PI
  return { scale, angle }
}

function toTransformMatrix({ xx, xy, yx, yy, tx, ty }: { xx: number; xy: number; yx: number; yy: number; tx: number; ty: number }) {
  return { a: xx, b: xy, c: yx, d: yy, tx, ty }
}

function toCloudTextConfig(data: any, layer: any) {
  // console.info('toCloudTextConfig', data, layer)

  const { objectEffects, typeTool } = layer.adjustments
  const { StyleRun } = typeTool.engineData.EngineDict

  let point = 0
  const texts = StyleRun.RunArray.map((text: any, index: number) => {
    const length = StyleRun.RunLengthArray[index]
    const props: { text: string; fontSize: number; color?: string } = {
      text: data.text.value.substr(point, length),
      fontSize: text.StyleSheet.StyleSheetData.FontSize,
    }
    const { FillColor } = text.StyleSheet.StyleSheetData
    if (FillColor) {
      props.color = colorer.RGBA2HexA(...toRGBAColor1(FillColor.Values))
    }
    point += length
    return props
  })

  const strokes = []
  const shadows = []
  if (objectEffects) {
    const { FrFX, DrSh } = objectEffects.data

    if (FrFX) {
      strokes.push({
        type: Reflect.get(STROKE_TYPE, FrFX.Styl.value),
        width: FrFX['Sz  '].value,
        color: [FrFX['Clr ']['Rd  '], FrFX['Clr ']['Grn '], FrFX['Clr ']['Bl  '], FrFX.Opct.value / 100],
      })
    }

    if (DrSh) {
      shadows.push({
        color: [DrSh['Clr ']['Rd  '], DrSh['Clr ']['Grn '], DrSh['Clr ']['Bl  '], DrSh.Opct.value / 100],
        distance: DrSh.Dstn.value,
        blur: DrSh.blur.value,
        angle: DrSh.lagl.value,
      })
    }
  }

  const { angle } = calcTransform(typeTool.transform)

  return {
    type: CLOUD_TYPE.text,
    width: data.width + 2,
    height: data.height,
    top: data.top,
    left: data.left,
    text: data.text.value,
    opacity: data.opacity,
    textAlign: data.text.font.alignment[0],
    // fontFamily: typeTool
    //   .fonts()
    //   .map((font: string) => font.slice(1).replace('\u0000', '')),
    fontFamily: typeTool.fonts()[0].slice(1).replace('\u0000', ''),
    fontSize: data.text.font.sizes ? data.text.font.sizes[0] : data.height,
    color: colorer.RGBA2HexA(...toRGBAColor(data.text.font.colors[0])),
    textDecoration: StyleRun.RunArray[0].StyleSheet.StyleSheetData.Underline ? 'underline' : '',
    writingMode: typeTool.obj.textData.Ornt.value === 'Hrzn' ? WRITING_MODE.h : WRITING_MODE.v,
    fontWeight: '',
    fontStyle: '',
    texts,
    strokes,
    shadows,
    angle,
    transform: toTransformMatrix(typeTool.transform),
  }
}

function toCloudImageConfig(data: any, layer: any) {
  // const { type, b64 } = splitBase64(layer.image.toBase64());
  // const src = URL.createObjectURL(b64toBlob(b64, type));

  return {
    src: layer?.image?.toBase64(),
    // src: layer.image.toPng(),
    type: CLOUD_TYPE.image,
    width: data.width,
    height: data.height,
    top: data.top,
    left: data.left,
    opacity: data.opacity,
  }
}

function toCloud(data: any, layer: any) {
  if (layer.typeTool) {
    return toCloudTextConfig(data, layer)
  } else {
    return toCloudImageConfig(data, layer)
  }
}

export async function convertPSD2Page(psd: any) {
  const { children, document: doc } = psd.tree().export()
  console.log(psd.tree().export())

  // const node = psd.tree().childrenAtPath('taylor-vick-M5tzZtFCOfs-unsplash')[0]
  // console.log(node)
  // const vectorMask = node.get('vectorMask')
  // vectorMask.parse()

  const findLayer = (data: any) => {
    const result = !data.visible ? null : psd.layers.find((layer: any) => layer.name === data.name && layer.top === data.top && layer.right === data.right && layer.bottom === data.bottom && layer.left === data.left && layer.width === data.width && layer.height === data.height)
    return result
  }

  // eslint-ignore-next-line
  // console.info('children, document', psd, children, doc);

  const background = {
    color: '#ffffff00',
    image: '',
  }
  const [bgData] = children.slice(-1)
  if (['Background', 'background', '背景'].includes(bgData.name)) {
    const layer = findLayer(bgData)
    const image = toCloudImageConfig(bgData, layer)
    background.image = image.src

    children.pop()
  }

  const page = {
    background,
    width: doc.width,
    height: doc.height,
    clouds: [],
  }

  const process: any = async (children: any) => {
    children.forEach(async (item: any) => {
      if (item.type === 'group' && Array.isArray(item.children)) {
        return item.visible ? process(item.children) : null
      }

      const layer = findLayer(item)
      // console.log(layer)

      // layer.image && console.log('-- image: --', layer.image)
      // if (layer.image.hasMask) {
      //   const { bottom, top, height, width, left, right } = layer.mask
      //   const temp: any = { bottom, top, height, width, left, right }
      //   temp.type = 'image'
      //   temp.src = await file2Base64(layer.image.maskData.buffer)
      //   page.clouds.unshift(temp as never)
      // }

      if (!layer) return

      const cloud = toCloud(item, layer)

      page.clouds.unshift(cloud as never)
    })
    // for (const item of children) {

    // }
  }

  await process(children)

  return page
}

function file2Base64(file: any) {
  return new Promise((resolve) => {
    // const blob = new Blob(file)
    // resolve(URL.createObjectURL(blob))
    // const reader = new FileReader()
    // reader.onload = function(e: any) {
    //   resolve(e.target.result)
    // }
    // reader.readAsDataURL(blob)
    let binary = ''
    const bytes = new Uint8Array(file)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    resolve('data:image/png;base64,' + window.btoa(binary))
    // resolve('data:image/png;base64,' + btoa(new Uint8Array(file).reduce((data, byte) => data + String.fromCharCode(byte), '')))
  })
}

export async function processPSD2Page(file: File) {
  const url = URL.createObjectURL(file)
  const psd = await parsePSDFromURL(url)

  URL.revokeObjectURL(url)

  return convertPSD2Page(psd)
}
