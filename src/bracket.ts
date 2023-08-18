//@ts-nocheck

/**
 * @param dateArr @type {Set<string>}
 * @param {number} year
 * @param {singleGame[]} gameData
 *
 * @description Given date, with year, get Days and insert into DOM on [Schedule page #result]
 * */

export function makeBracket(root, depth, parentEle, arr) {
  let count = 0;

  parentEle.innerHTML = `<p>${root.school1} : ${root.school2}</p>`;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].next === root.id) {
      let con = document.createElement("div"); //52, 60
      con.classList.add(`depth-${depth}`);
      parentEle.appendChild(con);
      makeBracket(arr[i], depth + 1, con);
      count++;
      if (count > 1) {
        break;
      }
    }
  }
}
