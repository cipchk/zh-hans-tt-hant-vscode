/**
 * 来自：https://github.com/mumuy/chinese-transverter
 */

import { DICT } from './dict';

export interface TransverterOptions {
  type: 'simplified' | 'traditional';
  language: '' | 'zh_TW';
}

export function transverter(str: string, options: TransverterOptions) {
  options = Object.assign(
    {
      type: 'simplified',
      language: '',
    },
    options,
  );
  let source,
    target,
    result = '',
    hash = {};
  if (options.type == 'traditional') {
    source = DICT.simplified_chinese;
    target = DICT.traditional_chinese;
    for (const i in DICT.words) {
      //固定词替换
      str = str.replace(i, DICT.words[i]);
    }
    if (options.language === 'zh_TW') {
      //惯用词替换：简->繁
      for (const i in DICT.zh_TW) {
        if (str.indexOf(i) > -1) {
          str = str.replace(new RegExp(i, 'g'), DICT.zh_TW[i]);
        }
      }
    }
  } else {
    source = DICT.traditional_chinese;
    target = DICT.simplified_chinese;
    for (const i in DICT.words) {
      //固定词替换
      if (str.indexOf(DICT.words[i]) > -1) {
        str = str.replace(new RegExp(DICT.words[i], 'g'), i);
      }
    }
    for (const i in DICT.toSimplified) {
      //单向替换：繁->简
      if (str.indexOf(i) > -1) {
        str = str.replace(new RegExp(i, 'g'), DICT.toSimplified[i]);
      }
    }
  }
  for (let i = 0, len = str.length; i < len; i++) {
    let noReplace = false;
    let c = str[i];
    for (let j = 0; j < DICT.exception.length; j++) {
      let index = str.indexOf(DICT.exception[j]);
      if (i >= index && i < index + DICT.exception[j].length - 1) {
        c = DICT.exception[j];
        noReplace = true;
        break;
      }
    }
    if (!noReplace) {
      if (hash[c]) {
        c = hash[c];
      } else {
        let index = source.indexOf(c);
        if (index > -1) {
          c = hash[c] = target[index];
        }
      }
    }
    result += c;
    i += c.length - 1;
  }
  if (options.type == 'simplified') {
    if (options.language == 'zh_TW') {
      //惯用词替换：繁->简
      for (let i in DICT.zh_TW) {
        if (result.indexOf(DICT.zh_TW[i]) > -1) {
          result = result.replace(new RegExp(DICT.zh_TW[i], 'g'), i);
        }
      }
    }
  }
  return result;
}
