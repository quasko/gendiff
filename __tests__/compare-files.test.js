import fs from 'fs';
import compareFiles from '../src';

const filesDiff = fs.readFileSync('__tests__/__fixtures__/result', 'utf8');
const testsDirPath = '__tests__/__fixtures__';
const fileTypes = ['.json', '.yml', '.ini'];

test.each(fileTypes)('compare %s files', type => expect(compareFiles(`${testsDirPath}/before${type}`, `${testsDirPath}/after${type}`)).toBe(filesDiff));
