/*
 * @Author: 侯超委 houchaowei@zhihu.com
 * @Date: 2023-09-01 14:33:23
 * @LastEditors: 侯超委 houchaowei@zhihu.com
 * @LastEditTime: 2023-09-01 14:56:38
 * @FilePath: /poster-design/screenshot/src/utils/uuid.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import nodeCrypto from 'crypto';

export default () =>
  // @ts-ignore
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: number) =>
    (c ^ (nodeCrypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
  );
