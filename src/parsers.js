import yaml from 'js-yaml';

const parser = {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
};

export default (fileData, fileType) => parser[fileType](fileData);
