import renderText from './renderers/render-text';
import renderPlain from './renderers/render-plain';

const render = {
  text: renderText,
  plain: renderPlain,
  json: JSON.stringify,
};

export default (data, format) => render[format](data);
