'use strict';

/**
 * Yarn 常把 react-is 提升到根 node_modules，但部分打包/源码映射仍会访问
 * node_modules/prop-types/node_modules/react-is（classic 布局）。在 Windows 上补一层 junction，避免「找不到路径」。
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const propTypesDir = path.join(root, 'node_modules', 'prop-types');
const hoistedReactIs = path.join(root, 'node_modules', 'react-is');
const nestedParent = path.join(propTypesDir, 'node_modules');
const nestedReactIs = path.join(nestedParent, 'react-is');

function main() {
  if (!fs.existsSync(propTypesDir) || !fs.existsSync(hoistedReactIs)) {
    return;
  }
  if (fs.existsSync(nestedReactIs)) {
    return;
  }
  fs.mkdirSync(nestedParent, { recursive: true });
  try {
    if (process.platform === 'win32') {
      fs.symlinkSync(hoistedReactIs, nestedReactIs, 'junction');
    } else {
      fs.symlinkSync(hoistedReactIs, nestedReactIs, 'dir');
    }
  } catch (err) {
    console.warn('[ensure-nested-react-is]', err.message);
  }
}

main();
