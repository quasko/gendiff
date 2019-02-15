import fs from 'fs';
import _ from 'lodash';
import { extname } from 'path';
import parse from './parsers';
import render from './renderers';

const nodeActions = [
  {
    check: (obj1, obj2, key) => (_.isObject(obj1[key]) && _.isObject(obj2[key])),
    process: (key, oldValue, newValue, buildFunction) => {
      const children = _.flatten(buildFunction(oldValue, newValue));
      return {
        key,
        type: 'nested',
        children,
      };
    },
  },
  {
    check: (obj1, obj2, key) => (obj1[key] === obj2[key]),
    process: (key, oldValue) => ({
      key,
      type: 'unchanged',
      oldValue,
    }),
  },
  {
    check: (obj1, obj2, key) => (!_.has(obj1, key) && _.has(obj2, key)),
    process: (key, oldValue, newValue) => ({
      key,
      type: 'added',
      newValue,
    }),
  },
  {
    check: (obj1, obj2, key) => (_.has(obj1, key) && !_.has(obj2, key)),
    process: (key, oldValue) => ({
      key,
      type: 'deleted',
      oldValue,
    }),
  },
  {
    check: (obj1, obj2, key) => (obj1[key] !== obj2[key]),
    process: (key, oldValue, newValue) => ({
      key,
      type: 'changed',
      oldValue,
      newValue,
    }),
  },
];

const getNodeAction = (obj1, obj2, key) => nodeActions.find(({ check }) => check(obj1, obj2, key));

const buildAST = (object1, object2) => {
  const keys = _.union(_.keys(object1), _.keys(object2));
  return keys.map((key) => {
    const { process } = getNodeAction(object1, object2, key);
    return process(key, object1[key], object2[key], buildAST);
  });
};

const compareFiles = (filePath1, filePath2, format = 'text') => {
  const obj1 = parse(fs.readFileSync(filePath1, 'utf8'), extname(filePath1));
  const obj2 = parse(fs.readFileSync(filePath2, 'utf8'), extname(filePath2));
  const ast = buildAST(obj1, obj2);
  return render(ast, format);
};

export default compareFiles;
