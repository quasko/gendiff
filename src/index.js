import fs from 'fs';
import _ from 'lodash';
import { extname } from 'path';
import parse from './parsers';

const compareObjects = (obj1, obj2) => {
  const lineBuilders = {
    buildEqual: key => `  ${key}: ${obj1[key]}`,
    buildAdded: key => `+ ${key}: ${obj2[key]}`,
    buildDeleted: key => `- ${key}: ${obj1[key]}`,
  };
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  const objectDiffs = keys.map((key) => {
    if (_.has(obj1, key) && _.has(obj2, key)) {
      return obj2[key] === obj1[key]
        ? lineBuilders.buildEqual(key)
        : `${lineBuilders.buildAdded(key)}\n ${lineBuilders.buildDeleted(key)}`;
    }
    return _.has(obj2, key) ? lineBuilders.buildAdded(key) : lineBuilders.buildDeleted(key);
  });
  return `{\n ${objectDiffs.join('\n ')}\n}`;
};

const compareFiles = (filePath1, filePath2) => {
  const obj1 = parse(fs.readFileSync(filePath1, 'utf8'), extname(filePath1));
  const obj2 = parse(fs.readFileSync(filePath2, 'utf8'), extname(filePath2));
  return compareObjects(obj1, obj2);
};

export default compareFiles;
