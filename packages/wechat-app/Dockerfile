FROM node:18 as builder

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY packages/wechat-app packages/wechat-app
RUN corepack yarn
RUN corepack yarn workspace wechat-app zx scripts/prepare.mjs
RUN corepack yarn workspace wechat-app zx scripts/patch.mjs

FROM node:18
RUN apt update && apt install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libgtk-3-0 libgbm1 libasound2 fonts-noto-cjk xterm
RUN mkdir -p /usr/lib/license
COPY --from=builder /app/packages/wechat-app/dist/license/etc /etc
COPY --from=builder /app/packages/wechat-app/dist/license/var /var
COPY --from=builder /app/packages/wechat-app/dist/usr/lib/license /usr/lib/license
WORKDIR /app
COPY --from=builder /app/packages/wechat-app/dist/app dist/app
COPY --from=builder /app/packages/wechat-app/package.json package.json
RUN npm install --production
RUN chown root /app/node_modules/electron/dist/chrome-sandbox &&\
    chmod 4755 /app/node_modules/electron/dist/chrome-sandbox
USER node
CMD ["npm", "exec", "electron", "--", "--no-sandbox", "/app/dist/app"]
