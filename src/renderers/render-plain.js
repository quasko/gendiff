import _ from 'lodash';

const printFullKey = (parents, key) => (parents.length > 0 ? `${parents.join('.')}.${key}` : key);

const printValue = value => `${_.isObject(value) ? '[complex value]' : value}`;

const diffMap = {
  changed: (item, parent) => `Property '${printFullKey(parent, item.key)}' was updated. From '${printValue(item.oldValue)}' to '${printValue(item.newValue)}'`,
  added: (item, parent) => `Property '${printFullKey(parent, item.key)}' was added with value: '${printValue(item.newValue)}'`,
  deleted: (item, parent) => `Property '${printFullKey(parent, item.key)}' was removed`,
  unchanged: () => null,
  nested: (item, parent, buildFunc) => _.flatten(buildFunc(item.children, [...parent, item.key])),
};

const renderPlain = (data) => {
  const buildDiff = (items, parent = []) => items.map(
    item => diffMap[item.type](item, parent, buildDiff),
  );

  return _.flatten(buildDiff(data))
    .filter(item => item !== null)
    .join('\n');
};

export default renderPlain;
