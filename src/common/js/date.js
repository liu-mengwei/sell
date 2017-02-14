/**
 * Created by liumw on 2017/1/19.
 */

/**
 * 日期格式化
 * */
export function formatDate (time, fmt) {
  //年份
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substring(4 - RegExp.$1.length));
  }

  let date = {
    'M+': time.getMonth() + 1,
    'd+': time.getDay(),
    'h+': time.getHours(),
    'm+': time.getMinutes(),
    's+': time.getSeconds()
  };

  for (let key in date) {
    if (new RegExp(`(${key})`).test(fmt)) {
      let str = date[key] + '';
      //替换
      fmt = fmt.replace(RegExp.$1, (str.length === 1) ? '0' + str : str);
    }
  }

  return fmt;
}

