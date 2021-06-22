import { APICategory, Category } from './types';

export const URL =
  'https://gist.githubusercontent.com/jakobt/8b44844ae0101949d7117a37f2d44161/raw/452dc8193f3279b36c7aa78f0c6d15b8114e3800/flatlist.json';

export function sortData(data: Category[]) {
  return data.sort((a, b) => (a.code > b.code ? 1 : -1));
}

export function stripTrailingZeros(code: number) {
  let subCode = String(code);
  while (subCode.slice(-2) === '00') {
    subCode = subCode.substring(0, subCode.length - 2);
  }
  return Number(subCode);
}

export function addTrailingZeros(code: number) {
  let fullCode = String(code);
  while (fullCode.length < 8) {
    fullCode += '00';
  }
  return Number(fullCode);
}

export function prepareData(data: APICategory[]) {
  const newData = data.map((category) => {
    const subCode = stripTrailingZeros(category.code);
    const level = String(subCode).length / 2;
    return { ...category, level };
  });
  return sortData(newData);
}

export function generateNewCode(data: Category[], parent: Category, parentIndex: number) {
  let lastChild = parent;
  let index = parentIndex + 1;
  while (index < data.length && data[index].level > parent.level) {
    if (data[index].level === parent.level + 1 && data[index].code > lastChild.code) {
      lastChild = data[index];
    }
    index += 1;
  }
  let newCode: number;
  if (lastChild !== parent) {
    newCode = stripTrailingZeros(lastChild.code) + 1;
  } else {
    newCode = Number(`${String(stripTrailingZeros(parent.code))}00`) + 1;
  }
  return addTrailingZeros(newCode);
}

export function getBulletUnicode(level: number) {
  if (level === 1) return '\u2022';
  if (level === 2) return '\u25E6';
  if (level === 3) return '\u25AA';
  if (level === 4) return '\u25AB';
}
