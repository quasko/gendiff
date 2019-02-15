import _ from 'lodash';

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return value.toString();
  }
  const indentSize = 4;
  const firstIndent = 4;
  const spaceCount = depth * indentSize + firstIndent;
  const result = Object.keys(value).map(key => `${' '.repeat(spaceCount)}${key}: ${value[key]}`);
  return `{\n${result.join('\n')}\n${' '.repeat(spaceCount - firstIndent)}}`;
};

const renderText = (data, depth = 0) => {
  const indentSize = 4;
  const firstIndent = 2;
  const spaceCount = depth * indentSize + firstIndent;
  const buildLine = (prefix, key, value) => `${' '.repeat(spaceCount)}${prefix} ${key}: ${value}`;

  const diffMap = {
    changed: item => [buildLine('+', item.key, stringify(item.newValue, depth + 1)), buildLine('-', item.key, stringify(item.oldValue, depth + 1))],
    added: item => buildLine('+', item.key, stringify(item.newValue, depth + 1)),
    deleted: item => buildLine('-', item.key, stringify(item.oldValue, depth + 1)),
    unchanged: item => buildLine(' ', item.key, stringify(item.oldValue, depth + 1)),
    nested: item => buildLine(' ', item.key, renderText(item.children, depth + 1)),
  };

  const diffs = _.flatten(data.map(item => diffMap[item.type](item)));
  return `{\n${diffs.join('\n')}\n${' '.repeat(spaceCount - firstIndent)}}`;
};

export default renderText;
