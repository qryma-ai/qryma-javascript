#!/usr/bin/env node
/**
 * 最小化使用示例
 *
 * 只需要 query 和 api_key，其他都不需要
 */

// To install: npm i qryma-javascript
const { qryma } = require('./dist');

const client = qryma({
  apiKey: 'ak-e0851bc87d4e4876a54324e58580f920',
  baseUrl: 'http://127.0.0.1:31001',
  timeout: 60,
});

client
  .search('ces', {
    lang: 'zh-CN',
  })
  .then(console.log);
