FROM node:18-alpine

WORKDIR /app
COPY easybot.mjs .
COPY package.json .
RUN npm install --production
CMD ["node", "easybot.mjs"]
