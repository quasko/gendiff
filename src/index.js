import fs from 'fs';
import _ from 'lodash';
import { extname } from 'path';
import parse from './parsers';

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

      return [
        {
          key,
          children: [],
          type: 'added',
          value: value2,
        },
        {
          key,
          children: [],
          type: 'deleted',
          value: value1,
        },
      ];
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


const linePrefix = {
  unchanged: ' ',
  added: '+',
  deleted: '-',
};

const renderAST = (data, spaceCount = 2) => {
  const indent = count => ' '.repeat(count);
  const buildLine = (prefix, key, value) => `${indent(spaceCount)}${prefix} ${key}: ${value}`;

  const stringify = (value) => {
    if (_.isObject(value)) {
      const result = Object.keys(value).map(key => buildLine('     ', key, value[key]));
      return `{\n${result.join('\n')}\n${indent(spaceCount + 2)}}`;
    }
    return value.toString();
  };
  const diffs = data.map((item) => {
    if (_.isObject(item.value) || typeof item.value === 'boolean') {
      return buildLine(linePrefix[item.type], item.key, stringify(item.value));
    }
    if (item.value && !_.isObject(item.value)) {
      return buildLine(linePrefix[item.type], item.key, item.value);
    }
    return buildLine(linePrefix[item.type], item.key, renderAST(item.children, spaceCount + 4));
  });
  return `{\n${diffs.join('\n')}\n${indent(spaceCount - 2)}}`;
};

const compareFiles = (filePath1, filePath2) => {
  const obj1 = parse(fs.readFileSync(filePath1, 'utf8'), extname(filePath1));
  const obj2 = parse(fs.readFileSync(filePath2, 'utf8'), extname(filePath2));
  const ast = _.flatten(buildAST(obj1, obj2));
  const diff = renderAST(ast);
  return diff;
};

export default compareFiles;
