FROM node:20-alpine  AS builder

WORKDIR /usr/src/app

# 仅复制 package.json 和 package-lock.json 以利用缓存
COPY ./package*.json ./

# 安装依赖
RUN npm install --registry=https://registry.npmmirror.com

# 复制其余的源代码
COPY ./ ./

RUN npm run build && cp -r ./src/mock ./dist

# 第二阶段: 运行阶段
FROM ghcr.io/puppeteer/puppeteer:latest

USER root

RUN mkdir -p /cache

# 设置工作目录
WORKDIR /usr/src/app


# 从构建阶段复制构建好的 dist 目录
COPY --from=builder /usr/src/app/dist ./

RUN npm install --registry=https://registry.npmmirror.com

RUN mkdir -p server && mv -f server.js server/index.js

# 如果需要暴露端口，例如 3000
EXPOSE 3000

# 定义容器启动时执行的命令
CMD ["node", "server/index.js"]