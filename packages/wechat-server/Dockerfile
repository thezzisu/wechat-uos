FROM node:18 as builder

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY packages/wechat-server packages/wechat-server
RUN corepack yarn
RUN corepack yarn workspace wechat-server tsc

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/packages/wechat-server/lib lib
COPY --from=builder /app/packages/wechat-server/static static
COPY --from=builder /app/packages/wechat-server/package.json .
RUN npm install --production

CMD ["npm", "start"]
