//@ts-nocheck
const messageMap = new Map();

messageMap.set('container', 'Container not found. check your selector');
messageMap.set('noFinal', 'Final game not found. The data needs one element with a null value of "next".');
messageMap.set('overFinal', 'Only one element is allowed to have a null value of "next".');
messageMap.set('overId', 'There are more than two items with the same "next" value. -');

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

function makeMatchFragment(match, data, options, pos) {
  const groupEle = document.createElement('div');
  const gameTpl = options.itemTemplate.replace(/{{\s*([^}]*)\s*}}/g, (_, key) => `${match[key]}`);
  const subGames = data.filter((item) => item.next === match.id);

  if (subGames.length > 2) {
    console.warn(`${messageMap.get('overId')} ${match.id}`);
  }

  groupEle.classList.add(options.matchClass);

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
 * @param dateArr @type {Set<string>}
 * @param {number} year
 * @param {singleGame[]} gameData
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
