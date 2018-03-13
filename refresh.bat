ECHO OFF

SET PATH=%PATH%;%~dp0

taskkill /im node.exe /f

timeout 5

call gulp backup

timeout 5

call gulp clean

timeout 5

call gulp copy

timeout 5

call gulp watch
