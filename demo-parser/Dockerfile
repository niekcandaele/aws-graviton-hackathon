FROM node:14-alpine as builder

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci 

# Bundle app source
COPY . .

RUN npm run build

RUN ls -la

FROM node:14-alpine as runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build

RUN npm ci --only=prod

RUN chown -R node:node /app

USER node

EXPOSE 4000

CMD ["npm", "start"]