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
          type: 'unchanged',
          value: null,
        };
      }

      if (value1 === value2) {
        return {
          key,
          children: [],
          type: 'unchanged',
          value: value1,
        };
      }

      return {
        key,
        children: [],
        type: 'changed',
        value: [value1, value2],
      };
    }
    if (_.has(obj2, key)) {
      return {
        key,
        children: [],
        type: 'added',
        value: obj2[key],
      };
    }
    return {
      key,
      children: [],
      type: 'deleted',
      value: obj1[key],
    };
  };
  return keys.map(key => (buildDiff(key, object1, object2)));
};

const compareFiles = (filePath1, filePath2, format = 'default') => {
  const obj1 = parse(fs.readFileSync(filePath1, 'utf8'), extname(filePath1));
  const obj2 = parse(fs.readFileSync(filePath2, 'utf8'), extname(filePath2));
  const ast = _.flatten(buildAST(obj1, obj2));
  return render(ast, format);
};

export default compareFiles;
