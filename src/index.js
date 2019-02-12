import fs from 'fs';
import has from 'lodash/has';
import { extname } from 'path';
import parse from './parsers';

const compareObjects = (obj1, obj2) => {
  const printDiff = {
    equal: key => `  ${key}: ${obj1[key]}`,
    added: key => `+ ${key}: ${obj2[key]}`,
    deleted: key => `- ${key}: ${obj1[key]}`,
  };
  const keys = Object.keys({ ...obj1, ...obj2 });
  const objectDiffs = keys.reduce((acc, key) => {
    if (has(obj2, key)) {
      if (has(obj1, key)) {
        if (obj2[key] === obj1[key]) {
          return [...acc, printDiff.equal(key)];
        }
        return [...acc, printDiff.added(key), printDiff.deleted(key)];
      }
      return [...acc, printDiff.added(key)];
    }
    return [...acc, printDiff.deleted(key)];
  }, '');
  return `{\n ${objectDiffs.join('\n ')}\n}`;
};

const compareFiles = (filePath1, filePath2) => {
  const obj1 = parse(fs.readFileSync(filePath1, 'utf8'), extname(filePath1));
  const obj2 = parse(fs.readFileSync(filePath2, 'utf8'), extname(filePath2));
  return compareObjects(obj1, obj2);
};

export default compareFiles;
