import renderText from './render-text';
import renderPlain from './render-plain';

const render = {
  text: renderText,
  plain: renderPlain,
  json: JSON.stringify,
};

export default (data, format) => render[format](data);
