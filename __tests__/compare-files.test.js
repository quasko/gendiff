import fs from 'fs';
import compareFiles from '../src';

const testsDirPath = '__tests__/__fixtures__';
//const fileTypes = ['.json', '.yml', '.ini'];
const fileTypes = ['.json'];

test.each(fileTypes)('compare %s files', (type) => {
  const filesDiff = fs.readFileSync(`${testsDirPath}/r`, 'utf8');
  expect(compareFiles(`${testsDirPath}/b${type}`, `${testsDirPath}/a${type}`)).toBe(filesDiff);
});
