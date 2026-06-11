/**
 * API URL校验功能测试脚本（仅测试校验失败场景）
 */

const http = require('http');

async function testApi(data) {
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/render',
      method: 'POST',
      headers: {
        'X-API-Key': 'Zkyc@565758',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve({ statusCode: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    req.write(jsonData);
    req.end();
  });
}

async function runTests() {
  console.log('===== API URL校验功能测试 =====\n');

  const testCases = [
    {
      name: '内网地址拦截（localhost）',
      data: {
        filename: 'test-localhost',
        posterVersion: 'qr-only',
        variables: {
          posterImage: 'http://localhost/test.jpg',
          qrCode: 'https://example.com'
        }
      },
      expectError: '禁止访问内网地址'
    },
    {
      name: '内网地址拦截（192.168.x.x）',
      data: {
        filename: 'test-internal',
        posterVersion: 'qr-only',
        variables: {
          posterImage: 'http://192.168.1.100/test.jpg',
          qrCode: 'https://example.com'
        }
      },
      expectError: '禁止访问内网地址'
    },
    {
      name: '不在白名单的域名',
      data: {
        filename: 'test-unallowed',
        posterVersion: 'qr-only',
        variables: {
          posterImage: 'https://example.com/test.jpg',
          qrCode: 'https://example.com'
        }
      },
      expectError: '不在允许列表中'
    },
    {
      name: '空URL',
      data: {
        filename: 'test-empty',
        posterVersion: 'qr-only',
        variables: {
          posterImage: '',
          qrCode: 'https://example.com'
        }
      },
      expectError: '只加入二维码模式需要提供'
    },
    {
      name: 'URL格式无效（缺少协议）',
      data: {
        filename: 'test-no-protocol',
        posterVersion: 'qr-only',
        variables: {
          posterImage: 'example.com/test.jpg',
          qrCode: 'https://example.com'
        }
      },
      expectError: 'URL格式无效'
    },
    {
      name: 'FTP协议不允许',
      data: {
        filename: 'test-ftp',
        posterVersion: 'qr-only',
        variables: {
          posterImage: 'ftp://example.com/test.jpg',
          qrCode: 'https://example.com'
        }
      },
      expectError: 'URL格式无效'
    },
    {
      name: '错误文件扩展名',
      data: {
        filename: 'test-wrong-ext',
        posterVersion: 'qr-only',
        variables: {
          posterImage: 'https://example.com/test.txt',
          qrCode: 'https://example.com'
        }
      },
      expectError: 'URL格式无效'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const { name, data, expectError } of testCases) {
    try {
      console.log(`测试: ${name}`);
      const result = await testApi(data);
      
      if (result.success === false && result.error?.includes(expectError)) {
        console.log('  ✅ 通过');
        passed++;
      } else {
        console.log('  ❌ 失败');
        console.log(`    预期错误包含: ${expectError}`);
        console.log(`    实际结果: ${result.error || JSON.stringify(result)}`);
        failed++;
      }
    } catch (e) {
      console.log('  ❌ 异常:', e.message);
      failed++;
    }
    console.log();
  }

  console.log('===== 测试结果 =====');
  console.log(`通过: ${passed}`);
  console.log(`失败: ${failed}`);
  console.log(`总计: ${testCases.length}`);
  console.log(`通过率: ${((passed / testCases.length) * 100).toFixed(1)}%`);
}

runTests().catch(console.error);