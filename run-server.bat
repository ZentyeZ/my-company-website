@echo off
title ACELYNN 服务器

echo 启动 ACELYNN 服务器...

:start
node server.js
echo 服务器进程退出，正在重启...
timeout /t 3 /nobreak >nul
goto start
