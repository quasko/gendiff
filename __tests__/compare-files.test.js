import fs from 'fs';
import compareFiles from '../src';

test('compareFiles', () => {
  const result = fs.readFileSync('__tests__/__fixtures__/result', 'utf8');
  const file1 = '__tests__/__fixtures__/before.json';
  const file2 = '__tests__/__fixtures__/after.json';
  expect(compareFiles(file1, file2)).toBe(result);
});
