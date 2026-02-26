@echo off
echo 正在终止现有服务器进程...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo 正在启动服务器...
start cmd /k "node server.js"
echo 服务器已启动！
echo 请访问: http://localhost:3000
