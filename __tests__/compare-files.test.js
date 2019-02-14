import fs from 'fs';
import compareFiles from '../src';

const testsDirPath = '__tests__/__fixtures__';
const fileTypes = ['.json', '.yml', '.ini'];

test.each(fileTypes)('compare flat %s files', (type) => {
  const filesDiff = fs.readFileSync(`${testsDirPath}/result-flat`, 'utf8');
  expect(compareFiles(`${testsDirPath}/before-flat${type}`, `${testsDirPath}/after-flat${type}`)).toBe(filesDiff);
});

test.each(fileTypes)('compare nested %s files', (type) => {
  const filesDiff = fs.readFileSync(`${testsDirPath}/result`, 'utf8');
  expect(compareFiles(`${testsDirPath}/before${type}`, `${testsDirPath}/after${type}`)).toBe(filesDiff);
});

test.each(fileTypes)('compare flat %s files --format plain', (type) => {
  const filesDiff = fs.readFileSync(`${testsDirPath}/result-flat-plain`, 'utf8');
  expect(compareFiles(`${testsDirPath}/before-flat${type}`, `${testsDirPath}/after-flat${type}`, 'plain')).toBe(filesDiff);
});

test.each(fileTypes)('compare nested %s files --format plain', (type) => {
  const filesDiff = fs.readFileSync(`${testsDirPath}/result-plain`, 'utf8');
  expect(compareFiles(`${testsDirPath}/before${type}`, `${testsDirPath}/after${type}`, 'plain')).toBe(filesDiff);
});
