FROM node:14-alpine as builder
RUN apk update
RUN apk upgrade
RUN apk add --no-cache bash git openssh
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY index.ts tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:14-alpine
ENV NODE_ENV=production
RUN apk update
RUN apk upgrade
RUN apk add --no-cache bash git openssh
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json /app/.npmrc ./
RUN npm ci --production
COPY --from=builder /app/build/ ./build
CMD ["npm", "start"]
