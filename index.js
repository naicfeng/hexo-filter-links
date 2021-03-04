/* global hexo */

'use strict';

hexo.config.links = Object.assign({
  enable: true,
  field: 'site',
  exclude: []
}, hexo.config.links);

const config = hexo.config.links;

if (!config.enable) return;

if (config.field === 'post') {
  hexo.extend.filter.register('after_post_render', require('./lib/filter'));
} else {
  hexo.extend.filter.register('after_render:html', require('./lib/filter'));
}
hexo.extend.generator.register('links', require('./lib/generator'));