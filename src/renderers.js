import renderText from './renderers/render-text';
import renderPlain from './renderers/render-plain';

const render = {
  text: renderText,
  plain: renderPlain,
};

export default (data, format) => render[format](data);
