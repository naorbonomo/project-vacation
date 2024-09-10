@echo off

cd backend
start cmd /c "code . && cd ../frontend && code . && npm start"

