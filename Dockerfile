FROM node:20-alpine AS core
ARG USER=node1
RUN addgroup --system $USER
RUN adduser --system --ingroup $USER $USER
RUN mkdir -p /opt/node
WORKDIR /opt/node
COPY package*.json ./
COPY migrations ./migrations
RUN chown -R $USER:$USER /opt/node && chmod -R 755 /opt/node
RUN chown -R $USER:$USER ./migrations && chmod -R 755 ./migrations
USER $USER

FROM core AS development
COPY src ./src
COPY test ./test
COPY tsconfig*.json ./
COPY nest-cli.json .
RUN npm ci
RUN npm run build
RUN npm install
CMD ["npm", "run", "start:dev"]

FROM core AS production
COPY --from=development /opt/node/dist ./dist
RUN npm install --only=production
CMD ["npm", "run", "start:prod"]
