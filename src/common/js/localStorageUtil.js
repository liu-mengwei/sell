/**
 * Created by liumw on 2017/1/25.
 */

/**
 * @param id 商家id
 * @param key 信息键
 * @param value 信息值
 * */
export function saveToLocal (id, key, value) {
  let sellerStorage = window.localStorage.__seller__;
  if (!sellerStorage) {
    sellerStorage = {};
    sellerStorage[id] = {};
  }
  else {
    // 没有储存这个商家信息
    sellerStorage = JSON.parse(sellerStorage);
    if (!sellerStorage[id]) {
      sellerStorage[id] = {};
    }
  }
  sellerStorage[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(sellerStorage);
}

/**
 * def 默认值
 * */
export function loadFromLocal (id, key, def) {
  let sellerStorage = {};
  //如果__seller__存在
  if (window.localStorage.__seller__) {
    sellerStorage = JSON.parse(window.localStorage.__seller__);
    //如果这些属性都有
    if (sellerStorage[id] && sellerStorage[id][key]) {
      return sellerStorage[id][key];
    }
  }
  //如果没有统统返回false
  return def;
}
