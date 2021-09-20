# TODO: we can make this slimmer by using Alpine based images
FROM node
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

RUN chown -R node:node /usr/src/app
USER node

CMD [ "npm", "run", "start" ]