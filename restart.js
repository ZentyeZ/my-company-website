// 重启服务器脚本
const { spawn, exec } = require('child_process');
const net = require('net');

function killPort3000() {
  return new Promise((resolve) => {
    // 使用 Node.js 内置方法检查端口
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // 端口被占用，尝试找到并终止进程
        console.log('找到占用3000端口的进程，尝试终止...');

        // 使用 Windows wmic 命令
        exec('wmic process where "name=\'node.exe\'" get processid,commandline /format:list', (err, stdout) => {
          if (err) {
            console.log('无法自动终止进程，请手动终止 node 进程后重试');
            console.log('运行: taskkill /F /IM node.exe');
            resolve(false);
            return;
          }

          // 查找 node 进程
          const lines = stdout.split('\n');
          for (const line of lines) {
            if (line.includes('node.exe') && line.includes('server.js')) {
              const pidMatch = line.match(/ProcessId=(\d+)/);
              if (pidMatch) {
                const pid = pidMatch[1];
                exec(`taskkill /F /PID ${pid}`, (err) => {
                  if (err) {
                    console.log('终止进程失败');
                    resolve(false);
                  } else {
                    console.log('进程已终止');
                    setTimeout(resolve, 1000);
                  }
                });
                return;
              }
            }
          }

          console.log('未找到 server.js 进程');
          resolve(false);
        });
      } else {
        resolve(true);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(3000, '127.0.0.1');
  });
}

async function main() {
  console.log('=== ACELYNN 服务器重启工具 ===\n');

  const killed = await killPort3000();

  if (killed || true) {
    console.log('\n启动新服务器...');
    const server = spawn('node', ['server.js'], {
      cwd: __dirname,
      detached: true,
      stdio: 'ignore'
    });

    server.unref();

    console.log('服务器已在后台启动');
    console.log('访问: http://localhost:3000');
    console.log('管理后台: http://localhost:3000/admin.html');
  }
}

main();
