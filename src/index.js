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
        value: _.isObject(obj2[key]) ? obj2[key] : obj2[key].toString(),
      };
    }
    return {
      key,
      children: [],
      type: 'deleted',
      value: _.isObject(obj1[key]) ? obj1[key] : obj1[key].toString(),
    };

    
  };
  return keys.map(key => (buildDiff(key, object1, object2)));
};


const prefix = {
  unchanged: ' ',
  added: '+',
  deleted: '-',
};

const buildLine = (type, key, value) => `${prefix[type]} ${key}: ${value}`;

const stringify = (obj) => {
  const strings = Object.keys(obj).map(key => `${key}: ${obj[key]}`);
  return `{\n ${strings.join('\n')}\n}`;
};


const renderAST = (data) => {
  
  
  const diff = data.map((item) => {
    
    if (item.value && !_.isObject(item.value)) {
      return buildLine(item.type, item.key, item.value);
    }
    if (_.isObject(item.value)) {
      return buildLine(item.type, item.key, stringify(item.value));
    }
    return `${prefix[item.type]} ${item.key}: ${renderAST(item.children)}`;
  });


  return `{\n ${diff.join('\n ')} \n}`;
}

const compareFiles = (filePath1, filePath2) => {
  const obj1 = parse(fs.readFileSync(filePath1, 'utf8'), extname(filePath1));
  const obj2 = parse(fs.readFileSync(filePath2, 'utf8'), extname(filePath2));
  //return compareObjects(obj1, obj2);
  const ast = _.flatten(buildAST(obj1, obj2));
  const diff = renderAST(ast);
  return diff;
};

export default compareFiles;
