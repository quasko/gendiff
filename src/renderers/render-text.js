import _ from 'lodash';

const stringify = (value, depth) => {
  const spaceCount = depth * 4 + 4;
  if (_.isObject(value)) {
    const result = Object.keys(value).map(key => `${' '.repeat(spaceCount)}${key}: ${value[key]}`);
    return `{\n${result.join('\n')}\n${' '.repeat(spaceCount - 4)}}`;
  }
  return value.toString();
};

const renderText = (data, depth = 0) => {
  const spaceCount = depth * 4 + 2;
  const buildLine = (prefix, key, value) => `${' '.repeat(spaceCount)}${prefix} ${key}: ${value}`;

  const diffMaps = [
    {
      type: 'changed',
      map: item => `${buildLine('+', item.key, stringify(item.newValue, depth + 1))}\n${buildLine('-', item.key, stringify(item.oldValue, depth + 1))}`,
    },
    {
      type: 'added',
      map: item => buildLine('+', item.key, stringify(item.newValue, depth + 1)),
    },
    {
      type: 'deleted',
      map: item => buildLine('-', item.key, stringify(item.oldValue, depth + 1)),
    },
    {
      type: 'unchanged',
      map: item => buildLine(' ', item.key, stringify(item.oldValue, depth + 1)),
    },
    {
      type: 'nested',
      map: item => buildLine(' ', item.key, renderText(item.children, depth + 1)),
    },
  ];

  const getDiffMap = type => diffMaps.find(item => item.type === type);

  const diffs = data.map((item) => {
    const { map } = getDiffMap(item.type);
    return map(item);
  });
  return `{\n${diffs.join('\n')}\n${' '.repeat(spaceCount - 2)}}`;
};

export default renderText;
