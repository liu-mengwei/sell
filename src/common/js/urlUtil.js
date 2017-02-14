/**
 * Created by liumw on 2017/1/25.
 */

/**
 * @example '?a=123&b=234'
 * @return {a='123',b='234'}
 * */

export function urlParse () {
  let url = window.location.search;
  let reg = /[?&][^?&]+=[^?&]+/g;
  let urlArr = url.match(reg);

  let obj = {};
  if (urlArr) {
    urlArr.forEach((item) => {
      let paramArr = item.substr(1).split('=');
      let key = decodeURIComponent(paramArr[0]);
      let value = decodeURIComponent(paramArr[1]);
      obj[key] = value;
    });
  }

  return obj;
}
