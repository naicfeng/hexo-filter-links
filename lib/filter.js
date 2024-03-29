'use strict';

const { parse } = require('url');

function isExternal(url, config) {
  const exclude = config.links.exclude;
  const data = parse(url);
  const host = data.hostname;
  const sitehost = parse(config.url).hostname || config.url;

  if (!data.protocol || !sitehost) return false;
  if (exclude && exclude.length) {
    for (const i of exclude) {
      //通配符匹配
      if (i.substring(0, 2) === '*.') {
        if (host && host.indexOf(i.replace("*.", "")) > 0) return false;
      }
      if (host === i) return false;
    }
  }

  if (host !== sitehost) return true;

  return false;
}

module.exports = function (data) {
  const hexo = this;
  const config = hexo.config;

  const exclude = config.links.exclude;
  if (exclude && !Array.isArray(exclude)) {
    config.links.exclude = [exclude];
  }

  const filterExternal = data => {
    return data.replace(/<a.*?(href=['"](.*?)['"]).*?>/gi, (str, hrefStr, href) => {
      if (!isExternal(href, config)) return str;
      if (href.match(/http(?:s)?:\/\/.+/i) === null) return str;
      let noFollow = ['noopener', 'external', 'nofollow', 'noreferrer'];

      if (/rel=/gi.test(str)) {
        str = str.replace(/\srel="(.*?)"/gi, (relStr, rel) => {
          rel = rel.split(' ');
          noFollow.push(...rel);
          // De-duplicate
          noFollow = [...new Set(noFollow)];

          return '';
        });
      }

      let NewhrefStr = new Buffer.from(href).toString('base64');
      NewhrefStr = 'href="' + config.url + '/go/#' + NewhrefStr + '"';

      return str.replace(hrefStr, `${NewhrefStr} rel="${noFollow.join(' ')}"`);
    });
  };

  if (config.links.field === 'post') {
    data.content = filterExternal(data.content);
  } else {
    data = filterExternal(data);
  }

  return data;
};
