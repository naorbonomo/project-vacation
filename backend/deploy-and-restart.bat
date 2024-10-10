@echo off
echo Deploying files...
scp -i ../my_keypair.pem -r ./dist/* ubuntu@54.172.43.149:/home/ubuntu/backend
echo Restarting PM2 process...
ssh -i ../my_keypair.pem ubuntu@54.172.43.149 "/usr/bin/pm2 restart my-backend"
echo Deployment and restart complete.

