#!/bin/bash
node lib/index.js &
corepack yarn electron --no-sandbox /opt/wechat/dist/app &
node examples/easybot.mjs
