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
  const objectDiffs = keys.map((key) => {
    if (has(obj1, key) && has(obj2, key)) {
      return obj2[key] === obj1[key]
        ? printDiff.equal(key)
        : `${printDiff.added(key)}\n ${printDiff.deleted(key)}`;
    }
    return has(obj2, key) ? printDiff.added(key) : printDiff.deleted(key);
  });
  return `{\n ${objectDiffs.join('\n ')}\n}`;
};

const compareFiles = (filePath1, filePath2) => {
  const obj1 = parse(fs.readFileSync(filePath1, 'utf8'), extname(filePath1));
  const obj2 = parse(fs.readFileSync(filePath2, 'utf8'), extname(filePath2));
  return compareObjects(obj1, obj2);
};

export default compareFiles;
