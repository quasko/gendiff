import fs from 'fs';
import compareFiles from '../src';

const filesDiff = fs.readFileSync('__tests__/__fixtures__/result', 'utf8');

test('compare JSON Files', () => {
  const filePath1 = '__tests__/__fixtures__/before.json';
  const filePath2 = '__tests__/__fixtures__/after.json';
  expect(compareFiles(filePath1, filePath2)).toBe(filesDiff);
});

test('compare YAML Files', () => {
  const filePath1 = '__tests__/__fixtures__/before.yml';
  const filePath2 = '__tests__/__fixtures__/after.yml';
  expect(compareFiles(filePath1, filePath2)).toBe(filesDiff);
});
