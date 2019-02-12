import { extname } from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

const parser = {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
};

export default (filePath) => {
  const fileData = fs.readFileSync(filePath, 'utf8');
  const fileType = extname(filePath);
  return parser[fileType](fileData);
};
