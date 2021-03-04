'use strict';

require('chai').should();

describe('hexo-filter-links', () => {
  const Hexo = require('hexo');
  const hexo = new Hexo();

  const linksFilter = require('../lib/filter').bind(hexo);

  hexo.config.url = 'https://example.com';
  hexo.config.links = {golink:true};

  describe('Default', () => {
    const content = [
      '# External link test',
      '1. External link',
      '<a href="https://hexo.io/">Hexo</a>',
      '2. External link with existed "rel" Attribute',
      '<a rel="license" href="https://github.com/naicfeng/hexo-filter-links/blob/master/LICENSE">Hexo</a>',
      '<a href="https://github.com/naicfeng/hexo-filter-links/blob/master/LICENSE" rel="license">Hexo</a>',
      '3. External link with existing "rel=noopener", "rel=external" or "rel=noreferrer"',
      '<a rel="noopener" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="noreferrer">Hexo</a>',
      '<a rel="noopener noreferrer" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="external noreferrer">Hexo</a>',
      '4. External link with Other Attributes',
      '<a class="img" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" class="img">Hexo</a>',
      '5. Internal link',
      '<a href="/archives/foo.html">Link</a>',
      '6. Ignore links don\'t have "href" attribute',
      '<a>Anchor</a>',
      '7. href is not url',
      '<a href="javascript;">Example Domain</a>'
    ].join('\n');

    const expected = [
      '# External link test',
      '1. External link',
      '<a href="https://example.com/go/?aHR0cHM6Ly9oZXhvLmlvLw==" rel="noopener external nofollow noreferrer">Hexo</a>',
      '2. External link with existed "rel" Attribute',
      '<a href="https://example.com/go/?aHR0cHM6Ly9naXRodWIuY29tL25haWNmZW5nL2hleG8tZmlsdGVyLWxpbmtzL2Jsb2IvbWFzdGVyL0xJQ0VOU0U=" rel="noopener external nofollow noreferrer license">Hexo</a>',
      '<a href="https://example.com/go/?aHR0cHM6Ly9naXRodWIuY29tL25haWNmZW5nL2hleG8tZmlsdGVyLWxpbmtzL2Jsb2IvbWFzdGVyL0xJQ0VOU0U=" rel="noopener external nofollow noreferrer license">Hexo</a>',
      '3. External link with existing "rel=noopener", "rel=external" or "rel=noreferrer"',
      '<a href="https://example.com/go/?aHR0cHM6Ly9oZXhvLmlvLw==" rel="noopener external nofollow noreferrer">Hexo</a>',
      '<a href="https://example.com/go/?aHR0cHM6Ly9oZXhvLmlvLw==" rel="noopener external nofollow noreferrer">Hexo</a>',
      '<a href="https://example.com/go/?aHR0cHM6Ly9oZXhvLmlvLw==" rel="noopener external nofollow noreferrer">Hexo</a>',
      '<a href="https://example.com/go/?aHR0cHM6Ly9oZXhvLmlvLw==" rel="noopener external nofollow noreferrer">Hexo</a>',
      '4. External link with Other Attributes',
      '<a class="img" href="https://example.com/go/?aHR0cHM6Ly9oZXhvLmlvLw==" rel="noopener external nofollow noreferrer">Hexo</a>',
      '<a href="https://example.com/go/?aHR0cHM6Ly9oZXhvLmlvLw==" rel="noopener external nofollow noreferrer" class="img">Hexo</a>',
      '5. Internal link',
      '<a href="/archives/foo.html">Link</a>',
      '6. Ignore links don\'t have "href" attribute',
      '<a>Anchor</a>',
      '7. href is not url',
      '<a href="javascript;">Example Domain</a>'
    ].join('\n');

    it('Default to field = "site"', () => {
      const result = linksFilter(content);

      result.should.eql(expected);
    });

    it('field = "post"', () => {
      hexo.config.links.field = 'post';

      const data = { content };
      const result = linksFilter(data).content;

      result.should.eql(expected);

      hexo.config.links.field = 'site';
    });
  });

  describe('Exclude', () => {
    const content = [
      '# Exclude link test',
      '1. External link',
      '<a href="https://hexo.io/">Hexo</a>',
      '2. Ignore links whose hostname is same as config',
      '<a href="https://example.com">Example Domain</a>',
      '3. Ignore links whose hostname is included in exclude',
      '<a href="https://example.org">Example Domain</a>',
      '<a href="https://test.example.net">Example Domain</a>',
      '4. Wildcard hostname is included in exclude',
      '<a href="https://test.example2.net">Example Domain</a>'
    ].join('\n');

    it('String', () => {
      hexo.config.links.exclude = ['example.org', 'test.example.net', '*.example2.net'];

      const result = linksFilter(content);

      result.should.eql([
        '# Exclude link test',
        '1. External link',
        '<a href="https://example.com/go/?aHR0cHM6Ly9oZXhvLmlvLw==" rel="noopener external nofollow noreferrer">Hexo</a>',
        '2. Ignore links whose hostname is same as config',
        '<a href="https://example.com">Example Domain</a>',
        '3. Ignore links whose hostname is included in exclude',
        '<a href="https://example.org">Example Domain</a>',
        '<a href="https://test.example.net">Example Domain</a>',
        '4. Wildcard hostname is included in exclude',
        '<a href="https://test.example2.net">Example Domain</a>'
      ].join('\n'));
    });

    it('Array', () => {
      hexo.config.links.exclude = 'example.org';

      const result = linksFilter(content);

      result.should.eql([
        '# Exclude link test',
        '1. External link',
        '<a href="https://example.com/go/?aHR0cHM6Ly9oZXhvLmlvLw==" rel="noopener external nofollow noreferrer">Hexo</a>',
        '2. Ignore links whose hostname is same as config',
        '<a href="https://example.com">Example Domain</a>',
        '3. Ignore links whose hostname is included in exclude',
        '<a href="https://example.org">Example Domain</a>',
        '<a href="https://example.com/go/?aHR0cHM6Ly90ZXN0LmV4YW1wbGUubmV0" rel="noopener external nofollow noreferrer">Example Domain</a>',
        '4. Wildcard hostname is included in exclude',
        '<a href="https://example.com/go/?aHR0cHM6Ly90ZXN0LmV4YW1wbGUyLm5ldA==" rel="noopener external nofollow noreferrer">Example Domain</a>'
      ].join('\n'));
    });
  });
});
