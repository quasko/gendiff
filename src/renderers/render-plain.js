import _ from 'lodash';

const renderPlain = (data) => {
  const buildLine = ({
    type,
    key,
    newValue,
    oldValue,
  }, parentKeys) => {
    const buildAction = {
      deleted: 'removed',
      added: `added with value: '${_.isObject(newValue) ? '[complex value]' : newValue}'`,
      changed: `was updated. From '${oldValue}' to '${newValue}'`,
    };
    const fullKey = parentKeys.length > 0 ? `${parentKeys.join('.')}.${key}` : key;

    return `Property '${fullKey}' was ${buildAction[type]}`;
  };

  const buildDiff = (items, parent = []) => items.reduce((acc, item) => {
    if (item.type === 'unchanged') {
      return acc;
    }

    if (item.type !== 'nested') {
      return [...acc, buildLine(item, parent)];
    }

    return [...acc, ...buildDiff(item.children, [...parent, item.key])];
  }, '');

  return buildDiff(data).join('\n');
};

export default renderPlain;
