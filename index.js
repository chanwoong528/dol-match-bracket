let arr = [{
  id: 1,
  "date": 8.18,
  "stadium": "목동",
  "time": "9:00",
  school1: "a",
  "score1": 9,
  "score2": 4,
  school2: "b",
  "state": "경기종료",
  "live": "진행",
  next: 3
},
{
  id: 2,
  "date": 8.18,
  "stadium": "목동",
  "time": "11:30",
  school1: "c",
  "score1": 10,
  "score2": 5,
  school2: "d",
  "state": "경기종료",
  "live": "진행",
  next: 4

},
{
  id: 3,
  "date": 8.18,
  "stadium": "목동",
  "time": "16:30",
  school1: "e",
  "score1": 13,
  "score2": 2,
  school2: "1",
  "state": "경기전",
  "live": "진행",
  next: 5
},
{
  id: 4,
  "date": 8.18,
  "stadium": "목동",
  "time": "16:30",
  school1: "f",
  "score1": 13,
  "score2": 2,
  school2: "2",
  "state": "경기전",
  "live": "진행",
  next: 5
},
{
  id: 5,
  "date": 8.18,
  "stadium": "목동",
  "time": "16:30",
  school1: "3",
  "score1": 13,
  "score2": 2,
  school2: "4",
  "state": "경기전",
  "live": "진행",
  next: null
}]

function findChildren(root, depth, parentEle) {
  let count = 0;
  parentEle.innerHTML = `<p>${root.school1} : ${root.school2}</p>`
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].next === root.id) {
      let con = document.createElement("div") //52, 60
      con.classList.add(`depth-${depth}`)
      parentEle.appendChild(con);
      findChildren(arr[i], depth + 1, con);
      count++;
      if (count > 1) {
        break;
      }
    }
  }
}

let rootCon = document.querySelector(".depth-0")
findChildren(arr[arr.length - 1], 1, rootCon);
