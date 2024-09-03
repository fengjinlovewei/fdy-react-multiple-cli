# build stage
FROM node:18-alpine as build-stage
ENV TZ Asia/Shanghai
#参数，node的环境为生产环境
ENV NODE_ENV=production

WORKDIR /app
COPY . /app
RUN npm config set registry https://registry.npmmirror.com
# Install pnpm
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN env PACKAGE=all pnpm build

# production stage
FROM nginx:1.27-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3333
CMD ["nginx", "-g", "daemon off;"]

# docker build . -t fengjin/react-multiple-cli
# docker run -it --name react-multiple-cli -p 4000:3333 -d fengjin/react-multiple-cli