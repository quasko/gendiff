import fs from 'fs';
import compareFiles from '../src';

const testsDirPath = '__tests__/__fixtures__';
const fileTypes = ['.json', '.yml', '.ini'];

test.each(fileTypes)('compare %s files', (type) => {
  const filesDiff = fs.readFileSync(`${testsDirPath}/result`, 'utf8');
  expect(compareFiles(`${testsDirPath}/before${type}`, `${testsDirPath}/after${type}`)).toBe(filesDiff);
});
