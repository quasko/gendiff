import _ from 'lodash';

const linePrefix = {
  unchanged: ' ',
  added: '+',
  deleted: '-',
};

const renderDefault = (data, spaceCount = 2) => {
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
    if (_.isArray(item.value)) {
      return `${buildLine(linePrefix.added, item.key, stringify(item.value[1]))}\n${buildLine(linePrefix.deleted, item.key, stringify(item.value[0]))}`;
    }
    if (_.isObject(item.value) || typeof item.value === 'boolean') {
      return buildLine(linePrefix[item.type], item.key, stringify(item.value));
    }
    if (item.value && !_.isObject(item.value)) {
      return buildLine(linePrefix[item.type], item.key, item.value);
    }
    return buildLine(linePrefix[item.type], item.key, renderDefault(item.children, spaceCount + 4));
  });
  return `{\n${diffs.join('\n')}\n${indent(spaceCount - 2)}}`;
};

const renderPlain = (data) => {
  const buildLine = ({ type, key, value }, parentKeys) => {
    const buildAction = {
      deleted: 'removed',
      added: `added with value: '${_.isObject(value) ? '[complex value]' : value}'`,
      changed: `was updated. From '${value[0]}' to '${value[1]}'`,
    };
    const fullKey = parentKeys.length > 0 ? `${parentKeys.join('.')}.${key}` : key;

    return `Property '${fullKey}' was ${buildAction[type]}`;
  };

  const buildDiff = (items, parent = []) => items.reduce((acc, item) => {
    if (item.children.length === 0 && item.type === 'unchanged') {
      return acc;
    }

    if (item.children.length === 0) {
      return [...acc, buildLine(item, parent)];
    }

    return [...acc, ...buildDiff(item.children, [...parent, item.key])];
  }, '');

  return buildDiff(data).join('\n');
};

const render = {
  default: renderDefault,
  plain: renderPlain,
};

export default (data, format) => render[format](data);
