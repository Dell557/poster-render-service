/**
 * URL校验器自测脚本
 * 运行方式: node test-url-validator.js
 */

const { validateImageUrl, validateImageUrls } = require('./src/utils/urlValidator');

// 测试用例
const testCases = [
  // ========== 预期通过的用例 ==========
  {
    name: '阿里云OSS合法URL',
    url: 'https://deepsightfuturexdf.oss-cn-beijing.aliyuncs.com/2026/05/22/bJPdZ9.jpg',
    expected: true
  },
  {
    name: '阿里云OSS子域名',
    url: 'https://example-copilot.bytedance.net/test.png',
    expected: false  // 不在白名单
  },
  {
    name: '七牛云合法URL',
    url: 'https://test-bucket.qiniudn.com/image.webp',
    expected: true
  },
  {
    name: '腾讯云COS合法URL',
    url: 'https://example-1251000000.cos.ap-shanghai.myqcloud.com/img.gif',
    expected: true
  },
  {
    name: 'HTTPS协议',
    url: 'https://deepsightfuturexdf.oss-cn-beijing.aliyuncs.com/test.jpg',
    expected: true
  },
  {
    name: 'HTTP协议',
    url: 'http://deepsightfuturexdf.oss-cn-beijing.aliyuncs.com/test.png',
    expected: true
  },

  // ========== 预期失败的用例 ==========
  {
    name: '空URL',
    url: '',
    expected: false
  },
  {
    name: 'undefined',
    url: undefined,
    expected: false
  },
  {
    name: 'null',
    url: null,
    expected: false
  },
  {
    name: 'localhost地址',
    url: 'http://localhost:3000/test.jpg',
    expected: false
  },
  {
    name: '127.0.0.1地址',
    url: 'http://127.0.0.1/test.png',
    expected: false
  },
  {
    name: '内网IP 192.168.x.x',
    url: 'http://192.168.1.100/image.jpg',
    expected: false
  },
  {
    name: '内网IP 10.x.x.x',
    url: 'http://10.0.0.1/image.png',
    expected: false
  },
  {
    name: '内网IP 172.16.x.x',
    url: 'http://172.16.0.1/image.gif',
    expected: false
  },
  {
    name: '没有协议',
    url: 'deepsightfuturexdf.oss-cn-beijing.aliyuncs.com/test.jpg',
    expected: false
  },
  {
    name: 'FTP协议',
    url: 'ftp://example.com/test.jpg',
    expected: false
  },
  {
    name: '不含图片扩展名',
    url: 'https://example.com/test',
    expected: false
  },
  {
    name: '错误扩展名',
    url: 'https://example.com/test.txt',
    expected: false
  },
  {
    name: '不在白名单的域名',
    url: 'https://example.com/test.jpg',
    expected: false
  },
  {
    name: '包含XSS字符',
    url: 'https://deepsightfuturexdf.oss-cn-beijing.aliyuncs.com/test"><script>alert(1)</script>.jpg',
    expected: true  // 格式正确，但会被转义
  },
  {
    name: '包含空格',
    url: 'https://example.com/test image.jpg',
    expected: false
  }
];

// 运行测试
console.log('===== URL校验器自测 =====\n');

let passed = 0;
let failed = 0;

testCases.forEach(({ name, url, expected }) => {
  const result = validateImageUrl(url);
  const actual = result.valid;
  const status = actual === expected ? '✅' : '❌';
  
  if (actual === expected) {
    passed++;
    console.log(`${status} ${name}`);
    // 如果包含XSS字符，检查是否被转义
    if (result.sanitizedUrl && url !== result.sanitizedUrl) {
      console.log(`   转义前: ${url}`);
      console.log(`   转义后: ${result.sanitizedUrl}`);
    }
  } else {
    failed++;
    console.log(`${status} ${name}`);
    console.log(`   URL: ${url}`);
    console.log(`   预期: ${expected ? '通过' : '失败'}`);
    console.log(`   实际: ${actual ? '通过' : '失败'}`);
    console.log(`   错误信息: ${result.error}`);
  }
});

console.log('\n===== 测试结果 =====');
console.log(`通过: ${passed}`);
console.log(`失败: ${failed}`);
console.log(`总计: ${testCases.length}`);
console.log(`通过率: ${((passed / testCases.length) * 100).toFixed(1)}%`);

// 批量校验测试
console.log('\n===== 批量校验测试 =====');
const batchUrls = [
  'https://deepsightfuturexdf.oss-cn-beijing.aliyuncs.com/test1.jpg',
  'http://localhost/test.jpg',
  'https://example.qiniu.com/test.png',
  'invalid-url'
];

const batchResult = validateImageUrls(batchUrls);
batchResult.forEach((result, index) => {
  console.log(`${result.valid ? '✅' : '❌'} URL ${index + 1}: ${result.url}`);
  if (!result.valid) {
    console.log(`   错误: ${result.error}`);
  }
});
