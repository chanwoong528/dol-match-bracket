//@ts-nocheck
const messageMap = new Map();

messageMap.set('container', 'Container not found. check your selector');
messageMap.set('noFinal', 'Final game not found. The data needs one element with a null value of "next".');
messageMap.set('overFinal', 'Only one element is allowed to have a null value of "next".');
messageMap.set('overId', 'There are more than two items with the same "next" value. -');

/**
 * @param defaultConfig 기본옵션
 * @param defaultConfig.con 기본옵션
 * @param defaultConfig.containerClass 컨테이너의 기본 클래스
 * @param defaultConfig.matchClass 각 매치별 래퍼
 * @param defaultConfig.mainGameClass 매치의 래퍼
 * @param defaultConfig.subGameClass 매치의 서브 매치그루핑용
 * @param defaultConfig.hasByeClass 부전승 경기가 있을경우 사용할 클래스
 * @param defaultConfig.itemTemplate 각 매치의 기본템플릿 {{ }} 를 사용하여 데이터의 변수 사용
 * @param defaultConfig.leftClass 서브 매치의 왼쪽 구분
 * @param defaultConfig.rightClass 서브 매치의 오른쪽 구분
 * */
const defaultConfig = {
  containerClass: 'dol-bracket',
  matchClass: 'dol-bracket-match',
  mainGameClass: 'dol-bracket-main',
  subGameClass: 'dol-bracket-sub',
  hasByeClass: 'dol-bracket-bye',
  itemTemplate: '<div class="dol-bracket-item">{{school1}} : {{school2}}</div>',
  leftClass: 'dol-bracket-left',
  rightClass: 'dol-bracket-right',
};

/**
 * @param {object} match current match data
 * @param {gameObject[]} data all match data
 * @param {object} options
 * @param {-1|1} [pos] direction, -1: left, 1:right
 * */
function makeMatchFragment(match, data, options, pos) {
  const groupEle = document.createElement('div');
  const gameTpl = options.itemTemplate.replace(/{{\s*([^}]*)\s*}}/g, (_, key) => `${match[key]}`);
  const subGames = data.filter((item) => item.next === match.id);

  if (subGames.length > 2) {
    console.warn(`${messageMap.get('overId')} ${match.id}`);
  }

  groupEle.classList.add(options.matchClass);

  // 매치의 왼쪽 오른쪽 구분(옵션)
  if (pos) {
    groupEle.classList.add(pos < 0 ? options.leftClass : options.rightClass);
  }

  groupEle.innerHTML = `<div class="${options.mainGameClass}">${gameTpl}</div>`;

  if (subGames.length) {
    const subGroupEle = document.createElement('div');

    subGroupEle.classList.add(options.subGameClass);

    if (subGames.length === 1) {
      subGroupEle.classList.add(options.hasByeClass);
    } else {
      // 왼쪽 오른쪽 구분을 위해 정렬(옵션), pos값이 없으면 그대로
      subGames.sort(function (a, b) {
        if (a.pos === 'left' || b.pos === 'right') {
          return -1;
        }
        if (a.pos === 'right' || b.pos === 'left') {
          return 1;
        }
        return 0;
      });
    }

    if (subGames[0]) {
      subGroupEle.append(makeMatchFragment(subGames[0], data, options, -1));
    }
    if (subGames[1]) {
      subGroupEle.append(makeMatchFragment(subGames[1], data, options, 1));
    }

    groupEle.append(subGroupEle);
  }

  return groupEle;
}

/**
 * @param {string|node element} selector
 * @param {gameObject[]} data all match data
 * @param {object} confit user defined options
 *
 * @description Given date, with year, get Days and insert into DOM on [Schedule page #result]
 * */
function makeBracket(selector, data, config) {
  const finalGame = data.filter((item) => !item.next);

  let container;
  let options;
  let fragment = document.createElement('div');

  if (typeof selector === 'string') {
    container = document.querySelector(selector);
  } else if (selector.nodeName) {
    container = selector;
  }

  if (!container) {
    throw messageMap.get('container');
  }

  // 최종 경기가 하나만 있어야 함
  if (!finalGame.length) {
    throw messageMap.get('noFinal');
  } else if (finalGame.length > 1) {
    throw messageMap.get('overFinal');
  }

  options = Object.assign(defaultConfig, config);
  fragment = makeMatchFragment(finalGame[0], data, options);

  container.classList.add(options.containerClass);
  container.append(fragment);
}

// 모듈화
// https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory;
  } else {
    // browser
    root.MakeDolBracket = factory;
  }
})(this, makeBracket);
