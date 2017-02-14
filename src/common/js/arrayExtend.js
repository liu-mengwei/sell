/**
 * Created by liumw on 2017/1/23.
 */

export function arrayContains (arr, obj) {
  let pos = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === obj) {
      pos = i;
    }
  }
  return pos;
}
