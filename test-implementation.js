/**
 * 综合测试脚本 - 验证URL校验和错误处理功能
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
  console.log('===== 综合功能测试 =====\n');

  const testCases = [
    {
      name: '✅ 正常渲染（阿里云OSS）',
      data: {
        filename: 'test-success',
        posterVersion: 'doctor',
        variables: {
          posterImage: 'https://deepsightfuturexdf.oss-cn-beijing.aliyuncs.com/2026/05/22/bJPdZ9.jpg',
          qrCode: 'https://example.com' // 二维码内容，不是图片URL
        }
      },
      expectSuccess: true
    },
    {
      name: '❌ URL校验 - 内网地址拦截',
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
      name: '❌ URL校验 - 域名不在白名单',
      data: {
        filename: 'test-unallowed',
        posterVersion: 'doctor',
        variables: {
          posterImage: 'https://example.com/test.jpg',
          qrCode: 'https://example.com'
        }
      },
      expectError: '不在允许列表中'
    },
    {
      name: '❌ URL校验 - 格式无效',
      data: {
        filename: 'test-invalid',
        posterVersion: 'doctor',
        variables: {
          posterImage: 'example.com/test.jpg',
          qrCode: 'https://example.com'
        }
      },
      expectError: 'URL格式无效'
    },
    {
      name: '❌ 参数校验 - 缺少必填字段',
      data: {
        filename: 'test-missing',
        posterVersion: 'qr-only',
        variables: {
          posterImage: 'https://deepsightfuturexdf.oss-cn-beijing.aliyuncs.com/test.jpg'
          // 缺少 qrCode
        }
      },
      expectError: '只加入二维码模式需要提供'
    },
    {
      name: '❌ 参数校验 - 无效版本',
      data: {
        filename: 'test-invalid-version',
        posterVersion: 'invalid-version',
        variables: {
          posterImage: 'https://deepsightfuturexdf.oss-cn-beijing.aliyuncs.com/test.jpg',
          qrCode: 'https://example.com'
        }
      },
      expectError: '缺少必填字段 posterVersion'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const { name, data, expectSuccess, expectError } of testCases) {
    try {
      console.log(`测试: ${name}`);
      const result = await testApi(data);
      
      if (expectSuccess) {
        if (result.success === true) {
          console.log('  ✅ 通过');
          console.log(`   返回: ${result.message}`);
          passed++;
        } else {
          console.log('  ❌ 失败');
          console.log(`   预期成功，实际错误: ${result.error}`);
          failed++;
        }
      } else if (expectError) {
        if (result.success === false && result.error?.includes(expectError)) {
          console.log('  ✅ 通过');
          console.log(`   错误信息: ${result.error}`);
          // 检查是否包含 errorType（双通道策略）
          if (result.errorType) {
            console.log(`   错误类型: ${result.errorType} ✅`);
          }
          passed++;
        } else {
          console.log('  ❌ 失败');
          console.log(`   预期错误包含: ${expectError}`);
          console.log(`   实际结果: ${result.error || JSON.stringify(result)}`);
          failed++;
        }
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
  
  if (passed === testCases.length) {
    console.log('\n🎉 所有测试通过！');
  } else {
    console.log('\n⚠️ 部分测试失败，请检查日志');
  }
}

runTests().catch(console.error);