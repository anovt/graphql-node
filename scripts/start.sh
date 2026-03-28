#!/bin/bash
cd /var/www/nodeapp
pm2 stop all || true
pm2 start app.js
