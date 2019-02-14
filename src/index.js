import fs from 'fs';
import _ from 'lodash';
import { extname } from 'path';
import parse from './parsers';
import render from './renderers';

const buildAST = (object1, object2) => {
  const keys = _.union(_.keys(object1), _.keys(object2));
  const buildDiff = (key, obj1, obj2) => {
    if (_.has(obj1, key) && _.has(obj2, key)) {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (_.isObject(value1) && _.isObject(value2)) {
        const children = _.flatten(buildAST(value1, value2));
        return {
          key,
          children,
          type: 'nested',
        };
      }

      if (value1 === value2) {
        return {
          key,
          type: 'unchanged',
          oldValue: value2,
        };
      }

      return {
        key,
        type: 'changed',
        oldValue: value1,
        newValue: value2,

      };
    }
    if (_.has(obj2, key)) {
      return {
        key,
        type: 'added',
        newValue: obj2[key],
      };
    }
    return {
      key,
      type: 'deleted',
      oldValue: obj1[key],
    };
  };
  return keys.map(key => (buildDiff(key, object1, object2)));
};

const compareFiles = (filePath1, filePath2, format = 'text') => {
  const obj1 = parse(fs.readFileSync(filePath1, 'utf8'), extname(filePath1));
  const obj2 = parse(fs.readFileSync(filePath2, 'utf8'), extname(filePath2));
  const ast = buildAST(obj1, obj2);
  return render(ast, format);
};

export default compareFiles;
