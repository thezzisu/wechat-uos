FROM node:18

RUN apt update && apt install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libgtk-3-0 libgbm1 libasound2 fonts-noto-cjk xterm
RUN mkdir -p /opt/wechat &&\
    mkdir -p /usr/lib/license &&\
    mkdir -p /opt/app
WORKDIR /opt/wechat
COPY ./package.json /opt/wechat/package.json
COPY ./yarn.lock /opt/wechat/yarn.lock
COPY ./.yarnrc.yml /opt/wechat/.yarnrc.yml
RUN corepack yarn
COPY ./dist/app /opt/wechat/dist/app
COPY ./dist/license/etc /etc
COPY ./dist/license/var /var
COPY ./dist/usr/lib/license /usr/lib/license
COPY ./scripts /opt/wechat/scripts
COPY ./dist /opt/wechat/dist
COPY ./static /opt/wechat/static
RUN chown root /opt/wechat/node_modules/electron/dist/chrome-sandbox &&\
    chmod 4755 /opt/wechat/node_modules/electron/dist/chrome-sandbox
USER node
ENTRYPOINT ["bash"]
CMD ["-c", "/opt/wechat/scripts/docker-entrypoint.sh"]
