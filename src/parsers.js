import yaml from 'js-yaml';
import { decode } from 'ini';

const parser = {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': decode,
};

export default (fileData, fileType) => parser[fileType](fileData);
