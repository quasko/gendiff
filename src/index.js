import commander from 'commander';
import has from 'lodash/has';
import parse from './parsers';

const compareObjects = (obj1, obj2) => {
  const printDiff = {
    none: key => `  ${key}: ${obj1[key]}`,
    add: key => `+ ${key}: ${obj2[key]}`,
    del: key => `- ${key}: ${obj1[key]}`,
  };

  const keys = Object.keys({ ...obj1, ...obj2 });
  return keys.reduce((acc, key) => {
    if (has(obj2, key)) {
      if (has(obj1, key)) {
        if (obj2[key] === obj1[key]) {
          return [...acc, printDiff.none(key)];
        }
        return [...acc, printDiff.add(key), printDiff.del(key)];
      }
      return [...acc, printDiff.add(key)];
    }
    return [...acc, printDiff.del(key)];
  }, []);
};

const compareFiles = (filePath1, filePath2) => {
  const data1 = parse(filePath1);
  const data2 = parse(filePath2);
  return `{\n ${compareObjects(data1, data2).join('\n ')}\n}`;
};

export const program = commander
  .description('Compares two configuration files and shows a difference.')
  .option('-V, --version', 'output the version number')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) => console.log(compareFiles(firstConfig, secondConfig)));

export default compareFiles;
