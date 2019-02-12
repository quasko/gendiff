import commander from 'commander';
import fs from 'fs';
import has from 'lodash/has';

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

const compareJSONFiles = (file1, file2) => {
  const data1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
  const data2 = JSON.parse(fs.readFileSync(file2, 'utf8'));
  return `{\n ${compareObjects(data1, data2).join('\n ')}\n}`;
};

export const program = commander
  .description('Compares two configuration files and shows a difference.')
  .option('-V, --version', 'output the version number')
  .option('-f, --format [type]', 'Output format')
  // .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => console.log(compareJSONFiles(firstConfig, secondConfig)));

export default compareJSONFiles;
