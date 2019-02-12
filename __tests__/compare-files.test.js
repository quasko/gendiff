import fs from 'fs';
import compareFiles from '../src';

const filesDiff = fs.readFileSync('__tests__/__fixtures__/result', 'utf8');

test('compare JSON Files', () => {
  const jsonPathBefore = '__tests__/__fixtures__/before.json';
  const jsonPathAfter = '__tests__/__fixtures__/after.json';
  expect(compareFiles(jsonPathBefore, jsonPathAfter)).toBe(filesDiff);
});

test('compare YAML Files', () => {
  const yamlPathBefore = '__tests__/__fixtures__/before.yml';
  const yamlPathAfter = '__tests__/__fixtures__/after.yml';
  expect(compareFiles(yamlPathBefore, yamlPathAfter)).toBe(filesDiff);
});
