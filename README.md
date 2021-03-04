# hexo-filter-links

[![npm version](https://badge.fury.io/js/hexo-filter-links.svg)](https://www.npmjs.com/package/hexo-filter-links)
[![npm license](https://img.shields.io/npm/l/hexo-filter-links)](./LICENSE)
![npm download](https://img.shields.io/npm/dt/hexo-filter-links)

All external links to Internal links automatically.

一个修改外部链接为内部链接的Hexo插件。

`hexo-filter-links` Modify links Looks like `example.com/go/?ZXhhbXBsZS5jb20=`


## Installations

```bash
$ npm i hexo-filter-links --save
```

## Options

```yaml
links:
  enable: true
  field: 'site'
  exclude:
    - 'exclude1.com'
    - 'exclude2.com'
```

- **enable** - Enable the plugin. Default value is `true`.
- **field** - The scope you want the plugin to proceed, can be 'site' or 'post'. Default value is `site`.
  - 'post' - Only Modify external links in your post content
  - 'site' - Modify external links of whole sites
- **exclude** - Exclude hostname. Specify subdomain when applicable, including `www`.
  - 'exclude1.com' does not apply to `www.exclude1.com` nor `en.exclude1.com`.
